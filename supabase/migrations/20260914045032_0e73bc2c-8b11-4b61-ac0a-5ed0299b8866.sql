create schema if not exists extensions;
alter extension pg_trgm set schema extensions;
grant usage on schema extensions to anon, authenticated, service_role;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.log_order_status() from public, anon, authenticated;
revoke execute on function public.set_review_defaults() from public, anon, authenticated;
revoke execute on function public.refresh_book_rating() from public, anon, authenticated;
revoke execute on function public.books_search_vector_update() from public, anon, authenticated;
revoke execute on function public.update_updated_at_column() from public, anon, authenticated;
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
revoke execute on function public.is_admin() from public, anon;
revoke execute on function public.admin_dashboard_stats() from public, anon;