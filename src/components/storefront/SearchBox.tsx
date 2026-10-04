import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { suggestBooks, type BookCardData } from "@/lib/catalog.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { defaultBookSearch } from "./search-defaults";

const suggest = suggestBooks;

export function SearchBox({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookCardData[]>([]);

  useEffect(() => {
    const value = query.trim();
    if (value.length < 2) { setResults([]); return; }
    const timer = window.setTimeout(() => {
      suggest({ data: { q: value } }).then(setResults).catch(() => setResults([]));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [query, suggest]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    navigate({ to: "/search", search: { ...defaultBookSearch, ...(q ? { q } : {}) } });
    setResults([]);
    onNavigate?.();
  };

  return (
    <div className="relative w-full">
      <form onSubmit={submit} className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, author or ISBN" aria-label="Search books" className={compact ? "h-10 bg-background pl-10 pr-9" : "h-12 bg-background pl-10 pr-10"} />
        {query && <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 size-8 -translate-y-1/2" onClick={() => { setQuery(""); setResults([]); }} aria-label="Clear search"><X /></Button>}
      </form>
      {results.length > 0 && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-md border bg-popover shadow-lift">
          {results.map((book) => (
            <Link key={book.id} to="/books/$slug" params={{ slug: book.slug }} onClick={() => { setResults([]); onNavigate?.(); }} className="flex items-center gap-3 border-b p-3 last:border-0 hover:bg-muted">
              {book.cover_image ? <img src={book.cover_image} alt="" className="h-14 w-10 rounded-sm object-cover" /> : <div className="h-14 w-10 rounded-sm bg-muted" />}
              <span className="min-w-0"><span className="block truncate text-sm font-semibold">{book.title}</span><span className="block truncate text-xs text-muted-foreground">{book.author}</span></span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}