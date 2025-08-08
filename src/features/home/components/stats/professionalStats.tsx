import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Circle } from "react-native-svg";
import { Grid, LineChart, XAxis } from 'react-native-svg-charts';
import MetricCard from "./MetricCard";

export interface ProfessionalStatsProps {
  stats: {
    totalJobs: number;
    completedJobs: number;
    pendingRequests: number;
    workingJobs: number;
    cancelledJobs: number;
    acceptanceRate: number;
    completionRate: number;
    cancellationRate: number;
    successRate: number;
    profileViews: number;
    requestsReceived: number;
    topZones: string[];
    isPremium: boolean;
    commissionSavings?: number;
    premiumBenefits?: string[];
    insights: string[];
    monthlyIncomeHistory: { month: string; value: number }[];
  };
}

interface MetricConfig {
  key: string;
  label: string;
  isMoney?: boolean;
  isPercent?: boolean;
  fullWidth?: boolean;
}

const mainMetrics: MetricConfig[] = [
  { key: 'completedJobs', label: 'Solicitudes completadas' },
  { key: 'pendingRequests', label: 'Solicitudes pendientes' },
  { key: 'workingJobs', label: 'Solicitudes en curso' },
  { key: 'cancelledJobs', label: 'Solicitudes canceladas' },
  { key: 'requestsReceived', label: 'Solicitudes totales', fullWidth: true },
];

const rateMetrics: MetricConfig[] = [
  { key: 'acceptanceRate', label: 'Tasa de aceptación', isPercent: true },
  { key: 'completionRate', label: 'Tasa de finalización', isPercent: true },
  { key: 'cancellationRate', label: 'Tasa de cancelación', isPercent: true },
  { key: 'successRate', label: 'Tasa de éxito', isPercent: true },
];

const incomeMetrics: MetricConfig[] = [
  { key: 'netIncome', label: 'Ingresos totales', isMoney: true },
  { key: 'incomeThisMonth', label: 'Ingresos este mes', isMoney: true },
  { key: 'avgIncomePerJob', label: 'Promedio por trabajo', isMoney: true },
  { key: 'growthVsLastMonth', label: 'Crecimiento vs mes anterior', isPercent: true },
];

const Decorator = ({ x, y, data }: { x: (index: number) => number; y: (value: number) => number; data: number[] }) => 
  data.map((value, index) => (
    <Circle
      key={index}
      cx={x(index)}
      cy={y(value)}
      r={4}
      stroke="#fff"
      fill="#2D7A3E"
    />
  ));

