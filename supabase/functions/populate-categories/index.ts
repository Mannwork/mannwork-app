import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CategoryData {
  [key: string]: string[]
}

const categoriesData: CategoryData = {
  "Carpintero": [
    "Ebanistería",
    "Aberturas de aluminio",
    "Aberturas de madera",
    "Muebles",
    "Machimbre",
    "Carpintería general",
    "PVC"
  ],
  "Plomero": [
    "Filtraciones",
    "Cañerias",
    "Sanitarios",
    "Grifería",
    "Bombas de agua",
    "Tanques de agua",
    "Pozos sépticos",
    "Calderas",
    "Plomería general"
  ],
  "Técnico": [
    "Computadoras",
    "Tablets y celulares",
    "Impresoras",
    "Electrodomésticos",
    "Televisores",
    "Cámaras",
    "Antenas",
    "Refrigeración",
    "Tecnología general"
  ],
  "Albañil": [
    "Techos",
    "Muros",
    "Terrazas",
    "Escaleras",
    "Suelos",
    "Construccion en seco",
    "Ceramicos y azulejos",
    "Sanitarios",
    "Reformas y  arreglos",
    "Albañilería general",
    "Impermeabilizaciones"
  ],
  "Tapicero": [
    "Tapicería"
  ],
  "Limpieza": [
    "Alfombras",
    "Limpieza del hogar",
    "Limpieza general",
    "Limpieza en profundidad",
    "Ventanas",
    "Limpieza en altura",
    "Exterior",
    "Cortinas",
    "Muebles"
  ],
  "Colocador": [
    "Pulido y plastificado de pisos",
    "Pisos flotantes",
    "Ventiladores de techo",
    "Parquet",
    "Marmol",
    "Toldos",
    "Zinguería",
    "Cristales",
    "Alfombras",
    "Ascensores",
    "Armado de muebles",
    "Instalaciones generales",
    "Muebles de Cocina",
    "Vidrios y espejos",
    "Pisos en Hormigón",
    "Instalación de persianas",
    "Cuadros",
    "Cortinas"
  ],
  "Electricista": [
    "Instalaciones",
    "Iluminación",
    "Electricidad general"
  ],
  "Gasista": [
    "Artefactos a gas",
    "Tubos y cañerías",
    "Calefacción",
    "Instalación de calderas",
    "Reparación de calderas",
    "Gasista general"
  ],
  "Pintor": [
    "Pintura",
    "Revestimientos",
    "Humedad",
    "Otros trabajos"
  ],
  "Mudancero": [
    "Mudanzas internacionales",
    "Mudanzas nacionales",
    "Mudanzas generales",
    "Fletes",
    "Mini fletes"
  ],
  "Reformas": [
    "Reformas de baños",
    "Reforma de cocinas",
    "Reformas integrales",
    "Reformas parciales",
    "Reformas en general"
  ],
  "Cerrajero": [
    "Cerraduras",
    "Llaves",
    "Cerrajería general"
  ],
  "Jardinero": [
    "Paisajismo",
    "Poda en altura",
    "Mantenimiento",
    "Poda y extracción de árboles",
    "Riego",
    "Jardinería general"
  ],
  "Arquitecto": [
    "Planos",
    "Construcción",
    "Quinchos",
    "Arquitectura general"
  ],
  "Herrero": [
    "Soldaduras",
    "Rejas y portones",
    "Herrería artística",
    "Herrería general"
  ],
  "Decorador": [
    "Interiores",
    "Tapicería",
    "Exteriores",
    "Decoración general"
  ],
  "Control de plagas": [
    "Plagas de madera",
    "Control de aves",
    "Control de insectos",
    "Control de roedores"
  ],
  "Seguridad": [
    "Cámaras de vigilancia",
    "Cercos eléctricos",
    "Alarmas",
    "Seguridad general"
  ],
  "Piletas": [
    "Construcción",
    "Mantenimiento",
    "Limpieza"
  ],
  "Bienestar": [
    "Entrenador personal",
    "Asesor de nutrición",
    "Mindfulness"
  ],
  "Cuidadores": [
    "Cuidado de personas",
    "Niñera",
    "Niños con necesidades especiales",
    "Adultos mayores",
    "Personas con necesidades especiales"
  ],
  "Mascotas": [
    "Paseador de perros",
    "Guardería de día",
    "Alojamiento de mascotas",
    "Mascotas general"
  ],
  "A/A": [
    "Instalación",
    "Reparación",
    "Aires Acondicionados en General"
  ],
  "Belleza": [
    "Manicura en casa",
    "Pedicura en casa",
    "Peluquería en casa",
    "Maquillaje en casa",
    "Estética facial en casa",
    "Depilación en casa"
  ],
  "Autos": [
    "Limpieza a domicilio",
    "Cambio de neumáticos domicilio",
    "Reparaciones a domicilio",
    "Mantenimiento a domicilio",
    "Grúas a domicilio"
  ],
  "Eventos": [
    "Sonido a domicilio",
    "Magos a domicilio",
    "Animadores a domicilio",
    "Payasos a domicilio",
    "Carpas a domicilio",
    "Camareros a domicilio",
    "Mobiliario a domicilio",
    "Decoración a domicilio",
    "Papelería a domicilio",
    "Catering a domicilio",
    "Repostería a domicilio",
    "Cocinero a domicilio",
    "Fotógrafo a domicilio",
    "Coctelería a domicilio",
    "Atracciones infantiles a domicilio"
  ]
}

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if method is POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Starting to populate categories...')

    // Prepare categories data for insertion
    const categoriesToInsert = Object.entries(categoriesData).map(([name, subCategories]) => ({
      name,
      icon_url: '', // Empty string as requested
      sub_categories: subCategories
    }))

    // Insert or update categories
    const { data, error } = await supabaseClient
      .from('categories')
      .upsert(categoriesToInsert, {
        onConflict: 'name',
        ignoreDuplicates: false
      })
      .select()

    if (error) {
      console.error('Error inserting categories:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to insert categories', 
          details: error.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Successfully inserted/updated ${data?.length || 0} categories`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully populated ${data?.length || 0} categories`,
        categories: data
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 