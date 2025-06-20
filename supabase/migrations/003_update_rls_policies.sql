-- Este archivo actualiza las políticas de seguridad a nivel de fila (RLS)
-- para mejorar el rendimiento, utilizando un método explícito de DROP e CREATE.

-- Políticas para la tabla 'users'
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT 
  USING ((SELECT auth.jwt() ->> 'sub') = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE 
  USING ((SELECT auth.jwt() ->> 'sub') = id)
  WITH CHECK ((SELECT auth.jwt() ->> 'sub') = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT 
  WITH CHECK ((SELECT auth.jwt() ->> 'sub') = id);

DROP POLICY IF EXISTS "Service role can manage users" ON public.users;
CREATE POLICY "Service role can manage users" ON public.users
  FOR ALL
  USING (
    (SELECT auth.jwt() ->> 'role') = 'service_role'
    OR (SELECT auth.role()) = 'service_role'
  );

-- Políticas para la tabla 'categories'
DROP POLICY IF EXISTS "Authenticated users can view categories" ON public.categories;
CREATE POLICY "Authenticated users can view categories" ON public.categories
  FOR SELECT 
  USING ((SELECT auth.role()) = 'authenticated' OR (SELECT auth.role()) = 'anon');

DROP POLICY IF EXISTS "Service role can manage categories" ON public.categories;
CREATE POLICY "Service role can manage categories" ON public.categories
  FOR ALL
  USING (
    (SELECT auth.jwt() ->> 'role') = 'service_role'
    OR (SELECT auth.role()) = 'service_role'
  ); 