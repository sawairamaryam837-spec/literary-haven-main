import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { BookOpen, Heart, Menu, ShoppingBag, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SearchBox } from "./SearchBox";
import { defaultBookSearch } from "./search-defaults";
import { demo, useDemo } from "@/lib/demo-store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const nav = [
  { label: "Books", search: defaultBookSearch },
  { label: "New Arrivals", search: { ...defaultBookSearch, sort: "newest" as const } },
  { label: "Best Sellers", search: { ...defaultBookSearch, sort: "popular" as const } },
  { label: "Horror", search: { ...defaultBookSearch, category: "horror" } },
];

function AccountMenu() {
  const { user } = useDemo();
  if (!user) return <Button asChild variant="ghost" size="icon" aria-label="Sign in"><Link to="/login"><UserRound /></Link></Button>;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="Account"><UserRound /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link to="/orders">My orders</Link></DropdownMenuItem>
        {user.role === "admin" && <DropdownMenuItem asChild><Link to="/admin">Admin dashboard</Link></DropdownMenuItem>}
        <DropdownMenuItem onClick={() => demo.logout()}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const count = useDemo().cart.reduce((s, c) => s + c.qty, 0);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1480px] items-center gap-5 px-4 sm:px-6 lg:px-10">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu"><Menu /></Button></SheetTrigger>
          <SheetContent side="left" className="w-[88%] max-w-sm">
            <SheetTitle className="flex items-center gap-2 font-display text-2xl"><span className="grid size-8 rotate-3 place-items-center bg-crimson text-crimson-foreground"><BookOpen className="size-4 -rotate-3" /></span>Foliage</SheetTitle>
            <div className="mt-8"><SearchBox onNavigate={() => setOpen(false)} /></div>
            <nav className="mt-8 grid gap-1">
              <Link to="/" onClick={() => setOpen(false)} className="border-b py-4 font-semibold">Home</Link>
              {nav.map((item) => <Link key={item.label} to="/search" search={item.search} onClick={() => setOpen(false)} className="border-b py-4 font-semibold">{item.label}</Link>)}
            </nav>
          </SheetContent>
        </Sheet>
        <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="Foliage home">
          <span className="grid size-9 rotate-3 place-items-center bg-crimson text-crimson-foreground"><BookOpen className="size-5 -rotate-3" /></span>
          <span className="font-display text-2xl font-semibold">Foliage</span>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map((item) => <Link key={item.label} to="/search" search={item.search} className="text-sm font-semibold text-muted-foreground transition-colors hover:text-crimson">{item.label}</Link>)}
        </nav>
        <div className="ml-auto hidden w-full max-w-xs xl:block"><SearchBox compact /></div>
        <div className="ml-auto flex items-center gap-1 xl:ml-0">
          <Button asChild variant="ghost" size="icon" aria-label="Wishlist"><Link to="/search" search={defaultBookSearch}><Heart /></Link></Button>
          <AccountMenu />
          <Button asChild variant="ghost" size="icon" aria-label="Shopping cart" className="relative">
            <Link to="/cart"><ShoppingBag />{count > 0 && <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-crimson text-[10px] text-crimson-foreground">{count}</span>}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}