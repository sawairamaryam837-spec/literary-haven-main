import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ORDER_STATUSES, money, useDemo } from "@/lib/demo-store";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My orders — Foliage" },
      { name: "description", content: "Track your Foliage orders." },
      { property: "og:title", content: "My orders — Foliage" },
      { property: "og:description", content: "Track your Foliage orders." },
    ],
  }),
  component: OrdersPage,
});

const steps = ORDER_STATUSES.filter((s) => s !== "CANCELLED");

function OrdersPage() {
  const { user, orders } = useDemo();
  if (!user) return <div className="px-4 py-24 text-center"><h1 className="font-display text-3xl">Sign in to see your orders</h1><Button asChild className="mt-6"><Link to="/login">Sign in</Link></Button></div>;
  const mine = orders.filter((o) => o.email === user.email);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-4xl">My orders</h1>
      {!mine.length && <p className="mt-6 text-muted-foreground">No orders yet. <Link to="/" className="text-crimson underline">Start shopping</Link></p>}
      <div className="mt-6 grid gap-6">
        {mine.map((o) => {
          const at = steps.indexOf(o.status as (typeof steps)[number]);
          return (
            <article key={o.id} className="rounded-md border bg-card p-6 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div><p className="font-semibold">{o.number}</p><p className="text-sm text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()} · {o.items.length} item(s) · {money(o.total)}</p></div>
                <div className="flex gap-2"><Badge variant="outline">{o.payment === "cod" ? "Cash on delivery" : "Card"} · {o.paymentStatus}</Badge><Badge className="bg-ink text-ink-foreground">{o.status.replaceAll("_", " ")}</Badge></div>
              </div>
              {o.status !== "CANCELLED" && (
                <ol className="mt-6 grid grid-cols-7 gap-1">
                  {steps.map((s, i) => (
                    <li key={s} className="text-center">
                      <div className={`mx-auto grid size-7 place-items-center rounded-full border text-xs ${i <= at ? "border-crimson bg-crimson text-crimson-foreground" : "bg-muted"}`}>{i <= at ? <Check className="size-4" /> : i + 1}</div>
                      <p className="mt-1 hidden text-[10px] text-muted-foreground sm:block">{s.replaceAll("_", " ")}</p>
                    </li>
                  ))}
                </ol>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
