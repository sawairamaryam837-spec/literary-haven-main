import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { demo, money, useDemo } from "@/lib/demo-store";
import { defaultBookSearch } from "@/components/storefront/search-defaults";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your bag — Foliage" },
      { name: "description", content: "Review the books in your bag." },
      { property: "og:title", content: "Your bag — Foliage" },
      { property: "og:description", content: "Review the books in your bag." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart } = useDemo();
  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const shipping = subtotal > 50 || !cart.length ? 0 : 4.99;

  if (!cart.length)
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <ShoppingBag className="mx-auto size-12 text-muted-foreground" />
        <h1 className="mt-4 font-display text-3xl">Your bag is empty</h1>
        <Button asChild className="mt-6 bg-crimson text-crimson-foreground hover:bg-crimson/90"><Link to="/search" search={defaultBookSearch}>Browse books</Link></Button>
      </div>
    );

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_340px]">
      <div>
        <h1 className="font-display text-4xl">Your bag</h1>
        <ul className="mt-6 divide-y border-y">
          {cart.map((c, i) => (
            <li key={c.id + c.format} className="flex items-center gap-4 py-4">
              {c.cover ? <img src={c.cover} alt="" className="h-24 w-16 rounded-sm object-cover" /> : <div className="h-24 w-16 rounded-sm bg-muted" />}
              <div className="min-w-0 flex-1">
                <Link to="/books/$slug" params={{ slug: c.slug }} className="font-semibold hover:text-crimson">{c.title}</Link>
                <p className="text-sm text-muted-foreground">{c.author} · {c.format}</p>
                <p className="mt-1 font-semibold">{money(c.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="outline" onClick={() => demo.setQty(i, c.qty - 1)} aria-label="Decrease"><Minus /></Button>
                <span className="w-6 text-center">{c.qty}</span>
                <Button size="icon" variant="outline" onClick={() => demo.setQty(i, c.qty + 1)} aria-label="Increase"><Plus /></Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <aside className="h-fit rounded-md border bg-card p-6 shadow-card">
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>{money(subtotal)}</span></div>
        <div className="mt-2 flex justify-between text-sm"><span>Shipping</span><span>{shipping ? money(shipping) : "Free"}</span></div>
        <div className="mt-4 flex justify-between border-t pt-4 text-lg font-semibold"><span>Total</span><span>{money(subtotal + shipping)}</span></div>
        <Button asChild className="mt-6 w-full bg-crimson text-crimson-foreground hover:bg-crimson/90"><Link to="/checkout">Checkout</Link></Button>
      </aside>
    </div>
  );
}
