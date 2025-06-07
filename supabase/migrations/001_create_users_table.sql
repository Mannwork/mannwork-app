-- Crear tabla de usuarios para integración con Clerk
CREATE TABLE IF NOT EXISTS public.users (
  -- Identificación (Clerk)
  id text PRIMARY KEY,                    -- ID de Clerk
  name text NOT NULL,
  last_name text NOT NULL,
  rol text CHECK (rol IN ('professional', 'client')) NOT NULL,
  email text NOT NULL,
  cel_phone text,
  
  -- Ubicación y servicio
  ubication_json jsonb,
  service_radius integer,                 -- En metros
  
  -- Perfil e identificación
  profile_pic text,                       -- URL del avatar
  identification_pics_json jsonb,         -- URLs de documentos de identidad
  
  -- Estados del usuario
  is_validated boolean DEFAULT false,
  is_onboarding_complete boolean DEFAULT false,
  is_banned boolean DEFAULT false,
  
  -- Métricas y rating
  calification decimal(3,2) DEFAULT 0.00 CHECK (calification >= 0.00 AND calification <= 5.00), -- Calificación de 0.00 a 5.00
  total_requests integer DEFAULT 0,
  total_quotes integer DEFAULT 0,
  max_quotes integer DEFAULT 5,           -- Límite base
  
  -- Membresía
  membership_json jsonb,
  
  -- Actividad
  last_connection timestamptz,
  
  -- Timestamps automáticos
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas para integración con Clerk
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT 
  USING (auth.jwt() ->> 'sub' = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE 
  USING (auth.jwt() ->> 'sub' = id);

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT 
  WITH CHECK (auth.jwt() ->> 'sub' = id);

-- Política para que el servicio (webhooks) pueda gestionar usuarios
CREATE POLICY "Service role can manage users" ON public.users
  FOR ALL
  USING (
    auth.jwt() ->> 'role' = 'service_role'
    OR auth.role() = 'service_role'
  );

-- Índices básicos para performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_rol ON public.users(rol);
CREATE INDEX IF NOT EXISTS idx_users_onboarding ON public.users(is_onboarding_complete);
CREATE INDEX IF NOT EXISTS idx_users_validated_rol ON public.users(is_validated, rol);
CREATE INDEX IF NOT EXISTS idx_users_province_city ON public.users((ubication_json->>'province'), (ubication_json->>'city'));

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en users
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentarios para documentación
COMMENT ON TABLE public.users IS 'Tabla principal de usuarios integrada con Clerk Auth';
COMMENT ON COLUMN public.users.id IS 'ID del usuario de Clerk (string)';
COMMENT ON COLUMN public.users.ubication_json IS 'Datos de ubicación: province, city, street, type, floor, apartment_number, cp, latitude, longitude';
COMMENT ON COLUMN public.users.service_radius IS 'Radio de servicio en metros (solo para profesionales)';
COMMENT ON COLUMN public.users.identification_pics_json IS 'URLs de fotos de identificación: front_pic, back_pic, selfie_pic, status';
COMMENT ON COLUMN public.users.membership_json IS 'Datos de membresía: is_pro, plan_type, dates, benefits';
COMMENT ON COLUMN public.users.calification IS 'Calificación promedio del usuario (0.00 a 5.00)'; 