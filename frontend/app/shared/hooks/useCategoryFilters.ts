import { useCallback, useEffect, useMemo, useState } from "react";

// Notes keep their category filters per tab, so leaving a list to edit a note
// (and coming back through save, the navbar or the browser's back button)
// does not drop the filters the user had applied.
const STORAGE_PREFIX = "notes-app:category-filters:";

type FilterableNote = {
  categories?: { id: number | string }[] | null;
};

type FilterCategory = {
  id: number;
  name: string;
};

const storageKeyFor = (scope: string) => `${STORAGE_PREFIX}${scope}`;

// sessionStorage throws in private mode and is missing during SSR,
// so every access degrades to "no stored filters" instead of breaking the page.
const readStoredFilters = (scope: string): number[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.sessionStorage.getItem(storageKeyFor(scope));
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map(Number).filter((id) => Number.isInteger(id));
  } catch {
    return [];
  }
};

// Called on logout: category ids belong to a single user, so they must not
// leak into the next session opened in the same tab.
export const clearStoredCategoryFilters = () => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    Object.keys(window.sessionStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => window.sessionStorage.removeItem(key));
  } catch {
    // Ignore: losing the cleanup is preferable to breaking logout.
  }
};

export const useCategoryFilters = (
  scope: string,
  categories: FilterCategory[],
) => {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [isRestored, setIsRestored] = useState(false);

  // Restore after mount rather than in a lazy initializer: the server renders
  // without sessionStorage, so reading it up front would break hydration.
  useEffect(() => {
    setSelectedCategoryIds(readStoredFilters(scope));
    setIsRestored(true);
  }, [scope]);

  // Guarded by isRestored so the initial empty state never overwrites
  // what was stored before the restore pass runs.
  useEffect(() => {
    if (!isRestored) {
      return;
    }

    try {
      window.sessionStorage.setItem(
        storageKeyFor(scope),
        JSON.stringify(selectedCategoryIds),
      );
    } catch {
      // Ignore: filters simply will not survive navigation.
    }
  }, [isRestored, scope, selectedCategoryIds]);

  const isFiltering = selectedCategoryIds.length > 0;

  const activeFilterCategories = useMemo(
    () =>
      categories.filter((category) =>
        selectedCategoryIds.includes(category.id),
      ),
    [categories, selectedCategoryIds],
  );

  const availableFilterCategories = useMemo(
    () =>
      categories.filter(
        (category) => !selectedCategoryIds.includes(category.id),
      ),
    [categories, selectedCategoryIds],
  );

  const addCategoryFilter = useCallback((categoryId: number) => {
    const normalizedId = Number(categoryId);
    setSelectedCategoryIds((prev) =>
      prev.includes(normalizedId) ? prev : [...prev, normalizedId],
    );
  }, []);

  const removeCategoryFilter = useCallback((categoryId: number) => {
    const normalizedId = Number(categoryId);
    setSelectedCategoryIds((prev) => prev.filter((id) => id !== normalizedId));
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedCategoryIds([]);
  }, []);

  // A note matches only when it carries every selected category.
  const filterNotes = useCallback(
    <T extends FilterableNote>(notes: T[]): T[] => {
      if (selectedCategoryIds.length === 0) {
        return notes;
      }

      return notes.filter((note) => {
        const noteCategoryIds = new Set(
          (note.categories || []).map((category) => Number(category.id)),
        );

        return selectedCategoryIds.every((categoryId) =>
          noteCategoryIds.has(Number(categoryId)),
        );
      });
    },
    [selectedCategoryIds],
  );

  return {
    selectedCategoryIds,
    isFiltering,
    activeFilterCategories,
    availableFilterCategories,
    addCategoryFilter,
    removeCategoryFilter,
    clearAllFilters,
    filterNotes,
  };
};
