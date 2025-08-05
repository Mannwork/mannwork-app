import { supabase } from "@/common/lib/supabase/supabaseClient";
import { useEffect, useState } from "react";

interface ProfessionalStats {
  jobsThisMonth: number;
  totalJobs: number;
  incomeThisMonth: number;
  netIncome: number;
  avgIncomePerJob: number;
  growthVsLastMonth: number;
  acceptanceRate: number;
  responseRate: number;
  successRate: number;
  profileViews: number;
  requestsReceived: number;
  topZones: string[];
  isPremium: boolean;
  commissionSavings: number;
  premiumBenefits: string[];
  insights: string[];
  monthlyIncomeHistory: { month: string; value: number }[];
}

export function useProfessionalStats(userId: string) {
  const [stats, setStats] = useState<ProfessionalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        // 1. Traer datos del usuario
        const { data: user, error: userError } = await supabase
          .from("users")
          .select("*, membership_json")
          .eq("id", userId)
          .single();
        if (userError) throw userError;

        // 2. Obtener IDs de requests completadas para este profesional
        const { data: professionalRequests, error: reqError } = await supabase
          .from("request_professionals")
          .select("request_id, requests(*, bill)", { count: 'exact' })
          .eq("professional_id", userId)
          .eq("status", "accepted");
        if (reqError) throw reqError;
        
        // 3. Obtener detalles de las requests completadas
        const completedRequests = professionalRequests
          ?.map(pr => pr.requests)
          .filter((r: any) => r?.status === "completed") || [];

        // 3. Ingresos totales y mensuales
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        const jobsThisMonth = completedRequests?.filter((r: any) => {
          const date = new Date(r.inserted_at);
          return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
        }) ?? [];
        const incomeThisMonth = jobsThisMonth.reduce((sum: number, r: any) => sum + (r.bill ? Number(r.bill) : 0), 0);
        const netIncome = completedRequests?.reduce((sum: number, r: any) => sum + (r.bill ? Number(r.bill) : 0), 0) ?? 0;
        const avgIncomePerJob = netIncome / ((completedRequests?.length || 1));

        // 4. Reviews
        const { data: reviews } = await supabase
          .from("reviews")
          .select("*")
          .eq("professional_id", userId);
        const avgRating = reviews && reviews.length
          ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
          : user.calification ?? 0;

        // 5. Cálculo de métricas adicionales
        
        // Cálculo de crecimiento respecto al mes anterior
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const lastMonthIncome = completedRequests
          ?.filter((r: any) => {
            const date = new Date(r.inserted_at);
            return date.getMonth() === lastMonth.getMonth() && 
                   date.getFullYear() === lastMonth.getFullYear();
          })
          .reduce((sum: number, r: any) => sum + (r.bill ? Number(r.bill) : 0), 0) || 0;
        
        const growthVsLastMonth = lastMonthIncome > 0 
          ? Math.round(((incomeThisMonth - lastMonthIncome) / lastMonthIncome) * 100) 
          : incomeThisMonth > 0 ? 100 : 0;

        // Obtener todas las requests del profesional (aceptadas, rechazadas, etc.)
        const { data: allProfessionalRequests } = await supabase
          .from("request_professionals")
          .select("status, requests(*, bill)", { count: 'exact' })
          .eq("professional_id", userId);
        
        const totalRequests = allProfessionalRequests?.length || 0;
        const acceptedRequests = allProfessionalRequests?.filter(
          (r: any) => r.status === 'accepted'
        ).length || 0;
        
        // Cálculo de tasas
        const acceptanceRate = totalRequests > 0 
          ? Math.round((acceptedRequests / totalRequests) * 100) 
          : 0;
        
        // Para responseRate, asumimos que es el porcentaje de requests respondidas
        const responseRate = totalRequests > 0 
          ? Math.round(((totalRequests - (allProfessionalRequests?.filter(
              (r: any) => r.status === 'pending'
            ).length || 0)) / totalRequests) * 100) 
          : 0;
        
        // Success rate: porcentaje de trabajos completados vs aceptados
        const successRate = acceptedRequests > 0 
          ? Math.round((completedRequests.length / acceptedRequests) * 100)
          : 0;
        
        // Historial de ingresos de los últimos 6 meses
        const monthlyIncomeHistory = Array.from({ length: 6 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - (5 - i));
          const monthName = date.toLocaleString('es-AR', { month: 'short' });
          const monthIncome = completedRequests
            ?.filter((r: any) => {
              const reqDate = new Date(r.inserted_at);
              return reqDate.getMonth() === date.getMonth() && 
                     reqDate.getFullYear() === date.getFullYear();
            })
            .reduce((sum: number, r: any) => sum + (r.bill ? Number(r.bill) : 0), 0) || 0;
          
          return { month: monthName, value: monthIncome };
        });
        
        // Zonas más comunes (ejemplo con datos de ubicación)
        const zones = (completedRequests || [])
          .map((r: any) => {
            try {
              // Intentar parsear location si es un string
              const location = typeof r.location === 'string' 
                ? JSON.parse(r.location) 
                : r.location;
              return location?.neighborhood || location?.city || null;
            } catch (e) {
              return null;
            }
          })
          .filter(Boolean) as string[];
        
        const zoneCounts = zones.reduce<Record<string, number>>((acc, zone) => {
          if (zone) {
            acc[zone] = (acc[zone] || 0) + 1;
          }
          return acc;
        }, {});
        
        const topZones = Object.entries(zoneCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([zone]) => zone);
        
        // Ahorro por comisión (ejemplo: 10% de ahorro si es premium)
        const commissionRate = user.membership_json?.isPro ? 0.01 : 0.05; // 10% vs 15%
        const commissionSavings = netIncome * commissionRate;
        
        // Insights personalizados
        const insights = [
          `Tu calificación actual es ${avgRating.toFixed(1)}/5`,
          `Has completado ${completedRequests.length} trabajos`,
          growthVsLastMonth > 0 
            ? `¡Tus ingresos aumentaron un ${growthVsLastMonth}% respecto al mes pasado!` 
            : growthVsLastMonth < 0
              ? `Tus ingresos bajaron un ${Math.abs(growthVsLastMonth)}% respecto al mes pasado`
              : 'Tus ingresos se mantuvieron estables este mes',
          acceptanceRate > 75 
            ? 'Excelente tasa de aceptación' 
            : 'Podrías mejorar tu tasa de aceptación'
        ];
        
        // Establecer todas las estadísticas
        setStats({
          jobsThisMonth: jobsThisMonth.length,
          totalJobs: completedRequests.length,
          incomeThisMonth,
          netIncome,
          avgIncomePerJob: Math.round(avgIncomePerJob),
          growthVsLastMonth,
          acceptanceRate,
          responseRate,
          successRate,
          profileViews: user.profile_views || 0, // Asumiendo que existe este campo
          requestsReceived: totalRequests,
          topZones: topZones.length > 0 ? topZones : ["Aún no hay datos de ubicación"],
          isPremium: user.membership_json?.isPro ?? false,
          commissionSavings: Math.round(commissionSavings),
          premiumBenefits: [
            "Más solicitudes", 
            "Menor comisión", 
            "Más visibilidad"
          ],
          insights,
          monthlyIncomeHistory,
        });
      } catch (e: any) {
        setError(e.message || "Error al cargar estadísticas");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  return { stats, loading, error };
}
