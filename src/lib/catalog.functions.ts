import { z } from "zod";
import booksData from "@/data/books.json";
import categoriesData from "@/data/categories.json";

// Frontend-only catalogue: all data is bundled locally, no backend calls.
export type BookDetail = {
  id: string;
  title: string;
  slug: string;
  author: string;
  description: string | null;
  short_description: string | null;
  isbn: string | null;
  publisher: string | null;
  publication_date: string | null;
  language: string | null;
  pages: number | null;
  category_slug: string;
  genre: string | null;
  tags: string[];
  rating: number;
  review_count: number;
  price: number;
  discount_price: number | null;
  stock: number;
  cover_image: string | null;
  gallery_images: string[];
  preview_url: string | null;
  physical_available: boolean;
  digital_available: boolean;
  featured: boolean;
  best_seller: boolean;
  new_arrival: boolean;
};

export type BookCardData = Pick<
  BookDetail,
  | "id" | "title" | "slug" | "author" | "genre" | "category_slug" | "rating" | "review_count"
  | "price" | "discount_price" | "stock" | "cover_image" | "physical_available"
  | "digital_available" | "featured" | "best_seller" | "new_arrival"
>;

const BOOKS = booksData as BookDetail[];

export const listCategories = async () => categoriesData;

const HORROR_GENRES = ["Psychological Horror", "Gothic Horror", "Supernatural Horror", "Paranormal", "Dark Fantasy"];

const by = (k: (b: BookDetail) => number) => (a: BookDetail, b: BookDetail) => k(b) - k(a);

export const getHomeSections = async () => ({
  featured: BOOKS.filter((b) => b.featured).sort(by((b) => b.rating)).slice(0, 8) as BookCardData[],
  bestSellers: BOOKS.filter((b) => b.best_seller).sort(by((b) => b.review_count)).slice(0, 10) as BookCardData[],
  newArrivals: BOOKS.filter((b) => b.new_arrival).sort(by((b) => Date.parse(b.publication_date ?? "") || 0)).slice(0, 10) as BookCardData[],
  horror: BOOKS.filter((b) => b.genre && HORROR_GENRES.includes(b.genre)).sort(by((b) => b.rating)).slice(0, 10) as BookCardData[],
  recommended: BOOKS.filter((b) => b.rating >= 4).sort(by((b) => b.review_count)).slice(0, 10) as BookCardData[],
});

export const booksQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  category: z.string().max(60).optional(),
  genre: z.string().max(60).optional(),
  minPrice: z.number().min(0).max(1000).optional(),
  maxPrice: z.number().min(0).max(1000).optional(),
  minRating: z.number().min(0).max(5).optional(),
  inStock: z.boolean().optional(),
  format: z.enum(["physical", "digital"]).optional(),
  sort: z.enum(["relevance", "newest", "price-asc", "price-desc", "rating", "popular", "title"]).default("relevance"),
  page: z.number().int().min(1).max(200).default(1),
  perPage: z.number().int().min(4).max(48).default(24),
});

export type BooksQuery = z.infer<typeof booksQuerySchema>;

const matches = (b: BookDetail, term: string) =>
  [b.title, b.author, b.isbn, b.genre, b.category_slug, ...b.tags].some((v) => v?.toLowerCase().includes(term));

export const listBooks = async ({ data }: { data: unknown }) => {
  const p = booksQuerySchema.parse(data ?? {});
  const term = p.q?.toLowerCase().trim();
  let list = BOOKS.filter(
    (b) =>
      (!term || matches(b, term)) &&
      (!p.category || b.category_slug === p.category) &&
      (!p.genre || b.genre === p.genre) &&
      (p.minPrice == null || b.price >= p.minPrice) &&
      (p.maxPrice == null || b.price <= p.maxPrice) &&
      (p.minRating == null || b.rating >= p.minRating) &&
      (!p.inStock || b.stock > 0) &&
      (p.format !== "physical" || b.physical_available) &&
      (p.format !== "digital" || b.digital_available),
  );
  const sorters: Record<string, (a: BookDetail, b: BookDetail) => number> = {
    newest: by((b) => Date.parse(b.publication_date ?? "") || 0),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    rating: by((b) => b.rating),
    title: (a, b) => a.title.localeCompare(b.title),
  };
  list = [...list].sort(sorters[p.sort] ?? ((a, b) => b.review_count - a.review_count || b.rating - a.rating));
  const from = (p.page - 1) * p.perPage;
  return {
    books: list.slice(from, from + p.perPage) as BookCardData[],
    total: list.length,
    page: p.page,
    perPage: p.perPage,
    pageCount: Math.max(1, Math.ceil(list.length / p.perPage)),
  };
};

export const suggestBooks = async ({ data }: { data: { q: string } }) => {
  const term = data.q.toLowerCase().trim();
  if (term.length < 2) return [] as BookCardData[];
  return BOOKS.filter((b) => [b.title, b.author, b.isbn].some((v) => v?.toLowerCase().includes(term)))
    .sort(by((b) => b.review_count))
    .slice(0, 6) as BookCardData[];
};

export const getBookBySlug = async ({ data }: { data: { slug: string } }) => {
  const book = BOOKS.find((b) => b.slug === data.slug);
  if (!book) return null;
  const related = BOOKS.filter((b) => b.category_slug === book.category_slug && b.id !== book.id)
    .sort(by((b) => b.review_count))
    .slice(0, 5) as BookCardData[];
  return { book, related };
};
