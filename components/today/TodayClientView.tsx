import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Plus, 
  Footprints, 
  Target, 
  UtensilsCrossed,
  TrendingUp,
  Calendar,
  X,
  Flame,
  Clock
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme, getColors } from '../../hooks/useColorScheme';
import { useUserStats } from '@/contexts/UserStatsContext';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function TodayClientView() {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);
  const styles = createStyles(colors);
  const { 
    streakDays, 
    trainingMinutes, 
    getWeeklyTrainingMinutes,
    addWorkoutSession 
  } = useUserStats();

  const [showMissedWorkout, setShowMissedWorkout] = useState(true);
  const [steps, setSteps] = useState(2847);
  const [stepGoal] = useState(10000);
  const [userName] = useState('Vinay');

  const weeklyMinutes = getWeeklyTrainingMinutes();

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    }).toUpperCase();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const stepProgress = (steps / stepGoal) * 100;

  const handleFabPress = () => {
    router.push('/activities');
  };

  // Demo function to complete a workout
  const handleCompleteWorkout = async () => {
    await addWorkoutSession({
      date: new Date().toISOString(),
      duration: 30,
      type: 'Quick Workout',
      completed: true,
    });
    setShowMissedWorkout(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.dateText}>{getCurrentDate()}</Text>
          <Text style={styles.greetingText}>
            {getGreeting()}, {userName}! 👋
          </Text>
        </View>

        {/* Rest Day Card */}
        <LinearGradient
          colors={colorScheme === 'dark' ? ['#1E40AF', '#3730A3'] : ['#667EEA', '#764BA2']}
          style={styles.restDayCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.restDayContent}>
            <Text style={styles.restDayLabel}>REST DAY</Text>
            <Text style={styles.restDayMessage}>
              Hoo-ray it's your rest-day 🌴
            </Text>
          </View>
        </LinearGradient>

        {/* Streak & Training Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.warning}15` }]}>
              <Flame size={20} color={colors.warning} />
            </View>
            <Text style={styles.statNumber}>{streakDays}</Text>
            <Text style={styles.statLabel}>Streak Days</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.primary}15` }]}>
              <Clock size={20} color={colors.primary} />
            </View>
            <Text style={styles.statNumber}>{weeklyMinutes}</Text>
            <Text style={styles.statLabel}>This Week</Text>
            <Text style={styles.statSubLabel}>minutes</Text>
          </View>
        </View>

        {/* Streak Achievement */}
        {streakDays > 0 && (
          <View style={styles.achievementCard}>
            <LinearGradient
              colors={colorScheme === 'dark' ? ['#F59E0B', '#EF4444'] : ['#FEE140', '#FA709A']}
              style={styles.achievementGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.achievementContent}>
                <View style={styles.achievementIcon}>
                  <Flame size={24} color="#FFFFFF" />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>
                    {streakDays === 1 ? 'Great Start!' : `${streakDays} Day Streak!`}
                  </Text>
                  <Text style={styles.achievementMessage}>
                    {streakDays === 1 
                      ? 'You\'ve started your fitness journey!' 
                      : `Keep it up! You're on fire! 🔥`
                    }
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Missed Workout Alert */}
        {showMissedWorkout && (
          <View style={styles.alertCard}>
            <View style={styles.alertContent}>
              <Text style={styles.alertIcon}>⚠️</Text>
              <Text style={styles.alertText}>
                You missed <Text style={styles.alertHighlight}>1 workout</Text> from Saturday
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => setShowMissedWorkout(false)}
              style={styles.alertClose}
            >
              <X size={18} color={colors.error} />
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Workout Button */}
        <TouchableOpacity style={styles.quickWorkoutButton} onPress={handleCompleteWorkout}>
          <LinearGradient
            colors={colorScheme === 'dark' ? ['#10B981', '#059669'] : ['#34D399', '#10B981']}
            style={styles.quickWorkoutGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.quickWorkoutText}>Complete Quick Workout</Text>
            <Text style={styles.quickWorkoutSubtext}>Boost your streak!</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Steps Tracker */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Steps tracker</Text>
            <Footprints size={24} color={colors.primary} />
          </View>
          
          <View style={styles.stepsContent}>
            <View style={styles.stepsInfo}>
              <Text style={styles.stepsNumber}>
                {steps.toLocaleString()}
              </Text>
              <Text style={styles.stepsGoal}>/ {stepGoal.toLocaleString()} steps</Text>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${Math.min(stepProgress, 100)}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>{Math.round(stepProgress)}%</Text>
            </View>
          </View>
        </View>

        {/* Macros */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Macros</Text>
            <Target size={24} color={colors.success} />
          </View>
          
          <Text style={styles.cardSubtitle}>
            Start by setting your daily goal
          </Text>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Set daily goal</Text>
          </TouchableOpacity>
        </View>

        {/* Food Journal */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Food Journal</Text>
            <UtensilsCrossed size={24} color={colors.warning} />
          </View>
          
          <Text style={styles.cardSubtitle}>
            What did you eat today?
          </Text>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Add meal</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Today's Progress</Text>
            <TrendingUp size={24} color={colors.error} />
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Water (L)</Text>
            </View>
          </View>
        </View>

        {/* Spacing for FAB */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleFabPress}>
        <Plus size={28} color="#FFFFFF" strokeWidth={2} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  dateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textTertiary,
    letterSpacing: 0.5,
  },
  greetingText: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: colors.text,
    marginTop: 4,
  },
  restDayCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 24,
  },
  restDayContent: {
    alignItems: 'flex-start',
  },
  restDayLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
    marginBottom: 8,
  },
  restDayMessage: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statSubLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  achievementCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  achievementGradient: {
    padding: 16,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  achievementMessage: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
  },
  quickWorkoutButton: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  quickWorkoutGradient: {
    padding: 16,
    alignItems: 'center',
  },
  quickWorkoutText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  quickWorkoutSubtext: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  alertCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  alertContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  alertText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  alertHighlight: {
    fontFamily: 'Inter-SemiBold',
    color: colors.error,
  },
  alertClose: {
    padding: 4,
  },
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.text,
  },
  cardSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  stepsContent: {
    alignItems: 'flex-start',
  },
  stepsInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  stepsNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: colors.text,
  },
  stepsGoal: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  progressContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: colors.primary,
    minWidth: 35,
  },
  actionButton: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
});