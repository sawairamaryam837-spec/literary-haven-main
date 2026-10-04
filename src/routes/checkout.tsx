import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { demo, money, useDemo } from "@/lib/demo-store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Foliage" },
      { name: "description", content: "Complete your Foliage order." },
      { property: "og:title", content: "Checkout — Foliage" },
      { property: "og:description", content: "Complete your Foliage order." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { cart, user } = useDemo();
  const navigate = useNavigate();
  const [form, setForm] = useState({ customer: "", email: "", phone: "", address: "" });
  const [payment, setPayment] = useState<"cod" | "card">("cod");
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (user) setForm((f) => ({ ...f, customer: f.customer || user.name, email: f.email || user.email })); }, [user]);
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);

  if (!cart.length) return <div className="px-4 py-24 text-center"><h1 className="font-display text-3xl">Nothing to check out</h1><Link to="/cart" className="mt-4 inline-block text-crimson underline">Back to bag</Link></div>;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => {
      const order = demo.placeOrder({ ...form, payment });
      toast.success(`Order ${order.number} placed${payment === "card" ? " — payment approved (demo)" : ""}`);
      navigate({ to: "/orders" });
    }, 900);
  };
  const field = (k: keyof typeof form, label: string, type = "text") => (
    <div className="grid gap-2"><Label htmlFor={k}>{label}</Label><Input id={k} type={type} required value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>
  );

  return (
    <form onSubmit={submit} className="mx-auto grid max-w-5xl gap-10 px-4 py-12 lg:grid-cols-[1fr_320px]">
      <div className="grid gap-6">
        <h1 className="font-display text-4xl">Checkout</h1>
        <section className="grid gap-4 rounded-md border bg-card p-6">
          <h2 className="font-semibold">Delivery details</h2>
          {field("customer", "Full name")}{field("email", "Email", "email")}{field("phone", "Phone")}{field("address", "Address")}
        </section>
        <section className="grid gap-4 rounded-md border bg-card p-6">
          <h2 className="font-semibold">Payment</h2>
          <RadioGroup value={payment} onValueChange={(v) => setPayment(v as "cod" | "card")}>
            <label className="flex items-center gap-3"><RadioGroupItem value="cod" /> Cash on delivery</label>
            <label className="flex items-center gap-3"><RadioGroupItem value="card" /> Card (demo — no real charge)</label>
          </RadioGroup>
          {payment === "card" && <div className="grid gap-3 sm:grid-cols-3"><Input placeholder="4242 4242 4242 4242" className="sm:col-span-3" /><Input placeholder="MM/YY" /><Input placeholder="CVC" /></div>}
        </section>
      </div>
      <aside className="h-fit rounded-md border bg-card p-6 shadow-card">
        {cart.map((c) => <div key={c.id + c.format} className="flex justify-between gap-2 py-1 text-sm"><span className="truncate">{c.qty}× {c.title}</span><span>{money(c.price * c.qty)}</span></div>)}
        <div className="mt-4 flex justify-between border-t pt-4 font-semibold"><span>Total</span><span>{money(total + (total > 50 ? 0 : 4.99))}</span></div>
        <Button disabled={busy} type="submit" className="mt-6 w-full bg-crimson text-crimson-foreground hover:bg-crimson/90">{busy ? "Placing order…" : "Place order"}</Button>
      </aside>
    </form>
  );
}
