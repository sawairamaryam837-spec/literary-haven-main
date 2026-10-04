import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { BookCardData } from "@/lib/catalog.functions";
import { BookCard } from "./BookCard";
import { defaultBookSearch } from "./search-defaults";

export function BookShelf({ title, eyebrow, books, dark = false, category }: { title: string; eyebrow: string; books: BookCardData[]; dark?: boolean; category?: string }) {
  if (books.length === 0) return null;
  return (
    <section className={dark ? "bg-ink text-ink-foreground" : "bg-background"}>
      <div className="mx-auto max-w-[1480px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="mb-9 flex items-end justify-between gap-6 border-b border-current/15 pb-5">
          <div>
            <p className={`mb-2 text-xs font-bold uppercase ${dark ? "text-gold" : "text-crimson"}`}>{eyebrow}</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
          </div>
          <Link to="/search" search={{ ...defaultBookSearch, ...(category ? { category } : {}) }} className="hidden items-center gap-2 text-sm font-semibold hover:text-crimson sm:flex">
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {books.slice(0, 10).map((book, index) => <BookCard key={book.id} book={book} priority={index < 2} />)}
        </div>
      </div>
    </section>
  );
}