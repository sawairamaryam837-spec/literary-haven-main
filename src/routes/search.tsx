import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search as SearchIcon, SlidersHorizontal, X } from "lucide-react";
import { listBooks, booksQuerySchema, type BooksQuery } from "@/lib/catalog.functions";
import { BookCard } from "@/components/storefront/BookCard";
import { SearchBox } from "@/components/storefront/SearchBox";
import { defaultBookSearch } from "@/components/storefront/search-defaults";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Browse all books — Foliage" },
      {
        name: "description",
        content:
          "Search 1,300+ books by title, author or ISBN and filter by category, price, rating, stock and format.",
      },
      { property: "og:title", content: "Browse all books — Foliage" },
      { property: "og:description", content: "Search and filter the full Foliage catalogue." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => booksQuerySchema.parse(search),
  loaderDeps: ({ search }) => ({ search }),
  loader: ({ deps: { search } }) => listBooks({ data: search }),
  component: SearchPage,
});

const SORTS: { value: BooksQuery["sort"]; label: string }[] = [
  { value: "relevance", label: "Popularity" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "title", label: "Title A-Z" },
];

function SearchPage() {
  const { books, total, pageCount } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const updateSearch = (updates: Partial<BooksQuery>) => {
    navigate({ to: "/search", search: { ...search, ...updates, page: 1 } });
  };
  const clearAll = () => navigate({ to: "/search", search: defaultBookSearch });

  const pages = Array.from({ length: Math.min(pageCount, 9) }, (_, i) => i + 1);

  return (
    <div className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mb-8 max-w-xl">
        <SearchBox />
      </div>
      <div className="flex flex-col gap-10 lg:flex-row">
        <aside
          className={`fixed inset-0 z-40 w-full overflow-y-auto bg-background p-6 transition-transform lg:static lg:z-0 lg:block lg:w-64 lg:translate-x-0 lg:p-0 ${showFilters ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <h2 className="text-xl font-bold">Filters</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)} aria-label="Close filters">
              <X />
            </Button>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="mb-4 font-semibold">Price range</h3>
              <Slider
                defaultValue={[search.minPrice ?? 0, search.maxPrice ?? 100]}
                max={100}
                step={1}
                onValueCommit={([min, max]) => updateSearch({ minPrice: min, maxPrice: max })}
              />
              <div className="mt-3 flex justify-between text-sm text-muted-foreground">
                <span>${search.minPrice ?? 0}</span>
                <span>${search.maxPrice ?? 100}</span>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Minimum rating</h3>
              <div className="flex flex-wrap gap-2">
                {[3, 4, 4.5].map((value) => (
                  <Button
                    key={value}
                    size="sm"
                    variant={search.minRating === value ? "default" : "outline"}
                    onClick={() => updateSearch({ minRating: search.minRating === value ? undefined : value })}
                  >
                    {value}+
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Availability</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inStock"
                  checked={search.inStock === true}
                  onCheckedChange={(checked) => updateSearch({ inStock: checked === true })}
                />
                <Label htmlFor="inStock">In stock</Label>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Format</h3>
              <div className="space-y-3">
                {(["physical", "digital"] as const).map((value) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={value}
                      checked={search.format === value}
                      onCheckedChange={(checked) => updateSearch({ format: checked === true ? value : undefined })}
                    />
                    <Label htmlFor={value}>{value === "physical" ? "Physical book" : "Digital (e-book)"}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={clearAll}>
              Clear all filters
            </Button>
          </div>
        </aside>

        <main className="flex-1">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-semibold">
                {search.q ? `Results for "${search.q}"` : "All books"}
              </h1>
              <p className="text-sm text-muted-foreground">{total} volumes found</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setShowFilters(true)}>
                <SlidersHorizontal /> Filters
              </Button>
              <Select value={search.sort} onValueChange={(value) => updateSearch({ sort: value as BooksQuery["sort"] })}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {SORTS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {books.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 xl:grid-cols-4">
                {books.map((book, index) => (
                  <BookCard key={book.id} book={book} priority={index < 4} />
                ))}
              </div>
              {pageCount > 1 && (
                <div className="mt-12 flex flex-wrap justify-center gap-2">
                  {pages.map((page) => (
                    <Button
                      key={page}
                      size="sm"
                      variant={search.page === page ? "default" : "outline"}
                      className={search.page === page ? "bg-crimson text-crimson-foreground hover:bg-crimson/90" : ""}
                      onClick={() => navigate({ to: "/search", search: { ...search, page } })}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 rounded-full bg-muted p-6">
                <SearchIcon className="size-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold">No volumes found</h3>
              <p className="mt-2 text-muted-foreground">Try adjusting your filters or search terms.</p>
              <Button variant="link" className="mt-4 text-crimson" onClick={clearAll}>
                Clear all filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
