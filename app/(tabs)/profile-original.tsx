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
import { User, Settings, Clock, Droplets, TrendingUp, Calendar, Camera, ChartBar as BarChart3, Target, ChevronRight, Activity, LogOut, Flame, Trophy } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme, getColors } from '@/hooks/useColorScheme';
import { useUserRole } from '@/contexts/UserContext';
import { useUserStats } from '@/contexts/UserStatsContext';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ProfileView() {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);
  const styles = createStyles(colors);
  const { userRole, userName, setUserRole } = useUserRole();
  const { 
    streakDays, 
    trainingMinutes, 
    getWeeklyTrainingMinutes, 
    getMonthlyTrainingMinutes,
    getLongestStreak,
    addWorkoutSession 
  } = useUserStats();

  const [userInitials] = useState('VD');
  const [currentWeight] = useState(69.5);
  const [goalWeight] = useState(68);

  const weeklyMinutes = getWeeklyTrainingMinutes();
  const monthlyMinutes = getMonthlyTrainingMinutes();
  const longestStreak = getLongestStreak();

  const handleLogout = () => {
    setUserRole(null);
    router.replace('/(auth)/login');
  };

  // Demo function to add a workout session
  const handleAddDemoWorkout = async () => {
    await addWorkoutSession({
      date: new Date().toISOString(),
      duration: 45,
      type: 'Strength Training',
      completed: true,
    });
  };

  const menuItems = [
    {
      id: 'activity',
      title: 'Activity history',
      icon: Activity,
      color: colors.primary,
      onPress: () => router.push('/activity-history'),
    },
    {
      id: 'exercises',
      title: 'Your exercises',
      icon: Target,
      color: colors.success,
      onPress: () => {},
    },
    {
      id: 'progress',
      title: 'Progress photo',
      icon: Camera,
      color: colors.warning,
      onPress: () => router.push('/progress-photo'),
    },
    {
      id: 'steps',
      title: 'Steps',
      icon: TrendingUp,
      color: colors.error,
      onPress: () => {},
    },
    {
      id: 'demo-workout',
      title: 'Add Demo Workout',
      icon: Trophy,
      color: colors.info,
      onPress: handleAddDemoWorkout,
    },
    {
      id: 'logout',
      title: 'Logout',
      icon: LogOut,
      color: colors.error,
      onPress: handleLogout,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>You</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={colorScheme === 'dark' ? ['#1E40AF', '#3730A3'] : ['#667EEA', '#764BA2']}
            style={styles.profileAvatar}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.profileInitials}>{userInitials}</Text>
          </LinearGradient>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Hi, {userName}!</Text>
            <Text style={styles.profileRole}>Role: {userRole}</Text>
            <TouchableOpacity style={styles.goalButton}>
              <Text style={styles.goalButtonText}>
                Set your fitness goal <Text style={styles.goalButtonLink}>(add)</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Enhanced Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.primary}15` }]}>
              <Clock size={20} color={colors.primary} />
            </View>
            <Text style={styles.statNumber}>{trainingMinutes}</Text>
            <Text style={styles.statLabel}>Total Training</Text>
            <Text style={styles.statSubLabel}>minutes</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.warning}15` }]}>
              <Flame size={20} color={colors.warning} />
            </View>
            <Text style={styles.statNumber}>{streakDays}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
            <Text style={styles.statSubLabel}>days</Text>
          </View>
        </View>

        {/* Weekly/Monthly Stats */}
        <View style={styles.timeStatsContainer}>
          <View style={styles.timeStatCard}>
            <Text style={styles.timeStatNumber}>{weeklyMinutes}</Text>
            <Text style={styles.timeStatLabel}>This Week</Text>
            <Text style={styles.timeStatUnit}>minutes</Text>
          </View>
          
          <View style={styles.timeStatCard}>
            <Text style={styles.timeStatNumber}>{monthlyMinutes}</Text>
            <Text style={styles.timeStatLabel}>This Month</Text>
            <Text style={styles.timeStatUnit}>minutes</Text>
          </View>
          
          <View style={styles.timeStatCard}>
            <Text style={styles.timeStatNumber}>{longestStreak}</Text>
            <Text style={styles.timeStatLabel}>Best Streak</Text>
            <Text style={styles.timeStatUnit}>days</Text>
          </View>
        </View>

        {/* Streak Achievement Card */}
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

        {/* Metrics Section - Simplified without graph */}
        <View style={styles.metricsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Metrics</Text>
            <TouchableOpacity onPress={() => router.push('/metrics')}>
              <Text style={styles.viewMoreText}>View more</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.metricsCard}>
            <Text style={styles.metricsTitle}>WEIGHT (KG)</Text>
            
            <View style={styles.weightInfo}>
              <Text style={styles.currentWeight}>{currentWeight}</Text>
              <Text style={styles.weightProgress}>
                {currentWeight > goalWeight ? `${(currentWeight - goalWeight).toFixed(1)} kg to goal` : 'Goal reached!'}
              </Text>
            </View>
            
            {/* Simple weight summary instead of graph */}
            <View style={styles.weightSummary}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Current</Text>
                <Text style={styles.summaryValue}>{currentWeight} kg</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Goal</Text>
                <Text style={styles.summaryValue}>{goalWeight} kg</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Progress</Text>
                <Text style={[styles.summaryValue, { color: colors.primary }]}>
                  {currentWeight > goalWeight ? '-' : '+'}{Math.abs(currentWeight - goalWeight).toFixed(1)} kg
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.viewDetailsButton}
              onPress={() => router.push('/metrics/weight')}
            >
              <Text style={styles.viewDetailsText}>View detailed chart</Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
                <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                  <IconComponent size={20} color={item.color} />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
                <ChevronRight size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            );
          })}
        </View>

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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: colors.text,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInitials: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.text,
    marginBottom: 4,
  },
  profileRole: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primary,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  goalButton: {
    paddingVertical: 2,
  },
  goalButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  goalButtonLink: {
    color: colors.primary,
    textDecorationLine: 'underline',
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
  timeStatsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  timeStatCard: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeStatNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.text,
    marginBottom: 2,
  },
  timeStatLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  timeStatUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 9,
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
  metricsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.text,
  },
  viewMoreText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primary,
  },
  metricsCard: {
    backgroundColor: colors.surface,
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
  metricsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  weightInfo: {
    marginBottom: 20,
  },
  currentWeight: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: colors.text,
  },
  weightProgress: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  weightSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  viewDetailsText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.primary,
    marginRight: 8,
  },
  menuSection: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.text,
  },
});