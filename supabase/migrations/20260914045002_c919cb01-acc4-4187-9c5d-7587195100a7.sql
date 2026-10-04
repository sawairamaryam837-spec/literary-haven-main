create extension if not exists pg_trgm;

create type public.app_role as enum ('admin','customer');
create type public.book_format as enum ('physical','digital','both');
create type public.payment_method as enum ('cod','card');
create type public.payment_status as enum ('PENDING','PAID','FAILED','REFUNDED');
create type public.order_status as enum ('PENDING','CONFIRMED','PROCESSING','PACKED','SHIPPED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED','RETURNED');

create or replace function public.update_updated_at_column() returns trigger language plpgsql set search_path=public as $$
begin new.updated_at = now(); return new; end $$;

-- profiles
create table public.profiles (
  id uuid primary key,
  email text,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

-- roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now(),
  unique(user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role) returns boolean
language sql stable security definer set search_path=public as $$
  select exists (select 1 from public.user_roles where user_id=_user_id and role=_role) $$;
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path=public as $$
  select public.has_role(auth.uid(),'admin') $$;

create policy "profiles_select_own" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "roles_select" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.is_admin());
grant insert, update, delete on public.user_roles to authenticated;
create policy "roles_admin_write" on public.user_roles for all to authenticated using (public.is_admin()) with check (public.is_admin());

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email,'@',1)), new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'customer') on conflict do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  icon text,
  accent text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.categories to anon, authenticated;
grant all on public.categories to service_role;
grant insert, update, delete on public.categories to authenticated;
alter table public.categories enable row level security;
create policy "categories_public_read" on public.categories for select to anon, authenticated using (true);
create policy "categories_admin_write" on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- books
create table public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  author text not null,
  description text,
  short_description text,
  isbn text,
  publisher text,
  publication_date date,
  language text not null default 'English',
  pages int,
  category_id uuid references public.categories(id) on delete set null,
  category_slug text not null,
  genre text,
  tags text[] not null default '{}',
  rating numeric(3,2) not null default 0,
  review_count int not null default 0,
  price numeric(10,2) not null,
  discount_price numeric(10,2),
  stock int not null default 0,
  cover_image text,
  gallery_images text[] not null default '{}',
  preview_url text,
  digital_file_path text,
  physical_available boolean not null default true,
  digital_available boolean not null default false,
  featured boolean not null default false,
  best_seller boolean not null default false,
  new_arrival boolean not null default false,
  is_active boolean not null default true,
  search_vector tsvector,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.books to anon, authenticated;
grant insert, update, delete on public.books to authenticated;
grant all on public.books to service_role;
alter table public.books enable row level security;
create policy "books_public_read" on public.books for select to anon, authenticated using (is_active = true or public.is_admin());
create policy "books_admin_write" on public.books for all to authenticated using (public.is_admin()) with check (public.is_admin());

create or replace function public.books_search_vector_update() returns trigger language plpgsql set search_path=public as $$
begin
  new.search_vector :=
    setweight(to_tsvector('simple', coalesce(new.title,'')),'A') ||
    setweight(to_tsvector('simple', coalesce(new.author,'')),'A') ||
    setweight(to_tsvector('simple', coalesce(new.isbn,'')),'A') ||
    setweight(to_tsvector('simple', coalesce(new.genre,'')),'B') ||
    setweight(to_tsvector('simple', coalesce(new.category_slug,'')),'B') ||
    setweight(to_tsvector('simple', coalesce(array_to_string(new.tags,' '),'')),'C') ||
    setweight(to_tsvector('english', coalesce(new.short_description,'')),'D');
  new.updated_at := now();
  return new;
end $$;
create trigger books_search_vector before insert or update on public.books for each row execute function public.books_search_vector_update();

create index books_search_idx on public.books using gin(search_vector);
create index books_title_trgm on public.books using gin(title gin_trgm_ops);
create index books_author_trgm on public.books using gin(author gin_trgm_ops);
create index books_category_idx on public.books(category_slug);
create index books_genre_idx on public.books(genre);
create index books_price_idx on public.books(price);
create index books_rating_idx on public.books(rating desc);
create index books_isbn_idx on public.books(isbn);
create index books_flags_idx on public.books(featured, best_seller, new_arrival);
create index books_created_idx on public.books(created_at desc);

