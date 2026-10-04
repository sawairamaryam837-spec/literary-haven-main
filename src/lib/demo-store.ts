import { useSyncExternalStore } from "react";

// Demo-only state saved in this browser (no backend).
export type DemoUser = { name: string; email: string; role: "customer" | "admin" };
export type CartItem = { id: string; slug: string; title: string; author: string; cover: string | null; price: number; format: string; qty: number };
export const ORDER_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type Order = {
  id: string; number: string; customer: string; email: string; address: string; phone: string;
  items: CartItem[]; subtotal: number; shipping: number; total: number;
  payment: "cod" | "card"; paymentStatus: "PENDING" | "PAID"; status: OrderStatus; createdAt: string;
};
type State = { user: DemoUser | null; cart: CartItem[]; orders: Order[] };

const KEY = "foliage-demo";
const seedOrders = (): Order[] => {
  const names = ["Ayesha Khan", "Ali Raza", "Sara Ahmed", "Usman Tariq", "Fatima Noor", "Hamza Iqbal"];
  return names.map((n, i) => {
    const total = 18 + i * 11.5;
    return {
      id: `seed-${i}`, number: `FOL-${10230 + i}`, customer: n, email: (n.split(" ")[0] ?? "user").toLowerCase() + "@example.com",
      address: "House 12, Street 4, Lahore", phone: "0300-0000000",
      items: [{ id: `s${i}`, slug: "", title: ["Dracula", "Atomic Habits", "Dune", "1984", "The Alchemist", "Sapiens"][i] ?? "Book", author: "", cover: null, price: total, format: "physical", qty: 1 }],
      subtotal: total, shipping: 0, total, payment: i % 2 ? "card" : "cod", paymentStatus: i % 2 || i === 4 ? "PAID" : "PENDING",
      status: (["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "OUT_FOR_DELIVERY"] as OrderStatus[])[i],
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    };
  });
};
const empty: State = { user: null, cart: [], orders: [] };
let state: State = empty;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { state = { ...empty, ...JSON.parse(localStorage.getItem(KEY) ?? "null") }; } catch { /* ignore */ }
  if (!state.orders.length) state = { ...state, orders: seedOrders() };
}
function set(next: Partial<State>) {
  state = { ...state, ...next };
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export function useDemo() {
  return useSyncExternalStore(
    (l) => { load(); listeners.add(l); l(); return () => listeners.delete(l); },
    () => { load(); return state; },
    () => empty,
  );
}

export const demo = {
  login: (user: DemoUser) => set({ user }),
  logout: () => set({ user: null }),
  addToCart: (item: Omit<CartItem, "qty">) => {
    load();
    const found = state.cart.find((c) => c.id === item.id && c.format === item.format);
    set({ cart: found ? state.cart.map((c) => (c === found ? { ...c, qty: c.qty + 1 } : c)) : [...state.cart, { ...item, qty: 1 }] });
  },
  setQty: (i: number, qty: number) => set({ cart: qty < 1 ? state.cart.filter((_, j) => j !== i) : state.cart.map((c, j) => (j === i ? { ...c, qty } : c)) }),
  placeOrder: (o: Omit<Order, "id" | "number" | "items" | "subtotal" | "shipping" | "total" | "status" | "paymentStatus" | "createdAt">) => {
    const subtotal = state.cart.reduce((s, c) => s + c.price * c.qty, 0);
    const shipping = subtotal > 50 ? 0 : 4.99;
    const order: Order = {
      ...o, id: crypto.randomUUID(), number: `FOL-${10300 + state.orders.length}`, items: state.cart,
      subtotal, shipping, total: subtotal + shipping, status: "PENDING",
      paymentStatus: o.payment === "card" ? "PAID" : "PENDING", createdAt: new Date().toISOString(),
    };
    set({ orders: [order, ...state.orders], cart: [] });
    return order;
  },
  setStatus: (id: string, status: OrderStatus) =>
    set({ orders: state.orders.map((o) => (o.id === id ? { ...o, status, paymentStatus: status === "DELIVERED" ? "PAID" : o.paymentStatus } : o)) }),
};

export const money = (n: number) => `$${n.toFixed(2)}`;
