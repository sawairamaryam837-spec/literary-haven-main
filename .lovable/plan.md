# Continue the Foliage storefront

## Goal
Replace the starter screen with the selected Editorial Bestseller storefront and make the catalogue searchable using the 1,320 seeded books.

## Build
- Add shared storefront navigation, mobile menu, search entry, footer, rating display, wishlist control, book cover, animated book card, book grid, and loading placeholders.
- Build the homepage with The Hollow Tide feature, category rail, and data-backed Featured, Best Sellers, New Arrivals, Horror, and Recommended shelves.
- Build `/books` as the main catalogue with URL-backed search, category/genre, price, rating, stock, format, sorting, and pagination controls.
- Add `/search` as a dedicated search experience with live suggestions that leads into catalogue results.
- Add book detail route scaffolding so every visible book link opens a real page rather than a dead end.
- Apply unique page metadata and replace the placeholder metadata.

## Technical details
- Use TanStack Start route loaders with TanStack Query for initial catalogue reads.
- Reuse the existing catalogue server functions and Foliage design tokens.
- Use Motion for restrained reveal and 3D card interactions, respecting reduced-motion settings.
- Keep all imagery data-backed from the seeded catalogue and lazy-load non-critical covers.

## Verification
- Check homepage data, catalogue filters, sorting, pagination, search suggestions, book links, mobile navigation, and desktop/mobile layouts in the running preview.
- Confirm relevant tests and automated project checks pass.
