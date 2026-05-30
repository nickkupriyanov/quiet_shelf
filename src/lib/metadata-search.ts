export type BookMetadataSuggestion = {
  title: string;
  author?: string;
  coverUrl?: string;
  totalPages?: number;
};

export async function searchBookMetadata(
  query: string,
): Promise<BookMetadataSuggestion[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  return [];
}
