import { Link } from "@tanstack/react-router";
import { Eye, ShoppingBag } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { BookCardData } from "@/lib/catalog.functions";
import { toast } from "sonner";
import { demo } from "@/lib/demo-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingStars } from "./RatingStars";
import { WishlistButton } from "./WishlistButton";

export function BookCard({ book, priority = false }: { book: BookCardData; priority?: boolean }) {
  const reduceMotion = useReducedMotion();
  const salePrice = book.discount_price != null && book.discount_price < book.price ? book.discount_price : null;

  return (
    <motion.article
      {...(reduceMotion ? {} : { whileHover: { y: -8, rotateX: 2, rotateY: -2 } })}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group flex min-w-0 flex-col [perspective:900px]"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-border bg-paper shadow-card transition-shadow duration-300 group-hover:shadow-lift">
        <Link to="/books/$slug" params={{ slug: book.slug }} aria-label={`View ${book.title}`}>
          {book.cover_image ? (
            <img
              src={book.cover_image}
              alt={`Cover of ${book.title} by ${book.author}`}
              loading={priority ? "eager" : "lazy"}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.045]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-ink p-6 text-center font-display text-xl text-ink-foreground">{book.title}</div>
          )}
        </Link>
        <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
          {book.best_seller && <Badge className="border-0 bg-gold text-gold-foreground">Bestseller</Badge>}
          {book.new_arrival && <Badge className="border-0 bg-crimson text-crimson-foreground">New</Badge>}
        </div>
        <WishlistButton title={book.title} className="absolute right-2 top-2" />
        <div className="absolute inset-x-3 bottom-3 flex translate-y-3 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <Button
            className="min-w-0 flex-1 bg-ink text-ink-foreground hover:bg-ink/90"
            aria-label={`Add ${book.title} to cart`}
            onClick={() => {
              demo.addToCart({ id: book.id, slug: book.slug, title: book.title, author: book.author, cover: book.cover_image, price: book.discount_price ?? book.price, format: "physical" });
              toast.success(`${book.title} added to your bag`);
            }}
          >
            <ShoppingBag /> Add
          </Button>
          <Button asChild size="icon" variant="secondary" aria-label={`Quick view ${book.title}`}>
            <Link to="/books/$slug" params={{ slug: book.slug }}><Eye /></Link>
          </Button>
        </div>
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <p className="mb-2 text-[0.7rem] font-bold uppercase text-crimson">{book.genre ?? book.category_slug.replaceAll("-", " ")}</p>
        <Link to="/books/$slug" params={{ slug: book.slug }} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug transition-colors group-hover:text-crimson">{book.title}</h3>
        </Link>
        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{book.author}</p>
        <div className="mt-3"><RatingStars rating={Number(book.rating)} count={book.review_count} /></div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold">${Number(salePrice ?? book.price).toFixed(2)}</span>
          {salePrice != null && <span className="text-sm text-muted-foreground line-through">${Number(book.price).toFixed(2)}</span>}
        </div>
      </div>
    </motion.article>
  );
}