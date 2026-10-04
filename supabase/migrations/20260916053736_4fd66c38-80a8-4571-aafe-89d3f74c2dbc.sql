DROP POLICY IF EXISTS "books_public_read" ON public.books;
CREATE POLICY "books_public_read" ON public.books
FOR SELECT TO anon, authenticated
USING (is_active = true);

CREATE POLICY "books_admin_read_all" ON public.books
FOR SELECT TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "reviews_public_read" ON public.reviews;
CREATE POLICY "reviews_public_read" ON public.reviews
FOR SELECT TO anon, authenticated
USING (is_approved = true);

CREATE POLICY "reviews_owner_admin_read" ON public.reviews
FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_admin());