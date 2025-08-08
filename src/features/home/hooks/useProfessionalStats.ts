import { supabase } from "@/common/lib/supabase/supabaseClient";
import { useEffect, useState } from "react";

interface ProfessionalStats {
  // Métricas principales
  totalJobs: number;
  completedJobs: number;
  pendingRequests: number;
  workingJobs: number;
  cancelledJobs: number;
  requestsReceived: number;
  
  // Tasas
  acceptanceRate: number;
  completionRate: number;
  cancellationRate: number;
  successRate: number;
  
  // Ingresos
  netIncome: number;
  avgIncomePerJob: number;
  incomeThisMonth: number;
  growthVsLastMonth: number;
  
  // Otros
  profileViews: number;
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

        // 2. Obtener requests completadas para este profesional
        const { data: professionalRequests, error: reqError } = await supabase
          .from("request_professionals")
          .select("request_id, requests!inner(*, bill)")
          .eq("professional_id", userId)
          .eq("requests.status", "completed");
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

        // Obtener todas las requests del profesional (todas las que le han llegado)
        const { data: allProfessionalRequests } = await supabase
          .from("request_professionals")
          .select(`
            request_id, 
            requests!inner(
              id,
              status,
              bill
            )
          `, { count: 'exact' })
          .eq("professional_id", userId);

        
        // Filtrar solo los estados que nos interesan (pending, working, completed, cancelled)
        const relevantRequests = allProfessionalRequests?.filter(
          (r: any) => ['searching', 'pending', 'working', "payed",  'completed', 'cancelled'].includes(r.requests?.status)
        ) || [];
        
        const totalRequests = relevantRequests.length;
        
        // Contar trabajos por estado
        const completedCount = relevantRequests.filter(
          (r: any) => r.requests?.status === 'completed'
        ).length;
        
        const pendingCount = relevantRequests.filter(
          (r: any) => r.requests?.status === 'pending'|| r.requests?.status === 'searching'
        ).length;
        
        const workingCount = relevantRequests.filter(
          (r: any) => r.requests?.status === 'working' || r.requests?.status === 'payed'
        ).length;
        
        const cancelledCount = relevantRequests.filter(
          (r: any) => r.requests?.status === 'cancelled'
        ).length;
        
        // Calcular tasas
        const acceptanceRate = totalRequests > 0 
          ? Math.round(((pendingCount + workingCount) / totalRequests) * 100) 
          : 0;
          
        const completionRate = totalRequests > 0
          ? Math.round((completedCount / totalRequests) * 100)
          : 0;
          
        const cancellationRate = totalRequests > 0
          ? Math.round((cancelledCount / totalRequests) * 100)
          : 0;
        
        // Calcular tasa de éxito: trabajos completados / (completados + cancelados)
        const totalFinalizedJobs = completedCount + cancelledCount;
        const successRate = totalFinalizedJobs > 0
          ? Math.round((completedCount / totalFinalizedJobs) * 100)
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
              return location?.city || null;
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
          `Has completado ${completedCount} trabajos`,
          `Tienes ${pendingCount} solicitudes pendientes`,
          acceptanceRate > 75 
            ? 'Excelente tasa de aceptación' 
            : 'Podrías mejorar tu tasa de aceptación'
        ];
        
        // Calcular total de trabajos (completados + en curso + cancelados)
        const totalJobsCount = completedCount + workingCount + cancelledCount;
        
        // Calcular métricas de ingresos
        const monthlyIncome = (jobsThisMonth as any[]).reduce((sum: number, job: any) => sum + ((job.requests?.bill?.total as number) || 0), 0);
        const totalEarnings = (completedRequests as any[]).reduce((sum: number, req: any) => sum + ((req.requests?.bill?.total as number) || 0), 0);
        const averagePerJob = completedCount > 0 ? totalEarnings / completedCount : 0;
        
        // Establecer todas las estadísticas
        setStats({
          // Métricas principales
          totalJobs: totalJobsCount,
          completedJobs: completedCount,
          pendingRequests: pendingCount,
          workingJobs: workingCount,
          cancelledJobs: cancelledCount,
          requestsReceived: totalRequests,
          
          // Tasas
          acceptanceRate,
          completionRate,
          cancellationRate,
          successRate,
          
          // Ingresos
          netIncome: totalEarnings,
          avgIncomePerJob: averagePerJob,
          incomeThisMonth: monthlyIncome,
          growthVsLastMonth: growthVsLastMonth,
          
          // Otros
          profileViews: user.profile_views || 0,
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
