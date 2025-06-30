import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Weight, Ruler, Droplets, Activity, TrendingUp } from 'lucide-react-native';
import { useColorScheme, getColors } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

interface MetricInput {
  id: string;
  name: string;
  value: string;
  unit: string;
  icon: any;
  color: string;
  placeholder: string;
}

export default function LogAllMetricsScreen() {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);
  const styles = createStyles(colors);

  const [metrics, setMetrics] = useState<MetricInput[]>([
    {
      id: 'weight',
      name: 'Weight',
      value: '',
      unit: 'kg',
      icon: Weight,
      color: '#3B82F6',
      placeholder: '78',
    },
    {
      id: 'chest',
      name: 'Chest',
      value: '',
      unit: 'in',
      icon: Ruler,
      color: '#10B981',
      placeholder: '36',
    },
    {
      id: 'shoulders',
      name: 'Shoulders',
      value: '',
      unit: 'in',
      icon: Ruler,
      color: '#F59E0B',
      placeholder: '42',
    },
    {
      id: 'waist',
      name: 'Waist',
      value: '',
      unit: 'in',
      icon: Ruler,
      color: '#EF4444',
      placeholder: '32',
    },
    {
      id: 'thigh',
      name: 'Thigh',
      value: '',
      unit: 'in',
      icon: Ruler,
      color: '#8B5CF6',
      placeholder: '24',
    },
    {
      id: 'hip',
      name: 'Hip',
      value: '',
      unit: 'in',
      icon: Ruler,
      color: '#EC4899',
      placeholder: '38',
    },
    {
      id: 'bodyfat',
      name: 'Body Fat',
      value: '',
      unit: '%',
      icon: TrendingUp,
      color: '#06B6D4',
      placeholder: '15',
    },
    {
      id: 'bicep',
      name: 'Bicep',
      value: '',
      unit: 'in',
      icon: Ruler,
      color: '#F97316',
      placeholder: '14',
    },
    {
      id: 'water',
      name: 'Water intake',
      value: '',
      unit: 'L',
      icon: Droplets,
      color: '#0EA5E9',
      placeholder: '2.5',
    },
    {
      id: 'steps',
      name: 'Steps',
      value: '',
      unit: 'steps',
      icon: Activity,
      color: '#84CC16',
      placeholder: '10000',
    },
  ]);

  const updateMetricValue = (id: string, value: string) => {
    setMetrics(prev => prev.map(metric => 
      metric.id === id ? { ...metric, value } : metric
    ));
  };

  const handleSaveAll = () => {
    const filledMetrics = metrics.filter(metric => metric.value.trim() !== '');
    
    if (filledMetrics.length === 0) {
      return;
    }

    // Here you would typically save all the data
    console.log('Saving all metrics:', filledMetrics.map(metric => ({
      id: metric.id,
      name: metric.name,
      value: parseFloat(metric.value),
      unit: metric.unit,
      date: new Date().toISOString(),
    })));

    // Navigate back
    router.back();
  };

  const hasAnyValue = metrics.some(metric => metric.value.trim() !== '');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Log All Metrics</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Enter values for the metrics you want to track today
        </Text>

        {/* Metrics List */}
        <View style={styles.metricsList}>
          {metrics.map((metric) => {
            const IconComponent = metric.icon;
            return (
              <View key={metric.id} style={styles.metricItem}>
                <View style={styles.metricLeft}>
                  <View style={[styles.metricIcon, { backgroundColor: `${metric.color}15` }]}>
                    <IconComponent size={20} color={metric.color} />
                  </View>
                  <Text style={styles.metricName}>{metric.name}</Text>
                </View>
                
                <View style={styles.metricRight}>
                  <TextInput
                    style={styles.metricInput}
                    value={metric.value}
                    onChangeText={(value) => updateMetricValue(metric.id, value)}
                    placeholder={metric.placeholder}
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="numeric"
                  />
                  <Text style={styles.metricUnit}>{metric.unit}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.saveButton,
            !hasAnyValue && styles.disabledButton
          ]} 
          onPress={handleSaveAll}
          disabled={!hasAnyValue}
        >
          <Text style={[
            styles.saveButtonText,
            !hasAnyValue && styles.disabledButtonText
          ]}>
            Save All Metrics
          </Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
    lineHeight: 20,
  },
  metricsList: {
    paddingHorizontal: 20,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
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
  metricName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  metricRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricInput: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text,
    textAlign: 'right',
    minWidth: 60,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricUnit: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    minWidth: 30,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: colors.borderLight,
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  disabledButtonText: {
    color: colors.textTertiary,
  },
});