-- addresses
create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  label text not null default 'Home',
  full_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text,
  postal_code text not null,
  country text not null default 'Pakistan',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.addresses to authenticated;
grant all on public.addresses to service_role;
alter table public.addresses enable row level security;
create policy "addresses_own" on public.addresses for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create trigger addresses_updated before update on public.addresses for each row execute function public.update_updated_at_column();

-- cart
create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  book_id uuid not null references public.books(id) on delete cascade,
  format public.book_format not null default 'physical',
  quantity int not null default 1 check (quantity > 0 and quantity <= 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, book_id, format)
);
grant select, insert, update, delete on public.cart_items to authenticated;
grant all on public.cart_items to service_role;
alter table public.cart_items enable row level security;
create policy "cart_own" on public.cart_items for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create trigger cart_updated before update on public.cart_items for each row execute function public.update_updated_at_column();

-- wishlist
create table public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  book_id uuid not null references public.books(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, book_id)
);
grant select, insert, delete on public.wishlists to authenticated;
grant all on public.wishlists to service_role;
alter table public.wishlists enable row level security;
create policy "wishlist_own" on public.wishlists for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- orders
create sequence public.order_number_seq start 10001;
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('FOL-' || nextval('public.order_number_seq')::text),
  user_id uuid not null,
  subtotal numeric(10,2) not null,
  discount numeric(10,2) not null default 0,
  shipping_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  payment_method public.payment_method not null default 'cod',
  payment_status public.payment_status not null default 'PENDING',
  order_status public.order_status not null default 'PENDING',
  shipping_method text,
  shipping_address jsonb,
  customer_name text,
  customer_email text,
  customer_phone text,
  tracking_number text,
  estimated_delivery date,
  notes text,
  has_physical boolean not null default false,
  has_digital boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;
create policy "orders_select" on public.orders for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "orders_insert_own" on public.orders for insert to authenticated with check (user_id = auth.uid());
create policy "orders_admin_update" on public.orders for update to authenticated using (public.is_admin()) with check (public.is_admin());
create index orders_user_idx on public.orders(user_id, created_at desc);
create index orders_status_idx on public.orders(order_status);
create trigger orders_updated before update on public.orders for each row execute function public.update_updated_at_column();

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  book_id uuid references public.books(id) on delete set null,
  title text not null,
  author text,
  cover_image text,
  format public.book_format not null,
  quantity int not null,
  unit_price numeric(10,2) not null,
  line_total numeric(10,2) not null
);
grant select, insert on public.order_items to authenticated;
grant all on public.order_items to service_role;
alter table public.order_items enable row level security;
create policy "order_items_select" on public.order_items for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())));
create policy "order_items_insert" on public.order_items for insert to authenticated with check (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
create index order_items_order_idx on public.order_items(order_id);

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status public.order_status not null,
  note text,
  created_at timestamptz not null default now()
);
grant select on public.order_status_history to authenticated;
grant all on public.order_status_history to service_role;
alter table public.order_status_history enable row level security;
create policy "osh_select" on public.order_status_history for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())));
create index osh_order_idx on public.order_status_history(order_id, created_at);

create or replace function public.log_order_status() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if tg_op = 'INSERT' or new.order_status is distinct from old.order_status then
    insert into public.order_status_history(order_id, status) values (new.id, new.order_status);
  end if;
  if tg_op = 'UPDATE' and new.order_status = 'DELIVERED' and new.payment_method = 'cod' and new.payment_status = 'PENDING' then
    new.payment_status := 'PAID';
  end if;
  return new;
end $$;
create trigger orders_log_status before insert or update on public.orders for each row execute function public.log_order_status();

-- payments
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  user_id uuid not null,
  method public.payment_method not null,
  status public.payment_status not null default 'PENDING',
  amount numeric(10,2) not null,
  currency text not null default 'USD',
  provider text,
  provider_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.payments to authenticated;
