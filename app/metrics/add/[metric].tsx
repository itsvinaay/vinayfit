import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';
import { useColorScheme, getColors } from '@/hooks/useColorScheme';
import { router, useLocalSearchParams } from 'expo-router';

const metricConfig = {
  weight: { name: 'Weight', unit: 'kg', placeholder: '78' },
  chest: { name: 'Chest', unit: 'in', placeholder: '36' },
  shoulders: { name: 'Shoulders', unit: 'in', placeholder: '42' },
  waist: { name: 'Waist', unit: 'in', placeholder: '32' },
  thigh: { name: 'Thigh', unit: 'in', placeholder: '24' },
  hip: { name: 'Hip', unit: 'in', placeholder: '38' },
  bodyfat: { name: 'Body Fat', unit: '%', placeholder: '15' },
  bicep: { name: 'Bicep', unit: 'in', placeholder: '14' },
  water: { name: 'Water intake', unit: 'L', placeholder: '2.5' },
  steps: { name: 'Steps', unit: 'steps', placeholder: '10000' },
};

export default function AddMetricScreen() {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);
  const styles = createStyles(colors);
  const { metric } = useLocalSearchParams();
  
  const metricKey = typeof metric === 'string' ? metric : 'weight';
  const config = metricConfig[metricKey as keyof typeof metricConfig] || metricConfig.weight;

  const [value, setValue] = useState('');
  const [unit, setUnit] = useState(config.unit);
  const [date, setDate] = useState('Today, 10:31 AM');

  const getCurrentDateTime = () => {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    return `Today, ${time}`;
  };

  React.useEffect(() => {
    setDate(getCurrentDateTime());
  }, []);

  const handleAdd = () => {
    if (!value.trim()) {
      return;
    }

    // Here you would typically save the data
    console.log('Adding metric:', {
      metric: metricKey,
      value: parseFloat(value),
      unit,
      date: new Date().toISOString(),
    });

    // Navigate back
    router.back();
  };

  const isAddEnabled = value.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Add data</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Metric Input */}
        <View style={styles.metricSection}>
          <Text style={styles.metricLabel}>{config.name}</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.valueInput}
              value={value}
              onChangeText={setValue}
              placeholder={config.placeholder}
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
              textAlign="center"
            />
            <TouchableOpacity style={styles.unitSelector}>
              <Text style={styles.unitText}>{unit}</Text>
              <ChevronDown size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Date & Time */}
        <View style={styles.dateSection}>
          <Text style={styles.dateLabel}>Date & Time</Text>
          <TouchableOpacity style={styles.dateInput}>
            <Text style={styles.dateText}>{date}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.addButton,
            !isAddEnabled && styles.disabledButton
          ]} 
          onPress={handleAdd}
          disabled={!isAddEnabled}
        >
          <Text style={[
            styles.addButtonText,
            !isAddEnabled && styles.disabledButtonText
          ]}>
            Add
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
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  metricSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  metricLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: colors.text,
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  valueInput: {
    fontFamily: 'Inter-Bold',
    fontSize: 48,
    color: colors.text,
    textAlign: 'center',
    minWidth: 120,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    paddingVertical: 8,
  },
  unitSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  unitText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.text,
  },
  dateSection: {
    alignItems: 'center',
  },
  dateLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.text,
    marginBottom: 16,
  },
  dateInput: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  addButton: {
    backgroundColor: colors.text,
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
  addButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.background,
  },
  disabledButtonText: {
    color: colors.textTertiary,
  },
});