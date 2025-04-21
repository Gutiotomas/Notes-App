export interface NoteAttributes {
  id: number;
  title: string;
  content: string;
  isArchived: boolean;
  userId: number;
}

export type NoteCreationAttributes = Omit<NoteAttributes, "id" | "isArchived">;

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
  };
}
