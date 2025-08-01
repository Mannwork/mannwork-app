import ProfessionalStats from "@/features/home/professionalStats";
import { View } from 'react-native';

export default function ProfessionalStatsScreen() {
  // Datos de ejemplo/mock
  const stats = {
    jobsThisMonth: 8,
    totalJobs: 120,
    incomeThisMonth: 250000,
    netIncome: 210000,  
    avgIncomePerJob: 31250,
    growthVsLastMonth: 12,
    acceptanceRate: 92,
    responseRate: 85,
    successRate: 97,
    profileViews: 340,
    requestsReceived: 22,
    topZones: ["Palermo", "Recoleta", "Belgrano"],
    isPremium: true,
    commissionSavings: 18000,
    premiumBenefits: ["Clientes destacados", "Menor comisión", "Más visibilidad"],
    insights: [
      "Tu calificación subió 0.2 este mes. ¡Buen trabajo!",
      "Recibiste más visitas esta semana.",
      "Tu tasa de respuesta es menor a la media.",
    ],
    monthlyIncomeHistory: [
      { month: "Ene", value: 180000 },
      { month: "Feb", value: 200000 },
      { month: "Mar", value: 220000 },
      { month: "Abr", value: 210000 },
      { month: "May", value: 230000 },
      { month: "Jun", value: 250000 },
    ],
  };

  return (
    <View style={{ flex: 1 }}>
      <ProfessionalStats stats={stats} />
    </View>
  );
}   