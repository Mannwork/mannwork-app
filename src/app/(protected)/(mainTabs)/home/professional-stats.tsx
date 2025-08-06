import ProfessionalStats from "@/features/home/components/stats/professionalStats";
import { useProfessionalStats } from "@/features/home/hooks/useProfessionalStats";
import { useAuth } from "@clerk/clerk-expo";
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function ProfessionalStatsScreen() {
  const { userId } = useAuth();
  const { stats, loading, error } = useProfessionalStats(userId || '');
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D7A3E" />
        <Text style={styles.loadingText}>Cargando estadísticas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error al cargar las estadísticas</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se encontraron datos</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ProfessionalStats stats={stats} />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2D7A3E',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#E74C3C',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
  },
});