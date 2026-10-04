import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { getHomeSections, listCategories } from "@/lib/catalog.functions";
import { BookShelf } from "@/components/storefront/BookShelf";
import { RatingStars } from "@/components/storefront/RatingStars";
import { Button } from "@/components/ui/button";
import { defaultBookSearch } from "@/components/storefront/search-defaults";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Foliage — Premium Online Bookstore" },
      {
        name: "description",
        content:
          "Browse 1,300+ handpicked books across 22 categories. Bestsellers, new arrivals, horror collections and more, in print and digital.",
      },
      { property: "og:title", content: "Foliage — Premium Online Bookstore" },
      {
        property: "og:description",
        content: "Handpicked books across 22 categories, in print and digital.",
      },
    ],
  }),
  loader: async () => {
    const [sections, categories] = await Promise.all([getHomeSections(), listCategories()]);
    return { sections, categories };
  },
  component: Home,
});

function Home() {
  const { sections, categories } = Route.useLoaderData();
  const reduceMotion = useReducedMotion();
  const hero = sections.featured[0] ?? sections.bestSellers[0];
  const second = sections.featured[1] ?? sections.newArrivals[0];

  return (
    <div>
      <section className="relative overflow-hidden bg-cream text-ink">
        <div className="mx-auto grid max-w-[1480px] items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-10 lg:py-24">
          <motion.div
            {...(reduceMotion ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } })}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-crimson">
              <Sparkles className="size-4" /> This week&apos;s feature
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
              {hero ? hero.title : "The Hollow "}
              {!hero && <span className="text-crimson">Tide</span>}
            </h1>
            {hero && <p className="mt-4 text-lg text-muted-foreground">by {hero.author}</p>}
            {hero && (
              <div className="mt-5 flex items-center gap-5">
                <RatingStars rating={Number(hero.rating)} count={hero.review_count} />
                <span className="text-xl font-bold">${Number(hero.discount_price ?? hero.price).toFixed(2)}</span>
              </div>
            )}
            <div className="mt-9 flex flex-wrap gap-3">
              {hero && (
                <Button asChild size="lg" className="bg-crimson text-crimson-foreground hover:bg-crimson/90">
                  <Link to="/books/$slug" params={{ slug: hero.slug }}>
                    Shop Now <ArrowRight />
                  </Link>
                </Button>
              )}
              <Button asChild size="lg" variant="outline" className="border-ink text-ink hover:bg-ink hover:text-ink-foreground">
                <Link to="/search" search={defaultBookSearch}>
                  <BookOpen /> Explore Books
                </Link>
              </Button>
            </div>
          </motion.div>

          <div className="relative flex min-h-[320px] items-center justify-center gap-6">
            {[hero, second].filter(Boolean).map((book, index) =>
              book ? (
                <motion.div
                  key={book.id}
                  {...(reduceMotion ? {} : { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } })}
                  transition={{ duration: 0.7, delay: index * 0.15 }}
                  className={index === 1 ? "hidden w-40 sm:block sm:w-48" : "w-48 sm:w-60"}
                >
                  <Link to="/books/$slug" params={{ slug: book.slug }} aria-label={book.title}>
                    <div
                      className="overflow-hidden rounded-md border border-ink/10 bg-paper shadow-lift"
                      style={reduceMotion ? undefined : { animation: `floaty ${index === 0 ? 7 : 9}s ease-in-out infinite` }}
                    >
                      {book.cover_image ? (
                        <img
                          src={book.cover_image}
                          alt={`Cover of ${book.title}`}
                          className="aspect-[2/3] w-full object-cover"
                        />
                      ) : (
                        <div className="grid aspect-[2/3] place-items-center p-6 text-center font-display text-xl">{book.title}</div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ) : null,
            )}
          </div>
        </div>
      </section>

      <section className="border-y bg-paper">
        <div className="mx-auto flex max-w-[1480px] gap-2 overflow-x-auto px-4 py-4 sm:px-6 lg:px-10">
          {categories.map((category) => (
            <Link
              key={category.id}
              to="/search"
              search={{ ...defaultBookSearch, category: category.slug }}
              className="shrink-0 rounded-full border border-ink/15 bg-background px-4 py-2 text-sm font-semibold transition-colors hover:border-crimson hover:text-crimson"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <BookShelf eyebrow="Handpicked" title="This Week's Featured" books={sections.featured} />
      <BookShelf eyebrow="Loved by readers" title="Best Sellers" books={sections.bestSellers} />
      <BookShelf eyebrow="Fresh off the press" title="New Arrivals" books={sections.newArrivals} />
      <BookShelf eyebrow="After dark" title="Horror Collection" books={sections.horror} dark category="horror" />
      <BookShelf eyebrow="For you" title="Recommended" books={sections.recommended} />
    </div>
  );
}
