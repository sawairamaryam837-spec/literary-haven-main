import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, ShoppingBag, Truck } from "lucide-react";
import { getBookBySlug } from "@/lib/catalog.functions";
import { BookCard } from "@/components/storefront/BookCard";
import { RatingStars } from "@/components/storefront/RatingStars";
import { WishlistButton } from "@/components/storefront/WishlistButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { demo } from "@/lib/demo-store";

export const Route = createFileRoute("/books/$slug")({
  loader: async ({ params }) => {
    const result = await getBookBySlug({ data: { slug: params.slug } });
    if (!result) throw notFound();
    return result;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Book not found — Foliage" }, { name: "robots", content: "noindex" }] };
    }
    const { book } = loaderData;
    const description = (book.short_description ?? book.description ?? `${book.title} by ${book.author}`).slice(0, 200);
    return {
      meta: [
        { title: `${book.title} by ${book.author} — Foliage` },
        { name: "description", content: description },
        { property: "og:title", content: `${book.title} by ${book.author}` },
        { property: "og:description", content: description },
        ...(book.cover_image?.startsWith("https://")
          ? [
              { property: "og:image", content: book.cover_image },
              { name: "twitter:image", content: book.cover_image },
            ]
          : []),
      ],
    };
  },
  component: BookDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-semibold">We couldn&apos;t find that book</h1>
      <p className="mt-3 text-muted-foreground">It may have sold out or moved to another shelf.</p>
      <Button asChild className="mt-6 bg-crimson text-crimson-foreground hover:bg-crimson/90">
        <Link to="/">Back home</Link>
      </Button>
    </div>
  ),
});

function BookDetail() {
  const { book, related } = Route.useLoaderData();
  const formats = [
    ...(book.physical_available ? [{ value: "physical", label: "Physical" }] : []),
    ...(book.digital_available ? [{ value: "digital", label: "Digital" }] : []),
  ];
  const [format, setFormat] = useState(formats[0]?.value ?? "physical");
  const price = Number(book.discount_price ?? book.price);

  return (
    <div>
      <div className="mx-auto grid max-w-[1480px] gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,420px)_1fr] lg:px-10 lg:py-16">
        <div className="relative overflow-hidden rounded-md border bg-paper shadow-lift">
          {book.cover_image ? (
            <img src={book.cover_image} alt={`Cover of ${book.title}`} className="aspect-[2/3] w-full object-cover" />
          ) : (
            <div className="grid aspect-[2/3] place-items-center p-8 text-center font-display text-2xl">{book.title}</div>
          )}
          <WishlistButton title={book.title} className="absolute right-3 top-3" />
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-crimson">
            {book.genre ?? book.category_slug.replaceAll("-", " ")}
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">{book.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">by {book.author}</p>
          <div className="mt-5 flex flex-wrap items-center gap-6">
            <RatingStars rating={Number(book.rating)} count={book.review_count} />
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">${price.toFixed(2)}</span>
              {book.discount_price != null && Number(book.discount_price) < Number(book.price) && (
                <span className="text-sm text-muted-foreground line-through">${Number(book.price).toFixed(2)}</span>
              )}
            </div>
            <Badge variant={book.stock > 0 ? "secondary" : "outline"}>
              {book.stock > 0 ? `${book.stock} in stock` : "Out of stock"}
            </Badge>
          </div>

          {book.description && <p className="mt-7 max-w-2xl leading-relaxed text-muted-foreground">{book.description}</p>}

          {formats.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold">Format</p>
              <div className="flex flex-wrap gap-2">
                {formats.map((option) => (
                  <Button
                    key={option.value}
                    variant={format === option.value ? "default" : "outline"}
                    onClick={() => setFormat(option.value)}
                    className={format === option.value ? "bg-ink text-ink-foreground hover:bg-ink/90" : ""}
                  >
                    {option.value === "digital" ? <BookOpen /> : <Truck />} {option.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bg-crimson text-crimson-foreground hover:bg-crimson/90"
              onClick={() => {
                demo.addToCart({ id: book.id, slug: book.slug, title: book.title, author: book.author, cover: book.cover_image, price: book.discount_price ?? book.price, format: String(format) });
                toast.success(`${book.title} added to your bag (${format})`);
              }}
            >
              <ShoppingBag /> Add to cart
            </Button>
          </div>

          <dl className="mt-10 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
            {[
              ["Publisher", book.publisher],
              ["Language", book.language],
              ["Pages", book.pages],
              ["ISBN", book.isbn],
              ["Published", book.publication_date],
            ]
              .filter(([, value]) => value != null && value !== "")
              .map(([label, value]) => (
                <div key={String(label)} className="flex justify-between gap-4 border-b pb-2">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-medium">{String(value)}</dd>
                </div>
              ))}
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t bg-paper/40">
          <div className="mx-auto max-w-[1480px] px-4 py-16 sm:px-6 lg:px-10">
            <h2 className="mb-8 font-display text-3xl font-semibold">You may also like</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
              {related.map((item) => (
                <BookCard key={item.id} book={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
