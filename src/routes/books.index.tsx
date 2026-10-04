import { createFileRoute, redirect } from "@tanstack/react-router";
import { defaultBookSearch } from "@/components/storefront/search-defaults";

export const Route = createFileRoute("/books/")({
  beforeLoad: () => {
    throw redirect({ to: "/search", search: defaultBookSearch });
  },
});
