# Supabase Edge Functions - Categories

Este directorio contiene la Edge Function para manejar las categorías de servicios.

### 1. populate-categories

**Propósito**: Poblar la tabla de categorías con datos predefinidos
**Método**: POST
**Endpoint**: `/functions/v1/populate-categories`

Esta función inserta o actualiza las categorías principales y sus subcategorías en la base de datos.

#### Uso:

```bash
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/populate-categories' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json'
```

## Estructura de la tabla categories

```sql
CREATE TABLE public.categories (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL UNIQUE,
  icon_url text DEFAULT '',
  sub_categories text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## Instalación y deployment

1. Aplicar la migración de la tabla:

```bash
supabase db push
```

2. Deployar las funciones:

```bash
supabase functions deploy populate-categories
```

3. Poblar la base de datos:

```bash
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/populate-categories' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json'
```

## Categorías incluidas

La función `populate-categories` incluye las siguientes categorías principales:

- Carpintero
- Plomero
- Técnico
- Albañil
- Tapicero
- Limpieza
- Colocador
- Electricista
- Gasista
- Pintor
- Mudancero
- Reformas
- Cerrajero
- Jardinero
- Arquitecto
- Herrero
- Decorador
- Control de plagas
- Seguridad
- Piletas
- Bienestar
- Cuidadores
- Mascotas
- A/A
- Belleza
- Autos
- Eventos

Cada categoría incluye múltiples subcategorías específicas del rubro.
