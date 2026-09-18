/**
 * Cross-user authorization checks.
 *
 * Runs the real controllers and services against an in-memory SQLite database
 * with two users, asserting that user A can never read or modify anything that
 * belongs to user B. Run with: npx ts-node src/__checks__/authorization.check.ts
 */
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

import { Sequelize } from "sequelize-typescript";
import { Response } from "express";
import models, { User, Category, Note } from "../models";
import { CustomRequest } from "../types/CustomRequest";
import * as categoryController from "../controllers/categoryController";
import * as noteController from "../controllers/noteController";
import * as authController from "../controllers/authController";

// --- tiny assertion harness -------------------------------------------------
let failures = 0;
const check = (name: string, actual: unknown, expected: unknown) => {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  const ok = a === e;
  if (!ok) failures++;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${name}` +
      (ok ? "" : `\n        esperado ${e}\n        obtenido ${a}`),
  );
};

// --- express req/res doubles ------------------------------------------------
type Captured = { status: number; body: any };

const makeRes = (captured: Captured): Response => {
  const res: any = {};
  res.status = (code: number) => {
    captured.status = code;
    return res;
  };
  res.json = (body: any) => {
    // Round-trip through JSON so model toJSON()/serialization is exercised
    // exactly as it would be on the wire.
    captured.body = JSON.parse(JSON.stringify(body));
    return res;
  };
  return res as Response;
};

const callAs = async (
  handler: (req: any, res: Response) => Promise<any>,
  user: { id: number; email: string } | undefined,
  parts: { params?: any; body?: any } = {},
): Promise<Captured> => {
  const captured: Captured = { status: 200, body: undefined };
  const req = {
    user,
    params: parts.params ?? {},
    body: parts.body ?? {},
    headers: {},
  } as unknown as CustomRequest;
  await handler(req, makeRes(captured));
  return captured;
};

// --- fixtures ---------------------------------------------------------------
type World = {
  userA: { id: number; email: string };
  userB: { id: number; email: string };
  catB: Category;
  noteB: Note;
  catA: Category;
  noteA: Note;
};

// Fresh rows per scenario: several checks are destructive (they try to delete
// or detach B's data), so sharing fixtures would let a successful attack make
// the following checks pass vacuously.
let seedCounter = 0;

const seed = async (): Promise<World> => {
  const n = ++seedCounter;
  const a = await User.create({
    name: "A",
    email: `a${n}@test.com`,
    password: "hash-a",
  });
  const b = await User.create({
    name: "B",
    email: `b${n}@test.com`,
    password: "hash-b",
  });

  const catA = await Category.create({ name: "CatA", userId: a.id });
  const catB = await Category.create({ name: "CatB-SECRETA", userId: b.id });

  const noteA = await Note.create({
    title: "NotaA",
    content: "de A",
    userId: a.id,
    value: 0,
  });
  const noteB = await Note.create({
    title: "NotaB",
    content: "de B",
    userId: b.id,
    value: 0,
  });
  await noteB.$set("categories", [catB]);

  return {
    userA: { id: a.id, email: a.email },
    userB: { id: b.id, email: b.email },
    catA,
    catB,
    noteA,
    noteB,
  };
};

const run = async () => {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  sequelize.addModels(models as any);
  await sequelize.sync({ force: true });

  console.log("\n--- Categorías: A intentando tocar las de B ---");

  {
    const w = await seed();
    const asA = w.userA;
    const r = await callAs(categoryController.getCategoryById, asA, {
      params: { id: String(w.catB.id) },
    });
    check("GET /categories/:id de B -> 404", r.status, 404);
    check(
      "GET /categories/:id de B no filtra el nombre",
      JSON.stringify(r.body ?? "").includes("CatB-SECRETA"),
      false,
    );
  }

  {
    const w = await seed();
    const asA = w.userA;
    const r = await callAs(categoryController.updateCategory, asA, {
      params: { id: String(w.catB.id) },
      body: { name: "hackeado" },
    });
    check("PUT /categories/:id de B -> 404", r.status, 404);
    await w.catB.reload();
    check("la categoría de B NO fue renombrada", w.catB.name, "CatB-SECRETA");
  }

  {
    const w = await seed();
    const asA = w.userA;
    const r = await callAs(categoryController.deleteCategory, asA, {
      params: { id: String(w.catB.id) },
    });
    check("DELETE /categories/:id de B -> 404", r.status, 404);
    const still = await Category.findByPk(w.catB.id);
    check("la categoría de B SIGUE existiendo", still !== null, true);
  }

  {
    const w = await seed();
    const asA = w.userA;
    const r = await callAs(categoryController.getCategoriesByNote, asA, {
      params: { noteId: String(w.noteB.id) },
    });
    check("GET /categories/note/:id de B -> 404", r.status, 404);
    check(
      "no filtra categorías de la nota de B",
      JSON.stringify(r.body ?? "").includes("CatB-SECRETA"),
      false,
    );
  }

  console.log("\n--- Fuga cross-tenant en 'categorías no asignadas' ---");

  {
    // Nota de A sin ninguna categoría: el caso que devolvía el catálogo entero.
    const w = await seed();
    const asA = w.userA;
    const r = await callAs(categoryController.getCategoriesNotInNote, asA, {
      params: { noteId: String(w.noteA.id) },
    });
    check("GET not-in sobre nota propia -> 200", r.status, 200);
    const names = (r.body ?? []).map((c: any) => c.name).sort();
    check("solo devuelve categorías de A", names, ["CatA"]);
  }

  {
    const w = await seed();
    const asA = w.userA;
    const r = await callAs(categoryController.getCategoriesNotInNote, asA, {
      params: { noteId: String(w.noteB.id) },
    });
    check("GET not-in sobre nota de B -> 404", r.status, 404);
  }

  console.log("\n--- Notas: A intentando modificar las de B ---");

  {
    const w = await seed();
    const asA = w.userA;
    const r = await callAs(noteController.removeCategoryFromNote, asA, {
      body: { noteId: w.noteB.id, categoryId: w.catB.id },
    });
    check("POST remove-category sobre nota de B -> 404", r.status, 404);
    const cats = await w.noteB.$get("categories");
    check("la nota de B conserva su categoría", cats.length, 1);
  }

  {
    const w = await seed();
    const asA = w.userA;
    const r = await callAs(noteController.addCategoryToNote, asA, {
      body: { noteId: w.noteB.id, categoryId: w.catA.id },
    });
    check("POST add-category sobre nota de B -> 404", r.status, 404);
    const cats = await w.noteB.$get("categories");
    check("no se inyectó una categoría de A en la nota de B", cats.length, 1);
  }

  {
    // A crea una nota propia pero pasando el id de una categoría de B.
    const w = await seed();
    const asA = w.userA;
    const r = await callAs(noteController.createNote, asA, {
      body: { title: "n", content: "c", categories: [w.catB.id] },
    });
    check("POST /notes ignora categorías ajenas -> 201", r.status, 201);
    check(
      "la nota creada NO queda con la categoría de B",
      (r.body?.categories ?? []).length,
      0,
    );
  }

  {
    const w = await seed();
    const asA = w.userA;
    const r = await callAs(noteController.updateNote, asA, {
      params: { id: String(w.noteA.id) },
      body: { title: "n2", content: "c2", categories: [w.catB.id] },
    });
    check("PUT /notes/:id ignora categorías ajenas", r.status, 200);
    check(
      "la nota de A NO queda con la categoría de B",
      (r.body?.categories ?? []).length,
      0,
    );
  }

  {
    const w = await seed();
    const asA = w.userA;
    const r = await callAs(noteController.updateNote, asA, {
      params: { id: String(w.noteB.id) },
      body: { title: "hackeado", content: "hackeado" },
    });
    check("PUT /notes/:id de B -> 404", r.status, 404);
    await w.noteB.reload();
    check("la nota de B NO fue modificada", w.noteB.title, "NotaB");
  }

  console.log("\n--- Auth: el hash de la contraseña no debe salir ---");

  {
    const captured: Captured = { status: 200, body: undefined };
    const req = {
      body: { name: "C", email: "c@test.com", password: "secreto123" },
      headers: {},
      params: {},
    } as any;
    await authController.register(req, makeRes(captured));
    check("POST /auth/register -> 201", captured.status, 201);
    check(
      "register NO devuelve el campo password",
      Object.prototype.hasOwnProperty.call(captured.body?.user ?? {}, "password"),
      false,
    );
    check("register igual devuelve token", typeof captured.body?.token, "string");
    check("register devuelve el email", captured.body?.user?.email, "c@test.com");

    const stored = await User.findOne({ where: { email: "c@test.com" } });
    check("la contraseña se guardó hasheada", stored!.password.startsWith("$2"), true);
  }

  {
    const captured: Captured = { status: 200, body: undefined };
    const req = {
      body: { email: "c@test.com", password: "secreto123" },
      headers: {},
      params: {},
    } as any;
    await authController.login(req, makeRes(captured));
    check("POST /auth/login -> 200", captured.status, 200);
    check(
      "login NO devuelve el campo password",
      Object.prototype.hasOwnProperty.call(captured.body?.user ?? {}, "password"),
      false,
    );
    check("login igual devuelve token", typeof captured.body?.token, "string");
  }

  {
    const captured: Captured = { status: 200, body: undefined };
    const req = {
      body: { email: "c@test.com", password: "password-incorrecta" },
      headers: {},
      params: {},
    } as any;
    await authController.login(req, makeRes(captured));
    check("login con password incorrecta -> 401", captured.status, 401);
  }

  await sequelize.close();

  console.log(
    failures === 0
      ? "\n✅ TODAS LAS COMPROBACIONES PASARON"
      : `\n❌ ${failures} COMPROBACIÓN(ES) FALLARON`,
  );
  process.exit(failures === 0 ? 0 : 1);
};

run().catch((err) => {
  console.error("El chequeo se cayó:", err);
  process.exit(1);
});