const ProfessionalStats: React.FC<ProfessionalStatsProps> = ({ stats }) => {
  const insets = useSafeAreaInsets();
  const data = stats.monthlyIncomeHistory.map(item => item.value);
  const months = stats.monthlyIncomeHistory.map(item => item.month);

  return (
    <ScrollView className="flex-1 pb-6 bg-gray-50">
      <View
        className="bg-green-mannwork px-4"
        style={{ paddingTop: insets.top + 20 }}
      >
        <View className="flex-row items-center">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-2"
          >
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
          <Text className="text-white text-4xl font-bold flex-1 text-center">
            Estadísticas
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </View>
      {/* Sección de Métricas Principales */}
      <View className="mb-6">
        <View className="flex-row bg-green-mannwork pt-6 px-2 flex-wrap justify-between px-2">
          {mainMetrics.slice(0, -1).map((metric) => (
            <MetricCard 
              key={metric.key}
              value={stats[metric.key as keyof typeof stats]}
              label={metric.label}
              isMoney={metric.isMoney}
              isPercent={metric.isPercent}
            />
          ))}
        </View>
        <View className="px-2 bg-green-mannwork">
          <MetricCard 
            value={stats[mainMetrics[mainMetrics.length - 1].key as keyof typeof stats]}
            label={mainMetrics[mainMetrics.length - 1].label}
            isMoney={mainMetrics[mainMetrics.length - 1].isMoney}
            isPercent={mainMetrics[mainMetrics.length - 1].isPercent}
            fullWidth={true}
            highlight={true}
          />
        </View>
      </View>

      {/* Sección de Ingresos */}
      <View className="mb-6">
        <Text className="text-xl font-bold text-green-mannwork mb-3 px-4">Ingresos</Text>
        <View className="flex-row bg-green-mannwork py-6 px-2 flex-wrap justify-between">
          {incomeMetrics.map((metric) => (
            <MetricCard 
              key={metric.key}
              value={stats[metric.key as keyof typeof stats]}
              label={metric.label}
              isMoney={metric.isMoney}
              isPercent={metric.isPercent}
            />
          ))}
        </View>
      </View>

      {/* Sección de Tasas */}
      <View className="mb-6">
        <Text className="text-xl font-bold text-green-mannwork mb-3 px-4">Tasas de Rendimiento</Text>
        <View className="flex-row bg-green-mannwork py-6 px-2 flex-wrap justify-between">
          {rateMetrics.map((metric) => (
            <MetricCard 
              key={metric.key}
              value={stats[metric.key as keyof typeof stats]}
              label={metric.label}
              isMoney={metric.isMoney}
              isPercent={metric.isPercent}
            />
          ))}
        </View>
      </View>



      {/* Chips de insights */}
      <View className="flex-col items-center justify-center px-4 mb-6">
        {stats.insights.map((msg, i) => (
          <LinearGradient
            key={i}
            colors={["#e3f5e9", "#b2dfdb"]}
            style={{
              borderRadius: 16,
              marginRight: 8,
              marginBottom: 8,
              paddingHorizontal: 16,
              paddingVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
              width: 360,
              justifyContent: 'center'
            }}
          >
            <MaterialIcons name="insights" size={16} color="#2D7A3E" style={{ marginRight: 6 }} />
            <Text style={{ color: "#2D7A3E", fontWeight: "bold", fontSize: 12, textAlign: 'center' }}>
              {msg}
            </Text>
          </LinearGradient>
        ))}
      </View>

      {/* Card de gráfico de ingresos */}
      <LinearGradient
        colors={["#2D7A3E", "#E3F5E9"]}
        style={{ borderRadius: 20, padding: 20 }}
        className="rounded-4xl mx-2 mb-4 p-5 shadow-lg"
        start={{ x: 0, y: 0 }}
        end={{ x: 2, y: 1 }}
      >
        <View className="flex-row items-center mb-2">
          <MaterialCommunityIcons name="chart-bar" size={28} color="#fff" />
          <Text className="text-lg font-bold text-white ml-2">Ingresos mensuales</Text>
        </View>
        <View style={{ height: 120, paddingVertical: 8 }}>
          <LineChart
            style={{ flex: 1 }}
            data={data}
            svg={{ stroke: '#fff', strokeWidth: 3 }}
            contentInset={{ top: 10, bottom: 10 }}
          >
            <Grid direction={Grid.Direction.HORIZONTAL} svg={{ stroke: '#fff', strokeOpacity: 0.2 }} />
            <Decorator x={(index) => index * 20} y={(value) => 100 - value * 10} data={data} />
          </LineChart>
          <XAxis
            style={{ marginHorizontal: -10, height: 20 }}
            data={data}
            formatLabel={(value, index) => months[index].slice(0, 3)}
            contentInset={{ left: 10, right: 10 }}
            svg={{ fontSize: 10, fill: '#fff' }}
          />
        </View>
      </LinearGradient>

      {/* Card de alcance */}
      <LinearGradient
        colors={["#2D7A3E", "#E3F5E9"]}
        className="rounded-2xl mx-2 mb-4 p-5 shadow-lg"
        style={{ borderRadius: 20,  padding: 20 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 2, y: 1 }}
      >
        <View className="flex-row items-center mb-2">
          <MaterialIcons name="visibility" size={28} color="#fff" />
          <Text className="text-lg font-bold text-white ml-2">Alcance</Text>
        </View>
        <View className="flex-row justify-between">
        <View className="items-center flex-1">
  <MaterialIcons name="check-circle" size={24} color="#fff" />
  <Text className="text-2xl font-bold text-white">{stats.successRate}%</Text>
  <Text className="text-white/80 text-xs">Éxito</Text>
</View>
          <View className="items-center flex-1">
            <MaterialIcons name="mail" size={24} color="#fff" />
            <Text className="text-2xl font-bold text-white">{stats.requestsReceived}</Text>
            <Text className="text-white/80 text-xs">Solicitudes</Text>
          </View>
          <View className="items-center flex-1">
            <MaterialIcons name="place" size={24} color="#fff" />
            <Text className="text-2xl font-bold text-white">{stats.topZones.length}</Text>
            <Text className="text-white/80 text-xs">Zonas</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Card premium */}
      {stats.isPremium && (
        <LinearGradient
          colors={["#2D7A3E", "#E3F5E9"]}
          style={{ borderRadius: 20,  padding: 20 }}
          className="rounded-2xl mx-2 mb-4 p-5 shadow-lg"
          start={{ x: 0, y: 0 }}
          end={{ x: 2, y: 1 }}
        >
          <View className="flex-row items-center mb-2">
            <MaterialIcons name="verified" size={28} color="#fff" />
            <Text className="text-lg font-bold text-white ml-2">Premium</Text>
          </View>
          <View className="flex-row items-center mb-2">
            <MaterialIcons name="savings" size={24} color="#fff" />
            <Text className="text-white ml-2">
              Ahorro: ${stats.commissionSavings}
            </Text>
          </View>
          <View className="flex-row justify-center flex-wrap">
            {stats.premiumBenefits?.map((b, i) => (
              <View key={i} className="bg-white/20 rounded-full px-3 py-1 mr-2 mb-2">
                <Text className="text-white text-xs">{b}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      )}
    </ScrollView>
  );
};

export default ProfessionalStats;