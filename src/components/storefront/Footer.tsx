import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { defaultBookSearch } from "./search-defaults";

export function Footer() {
  return (
    <footer className="border-t bg-paper">
      <div className="mx-auto grid max-w-[1480px] gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <div><div className="flex items-center gap-3 font-display text-2xl font-semibold"><BookOpen className="text-crimson" /> Foliage</div><p className="mt-5 max-w-xs text-sm leading-7 text-muted-foreground">Independent bookselling for curious minds. Discover enduring classics, essential ideas, and your next unforgettable read.</p></div>
        <div><h2 className="font-sans text-sm font-bold uppercase">Explore</h2><div className="mt-5 grid gap-3 text-sm text-muted-foreground"><Link to="/search" search={defaultBookSearch}>All books</Link><Link to="/search" search={{ ...defaultBookSearch, sort: "newest" }}>New arrivals</Link><Link to="/search" search={{ ...defaultBookSearch, category: "horror" }}>Horror collection</Link></div></div>
        <div><h2 className="font-sans text-sm font-bold uppercase">Customer care</h2><div className="mt-5 grid gap-3 text-sm text-muted-foreground"><span>Shipping & delivery</span><span>Returns</span><span>Contact</span></div></div>
        <div><h2 className="font-sans text-sm font-bold uppercase">The Foliage letter</h2><p className="mt-5 text-sm text-muted-foreground">New releases and reading lists, delivered monthly.</p><form className="mt-4 flex" onSubmit={(event) => event.preventDefault()}><Input type="email" aria-label="Email address" placeholder="you@example.com" className="rounded-r-none bg-background" /><Button size="icon" className="rounded-l-none" aria-label="Subscribe"><ArrowRight /></Button></form></div>
      </div>
      <div className="border-t px-4 py-5 text-center text-xs text-muted-foreground">© 2026 Foliage Books. Read beyond the ordinary.</div>
    </footer>
  );
}