grant all on public.payments to service_role;
alter table public.payments enable row level security;
create policy "payments_select" on public.payments for select to authenticated using (user_id = auth.uid() or public.is_admin());
create trigger payments_updated before update on public.payments for each row execute function public.update_updated_at_column();

-- digital access
create table public.digital_access (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  book_id uuid not null references public.books(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  granted_at timestamptz not null default now(),
  unique(user_id, book_id)
);
grant select on public.digital_access to authenticated;
grant all on public.digital_access to service_role;
alter table public.digital_access enable row level security;
create policy "digital_access_own" on public.digital_access for select to authenticated using (user_id = auth.uid() or public.is_admin());

-- reviews
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  book_id uuid not null references public.books(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  title text,
  body text,
  verified_purchase boolean not null default false,
  reviewer_name text,
  is_approved boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, book_id)
);
grant select on public.reviews to anon, authenticated;
grant insert, update, delete on public.reviews to authenticated;
grant all on public.reviews to service_role;
alter table public.reviews enable row level security;
create policy "reviews_public_read" on public.reviews for select to anon, authenticated using (is_approved = true or user_id = auth.uid() or public.is_admin());
create policy "reviews_insert_own" on public.reviews for insert to authenticated with check (user_id = auth.uid());
create policy "reviews_update_own" on public.reviews for update to authenticated using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "reviews_delete_own" on public.reviews for delete to authenticated using (user_id = auth.uid() or public.is_admin());
create index reviews_book_idx on public.reviews(book_id, created_at desc);

create or replace function public.set_review_defaults() returns trigger language plpgsql security definer set search_path=public as $$
begin
  new.verified_purchase := exists (
    select 1 from public.order_items oi join public.orders o on o.id = oi.order_id
    where o.user_id = new.user_id and oi.book_id = new.book_id and o.order_status <> 'CANCELLED');
  if new.reviewer_name is null then
    select full_name into new.reviewer_name from public.profiles where id = new.user_id;
  end if;
  new.updated_at := now();
  return new;
end $$;
create trigger reviews_defaults before insert or update on public.reviews for each row execute function public.set_review_defaults();

create or replace function public.refresh_book_rating() returns trigger language plpgsql security definer set search_path=public as $$
declare bid uuid;
begin
  bid := coalesce(new.book_id, old.book_id);
  update public.books b set
    rating = coalesce((select round(avg(rating)::numeric,2) from public.reviews where book_id = bid and is_approved), 0),
    review_count = (select count(*) from public.reviews where book_id = bid and is_approved)
  where b.id = bid;
  return null;
end $$;
create trigger reviews_refresh_rating after insert or update or delete on public.reviews for each row execute function public.refresh_book_rating();

-- admin stats
create or replace function public.admin_dashboard_stats() returns jsonb
language plpgsql stable security definer set search_path=public as $$
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  return jsonb_build_object(
    'total_sales', (select coalesce(sum(total),0) from public.orders where order_status <> 'CANCELLED'),
    'total_orders', (select count(*) from public.orders),
    'total_customers', (select count(*) from public.profiles),
    'total_books', (select count(*) from public.books),
    'pending_orders', (select count(*) from public.orders where order_status = 'PENDING'),
    'delivered_orders', (select count(*) from public.orders where order_status = 'DELIVERED'),
    'low_stock', (select count(*) from public.books where physical_available and stock < 5),
    'digital_sales', (select count(*) from public.order_items where format in ('digital','both')),
    'physical_sales', (select count(*) from public.order_items where format in ('physical','both'))
  );
end $$;

-- storage policies
create policy "covers_read" on storage.objects for select to anon, authenticated using (bucket_id = 'book-covers');
create policy "covers_admin_write" on storage.objects for insert to authenticated with check (bucket_id = 'book-covers' and public.is_admin());
create policy "covers_admin_update" on storage.objects for update to authenticated using (bucket_id = 'book-covers' and public.is_admin());
create policy "covers_admin_delete" on storage.objects for delete to authenticated using (bucket_id = 'book-covers' and public.is_admin());
create policy "files_admin_all" on storage.objects for all to authenticated using (bucket_id = 'book-files' and public.is_admin()) with check (bucket_id = 'book-files' and public.is_admin());