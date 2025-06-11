import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const payload = await req.json();
    const { data: user, type } = payload;

    console.log(`Processing Clerk webhook: ${type} for user ${user.id}`);

    if (type === "user.created") {
      // Extraer datos del usuario de Clerk
      const email = user.email_addresses?.[0]?.email_address;
      const firstName = user.first_name;
      const lastName = user.last_name;
      const imageUrl = user.image_url;

      // Crear usuario en la tabla personalizada users usando upsert
      const { data: userData, error: userError } = await supabaseClient
        .from("users")
        .upsert({
          id: user.id, // Usar el ID de Clerk
          name: firstName || "",
          last_name: lastName || "",
          rol: "client", // Por defecto, luego se puede cambiar en onboarding
          email,
          profile_pic: imageUrl,
          is_onboarding_complete: false, // Inicialmente no ha completado el onboarding
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id' // En caso de que ya exista, actualizar
        })
        .select()
        .single();

      if (userError) {
        console.error("Error creating/updating user:", userError);
        throw userError;
      }

      console.log("User created/updated successfully:", userData);

      return new Response(
        JSON.stringify({
          message: "User synchronized successfully",
          user: userData,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    if (type === "user.updated") {
      // Obtener datos actuales para no sobrescribir onboarding
      const { data: existingUser } = await supabaseClient
        .from("users")
        .select("is_onboarding_complete, rol, ubication_json, membership_json")
        .eq("id", user.id)
        .single();

      const email = user.email_addresses?.[0]?.email_address;
      const firstName = user.first_name;
      const lastName = user.last_name;
      const imageUrl = user.image_url;

      // Solo actualizar campos básicos, preservar estado de onboarding y configuraciones
      const updateData: any = {
        name: firstName || "",
        last_name: lastName || "",
        email,
        profile_pic: imageUrl,
        updated_at: new Date().toISOString(),
      };

      // Preservar datos importantes si ya existen
      if (existingUser) {
        updateData.is_onboarding_complete = existingUser.is_onboarding_complete;
        updateData.rol = existingUser.rol;
        updateData.ubication_json = existingUser.ubication_json;
        updateData.membership_json = existingUser.membership_json;
      }

      const { data: userData, error: userError } = await supabaseClient
        .from("users")
        .update(updateData)
        .eq("id", user.id)
        .select()
        .single();

      if (userError) {
        console.error("Error updating user:", userError);
        throw userError;
      }

      console.log("User updated successfully:", userData);

      return new Response(
        JSON.stringify({
          message: "User updated successfully",
          user: userData,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    if (type === "user.deleted") {
      // Eliminar usuario de la tabla
      const { error: deleteError } = await supabaseClient
        .from("users")
        .delete()
        .eq("id", user.id);

      if (deleteError) {
        console.error("Error deleting user:", deleteError);
        throw deleteError;
      }

      console.log("User deleted successfully");

      return new Response(
        JSON.stringify({ message: "User deleted successfully" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    return new Response(JSON.stringify({ message: "Event type not handled" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: "Failed to process Clerk webhook",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
}); 