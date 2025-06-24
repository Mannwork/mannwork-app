-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS public.categories (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL UNIQUE,
  icon_url text DEFAULT '',
  sub_categories text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para categorías (permitir lectura a todos los usuarios autenticados)
CREATE POLICY "Authenticated users can view categories" ON public.categories
  FOR SELECT 
  USING ((SELECT auth.role()) = 'authenticated' OR (SELECT auth.role()) = 'anon');

-- Política para que el servicio pueda gestionar categorías
CREATE POLICY "Service role can manage categories" ON public.categories
  FOR ALL
  USING (
    (SELECT auth.jwt() ->> 'role') = 'service_role'
    OR (SELECT auth.role()) = 'service_role'
  );

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_categories_name ON public.categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_sub_categories ON public.categories USING GIN(sub_categories);

-- Trigger para actualizar updated_at en categories
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentarios para documentación
COMMENT ON TABLE public.categories IS 'Tabla de categorías de servicios con subcategorías';
COMMENT ON COLUMN public.categories.name IS 'Nombre de la categoría principal';
COMMENT ON COLUMN public.categories.icon_url IS 'URL del icono de la categoría';
COMMENT ON COLUMN public.categories.sub_categories IS 'Array de subcategorías relacionadas'; 