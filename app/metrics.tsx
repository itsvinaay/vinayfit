import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Plus,
  ChevronRight,
  Weight,
  Ruler,
  Droplets,
  Activity,
  TrendingUp,
  Calendar
} from 'lucide-react-native';
import { useColorScheme, getColors } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface MetricData {
  id: string;
  name: string;
  value: number;
  unit: string;
  lastUpdated: string;
  icon: any;
  color: string;
  hasData: boolean;
}

const metricsData: MetricData[] = [
  {
    id: 'weight',
    name: 'Weight',
    value: 78,
    unit: 'kg',
    lastUpdated: 'Jun 5',
    icon: Weight,
    color: '#3B82F6',
    hasData: true,
  },
  {
    id: 'chest',
    name: 'Chest',
    value: 36,
    unit: 'in',
    lastUpdated: 'Jun 3',
    icon: Ruler,
    color: '#10B981',
    hasData: true,
  },
  {
    id: 'shoulders',
    name: 'Shoulders',
    value: 0,
    unit: 'in',
    lastUpdated: '',
    icon: Ruler,
    color: '#F59E0B',
    hasData: false,
  },
  {
    id: 'waist',
    name: 'Waist',
    value: 0,
    unit: 'in',
    lastUpdated: '',
    icon: Ruler,
    color: '#EF4444',
    hasData: false,
  },
  {
    id: 'thigh',
    name: 'Thigh',
    value: 0,
    unit: 'in',
    lastUpdated: '',
    icon: Ruler,
    color: '#8B5CF6',
    hasData: false,
  },
  {
    id: 'hip',
    name: 'Hip',
    value: 0,
    unit: 'in',
    lastUpdated: '',
    icon: Ruler,
    color: '#EC4899',
    hasData: false,
  },
  {
    id: 'bodyfat',
    name: 'Body Fat',
    value: 0,
    unit: '%',
    lastUpdated: '',
    icon: TrendingUp,
    color: '#06B6D4',
    hasData: false,
  },
  {
    id: 'bicep',
    name: 'Bicep',
    value: 0,
    unit: 'in',
    lastUpdated: '',
    icon: Ruler,
    color: '#F97316',
    hasData: false,
  },
  {
    id: 'water',
    name: 'Water intake',
    value: 0,
    unit: 'L',
    lastUpdated: '',
    icon: Droplets,
    color: '#0EA5E9',
    hasData: false,
  },
  {
    id: 'steps',
    name: 'Steps',
    value: 0,
    unit: 'steps',
    lastUpdated: '',
    icon: Activity,
    color: '#84CC16',
    hasData: false,
  },
];

export default function MetricsScreen() {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);
  const styles = createStyles(colors);

  const handleMetricPress = (metric: MetricData) => {
    if (metric.id === 'weight') {
      router.push('/metrics/weight');
    } else {
      router.push(`/metrics/${metric.id}`);
    }
  };

  const handleAddMetric = (metricId: string) => {
    router.push(`/metrics/add/${metricId}`);
  };

  const handleLogAllMetrics = () => {
    router.push('/metrics/log-all');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Metrics</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Metrics Icon */}
      <View style={styles.iconContainer}>
        <View style={styles.metricsIcon}>
          <View style={styles.iconChart}>
            <View style={[styles.chartBar, { height: 20, backgroundColor: colors.primary }]} />
            <View style={[styles.chartBar, { height: 30, backgroundColor: colors.success }]} />
            <View style={[styles.chartBar, { height: 25, backgroundColor: colors.warning }]} />
            <View style={[styles.chartBar, { height: 35, backgroundColor: colors.error }]} />
          </View>
        </View>
        <Text style={styles.metricsTitle}>Metrics</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Metrics List */}
        <View style={styles.metricsList}>
          {metricsData.map((metric) => {
            const IconComponent = metric.icon;
            return (
              <TouchableOpacity
                key={metric.id}
                style={styles.metricItem}
                onPress={() => handleMetricPress(metric)}
              >
                <View style={styles.metricLeft}>
                  <View style={[styles.metricIcon, { backgroundColor: `${metric.color}15` }]}>
                    <IconComponent size={20} color={metric.color} />
                  </View>
                  <View style={styles.metricInfo}>
                    <Text style={styles.metricName}>{metric.name}</Text>
                    {metric.hasData ? (
                      <Text style={styles.metricLastUpdated}>
                        updated on {metric.lastUpdated}
                      </Text>
                    ) : null}
                  </View>
                </View>
                
                <View style={styles.metricRight}>
                  {metric.hasData ? (
                    <Text style={styles.metricValue}>
                      {metric.value} {metric.unit}
                    </Text>
                  ) : (
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => handleAddMetric(metric.id)}
                    >
                      <Plus size={16} color={colors.primary} />
                    </TouchableOpacity>
                  )}
                  <ChevronRight size={20} color={colors.textTertiary} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Log All Metrics Button */}
        <TouchableOpacity style={styles.logAllButton} onPress={handleLogAllMetrics}>
          <Text style={styles.logAllText}>Log all metrics</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.text,
  },
  iconContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  metricsIcon: {
    width: 80,
    height: 80,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },
  chartBar: {
    width: 6,
    borderRadius: 3,
  },
  metricsTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  metricsList: {
    paddingHorizontal: 20,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  metricLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  metricInfo: {
    flex: 1,
  },
  metricName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text,
  },
  metricLastUpdated: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  metricRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text,
  },
  addButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logAllButton: {
    marginHorizontal: 20,
    marginTop: 32,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  logAllText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text,
  },
});