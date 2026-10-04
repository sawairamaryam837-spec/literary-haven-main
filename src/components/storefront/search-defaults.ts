import type { BooksQuery } from "@/lib/catalog.functions";

export const defaultBookSearch: BooksQuery = {
  sort: "relevance",
  page: 1,
  perPage: 24,
};