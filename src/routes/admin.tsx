import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Clock, DollarSign, PackageCheck, ShoppingCart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ORDER_STATUSES, demo, money, useDemo, type OrderStatus } from "@/lib/demo-store";
import books from "@/data/books.json";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin dashboard — Foliage" },
      { name: "description", content: "Demo admin dashboard for the Foliage bookstore." },
      { property: "og:title", content: "Admin dashboard — Foliage" },
      { property: "og:description", content: "Demo admin dashboard for the Foliage bookstore." },
    ],
  }),
  component: AdminPage,
});

const lowStock = (books as { title: string; author: string; stock: number }[]).filter((b) => b.stock < 5).slice(0, 8);

function AdminPage() {
  const { user, orders } = useDemo();
  if (user?.role !== "admin")
    return <div className="px-4 py-24 text-center"><h1 className="font-display text-3xl">Admin access only</h1><Button asChild className="mt-6"><Link to="/login">Sign in as admin (demo)</Link></Button></div>;

  const sales = orders.filter((o) => o.status !== "CANCELLED").reduce((s, o) => s + o.total, 0);
  const stats = [
    { label: "Total sales", value: money(sales), icon: DollarSign },
    { label: "Orders", value: orders.length, icon: ShoppingCart },
    { label: "Pending", value: orders.filter((o) => o.status === "PENDING").length, icon: Clock },
    { label: "Delivered", value: orders.filter((o) => o.status === "DELIVERED").length, icon: PackageCheck },
    { label: "Customers", value: new Set(orders.map((o) => o.email)).size, icon: Users },
    { label: "Books", value: books.length, icon: BookOpen },
  ];

  return (
    <div className="mx-auto max-w-[1300px] px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-crimson">Demo mode</p>
      <h1 className="font-display text-4xl">Admin dashboard</h1>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="rounded-md border bg-card p-5 shadow-card">
            <s.icon className="size-5 text-crimson" />
            <p className="mt-3 text-2xl font-semibold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_320px]">
        <section className="rounded-md border bg-card p-4 shadow-card">
          <h2 className="mb-4 px-2 font-semibold">Orders</h2>
          <Table>
            <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Total</TableHead><TableHead>Payment</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.number}<div className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</div></TableCell>
                  <TableCell>{o.customer}<div className="text-xs text-muted-foreground">{o.email}</div></TableCell>
                  <TableCell>{money(o.total)}</TableCell>
                  <TableCell className="text-xs">{o.payment.toUpperCase()} · {o.paymentStatus}</TableCell>
                  <TableCell>
                    <Select value={o.status} onValueChange={(v) => demo.setStatus(o.id, v as OrderStatus)}>
                      <SelectTrigger className="h-8 w-44"><SelectValue /></SelectTrigger>
                      <SelectContent>{ORDER_STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replaceAll("_", " ")}</SelectItem>)}</SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
        <section className="h-fit rounded-md border bg-card p-5 shadow-card">
          <h2 className="font-semibold">Low stock</h2>
          <ul className="mt-3 divide-y text-sm">
            {lowStock.map((b) => <li key={b.title} className="flex justify-between gap-2 py-2"><span className="truncate">{b.title}</span><span className="font-semibold text-crimson">{b.stock}</span></li>)}
          </ul>
        </section>
      </div>
    </div>
  );
}
