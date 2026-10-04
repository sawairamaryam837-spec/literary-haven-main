import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { demo } from "@/lib/demo-store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Foliage" },
      { name: "description", content: "Sign in to your Foliage account (demo)." },
      { property: "og:title", content: "Sign in — Foliage" },
      { property: "og:description", content: "Sign in to your Foliage account (demo)." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const enter = (role: "customer" | "admin", n = name, e = email) => {
    demo.login({ name: n || "Guest Reader", email: e || "reader@example.com", role });
    toast.success(role === "admin" ? "Signed in as admin (demo)" : "Signed in (demo)");
    navigate({ to: role === "admin" ? "/admin" : "/orders" });
  };
  const submit = (ev: FormEvent) => { ev.preventDefault(); enter("customer"); };

  return (
    <div className="mx-auto grid max-w-md gap-6 px-4 py-16">
      <div>
        <h1 className="font-display text-4xl">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Demo sign-in: any name and email will work.</p>
      </div>
      <form onSubmit={submit} className="grid gap-4 rounded-md border bg-card p-6 shadow-card">
        <div className="grid gap-2"><Label htmlFor="n">Name</Label><Input id="n" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></div>
        <div className="grid gap-2"><Label htmlFor="e">Email</Label><Input id="e" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
        <div className="grid gap-2"><Label htmlFor="p">Password</Label><Input id="p" type="password" placeholder="••••••••" /></div>
        <Button type="submit" className="bg-crimson text-crimson-foreground hover:bg-crimson/90">Sign in</Button>
        <Button type="button" variant="outline" onClick={() => enter("admin", "Store Admin", "admin@foliage.demo")}>Enter admin dashboard (demo)</Button>
      </form>
    </div>
  );
}
