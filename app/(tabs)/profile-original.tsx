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
import { User, Settings, Clock, Droplets, TrendingUp, Calendar, Camera, ChartBar as BarChart3, Target, ChevronRight, Activity, LogOut, Flame, Trophy, Weight, Ruler } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme, getColors } from '@/hooks/useColorScheme';
import { useUserRole } from '@/contexts/UserContext';
import { useUserStats } from '@/contexts/UserStatsContext';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const metricsData = [
  {
    id: 'weight',
    title: 'Weight',
    value: 69.5,
    unit: 'kg',
    change: -1.2,
    changeLabel: 'vs last week',
    icon: Weight,
    color: '#3B82F6',
    gradient: ['#3B82F6', '#1D4ED8'],
    gradientDark: ['#60A5FA', '#3B82F6'],
    data: [68.2, 69.1, 68.8, 69.5, 69.2, 69.5],
    goal: 68.0,
    chartLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  },
  {
    id: 'chest',
    title: 'Chest',
    value: 36.5,
    unit: 'in',
    change: +0.8,
    changeLabel: 'vs last month',
    icon: Ruler,
    color: '#10B981',
    gradient: ['#10B981', '#059669'],
    gradientDark: ['#34D399', '#10B981'],
    data: [35.2, 35.8, 36.0, 36.2, 36.3, 36.5],
    goal: 37.0,
    chartLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  },
  {
    id: 'bodyfat',
    title: 'Body Fat',
    value: 15.2,
    unit: '%',
    change: -0.5,
    changeLabel: 'vs last month',
    icon: TrendingUp,
    color: '#F59E0B',
    gradient: ['#F59E0B', '#D97706'],
    gradientDark: ['#FBBF24', '#F59E0B'],
    data: [16.1, 15.8, 15.6, 15.4, 15.3, 15.2],
    goal: 14.0,
    chartLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  },
  {
    id: 'shoulders',
    title: 'Shoulders',
    value: 42.2,
    unit: 'in',
    change: +0.3,
    changeLabel: 'vs last month',
    icon: Ruler,
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#7C3AED'],
    gradientDark: ['#A78BFA', '#8B5CF6'],
    data: [41.5, 41.7, 41.9, 42.0, 42.1, 42.2],
    goal: 43.0,
    chartLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  },
  {
    id: 'waist',
    title: 'Waist',
    value: 32.1,
    unit: 'in',
    change: -0.4,
    changeLabel: 'vs last month',
    icon: Ruler,
    color: '#EF4444',
    gradient: ['#EF4444', '#DC2626'],
    gradientDark: ['#F87171', '#EF4444'],
    data: [32.8, 32.6, 32.4, 32.3, 32.2, 32.1],
    goal: 31.0,
    chartLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  },
];

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

  const renderMiniChart = (data: number[], color: string) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;
    const padding = range * 0.1;

    return (
      <View style={styles.miniChart}>
        {data.map((value, index) => {
          const height = ((value - minValue) / range) * 20 + 4;
          return (
            <View
              key={index}
              style={[
                styles.chartBar,
                {
                  height,
                  backgroundColor: color,
                  opacity: index === data.length - 1 ? 1 : 0.6,
                }
              ]}
            />
          );
        })}
      </View>
    );
  };

  const renderLineChart = (data: number[], color: string, labels: string[]) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;
    const chartWidth = width - 120;
    const chartHeight = 80;

    return (
      <View style={styles.lineChartContainer}>
        <View style={[styles.lineChart, { width: chartWidth, height: chartHeight }]}>
          {/* Chart lines */}
          {data.map((value, index) => {
            if (index === data.length - 1) return null;
            
            const x1 = (index / (data.length - 1)) * chartWidth;
            const y1 = chartHeight - ((value - minValue) / range) * chartHeight;
            const x2 = ((index + 1) / (data.length - 1)) * chartWidth;
            const y2 = chartHeight - ((data[index + 1] - minValue) / range) * chartHeight;
            
            const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
            
            return (
              <View
                key={index}
                style={[
                  styles.chartLine,
                  {
                    position: 'absolute',
                    left: x1,
                    top: y1,
                    width: lineLength,
                    transform: [{ rotate: `${angle}deg` }],
                    backgroundColor: color,
                  }
                ]}
              />
            );
          })}
          
          {/* Data points */}
          {data.map((value, index) => {
            const x = (index / (data.length - 1)) * chartWidth;
            const y = chartHeight - ((value - minValue) / range) * chartHeight;
            
            return (
              <View
                key={index}
                style={[
                  styles.dataPoint,
                  {
                    position: 'absolute',
                    left: x - 3,
                    top: y - 3,
                    backgroundColor: color,
                    borderColor: 'rgba(255, 255, 255, 0.9)',
                  }
                ]}
              />
            );
          })}
        </View>
        
        {/* Chart labels */}
        <View style={styles.chartLabels}>
          {labels.map((label, index) => (
            <Text key={index} style={styles.chartLabel}>
              {label}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const renderMetricCard = (metric: typeof metricsData[0]) => {
    const IconComponent = metric.icon;
    const isPositiveChange = metric.change > 0;
    const changeColor = metric.id === 'bodyfat' || metric.id === 'waist'
      ? (metric.change < 0 ? colors.success : colors.error) // For body fat and waist, decrease is good
      : (metric.change > 0 ? colors.success : colors.error); // For others, increase is good

    const progressToGoal = metric.id === 'bodyfat' || metric.id === 'waist'
      ? Math.max(0, Math.min(100, ((metric.data[0] - metric.value) / (metric.data[0] - metric.goal)) * 100)) // For body fat/waist, progress towards lower value
      : Math.max(0, Math.min(100, (metric.value / metric.goal) * 100)); // For others, progress towards higher value

    return (
      <View key={metric.id} style={styles.metricCard}>
        <LinearGradient
          colors={colorScheme === 'dark' ? metric.gradientDark : metric.gradient}
          style={styles.metricGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.metricHeader}>
            <View style={styles.metricIconContainer}>
              <IconComponent size={20} color="rgba(255, 255, 255, 0.9)" />
            </View>
            <TouchableOpacity 
              style={styles.metricMoreButton}
              onPress={() => router.push(`/metrics/${metric.id}`)}
            >
              <ChevronRight size={16} color="rgba(255, 255, 255, 0.7)" />
            </TouchableOpacity>
          </View>

          <View style={styles.metricContent}>
            <Text style={styles.metricTitle}>{metric.title}</Text>
            
            <View style={styles.metricValueContainer}>
              <Text style={styles.metricValue}>
                {metric.value}
              </Text>
              <Text style={styles.metricUnit}>{metric.unit}</Text>
            </View>

            <View style={styles.metricChange}>
              <Text style={[styles.metricChangeText, { color: 'rgba(255, 255, 255, 0.9)' }]}>
                {isPositiveChange ? '+' : ''}{metric.change} {metric.changeLabel}
              </Text>
            </View>

            {/* Line Chart */}
            <View style={styles.chartContainer}>
              {renderLineChart(metric.data, 'rgba(255, 255, 255, 0.8)', metric.chartLabels)}
            </View>

            {/* Goal Progress */}
            <View style={styles.goalContainer}>
              <Text style={styles.goalLabel}>Goal: {metric.goal} {metric.unit}</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${progressToGoal}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>{Math.round(progressToGoal)}%</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

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

        {/* Swipable Metrics Section */}
        <View style={styles.metricsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Body Metrics</Text>
            <TouchableOpacity onPress={() => router.push('/metrics')}>
              <Text style={styles.viewMoreText}>View all</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.metricsScrollView}
            contentContainerStyle={styles.metricsScrollContent}
            snapToInterval={width - 60}
            decelerationRate="fast"
            pagingEnabled={false}
          >
            {metricsData.map(renderMetricCard)}
          </ScrollView>
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
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
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
  metricsScrollView: {
    paddingLeft: 20,
  },
  metricsScrollContent: {
    paddingRight: 20,
  },
  metricCard: {
    width: width - 80,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  metricGradient: {
    padding: 20,
    minHeight: 280,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricIconContainer: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricMoreButton: {
    width: 28,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricContent: {
    flex: 1,
  },
  metricTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  metricValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#FFFFFF',
  },
  metricUnit: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
  },
  metricChange: {
    marginBottom: 16,
  },
  metricChangeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  chartContainer: {
    marginBottom: 16,
  },
  miniChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 24,
    gap: 3,
  },
  chartBar: {
    width: 4,
    borderRadius: 2,
    minHeight: 4,
  },
  lineChartContainer: {
    marginVertical: 8,
  },
  lineChart: {
    position: 'relative',
    marginBottom: 8,
  },
  chartLine: {
    height: 2,
    borderRadius: 1,
  },
  dataPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 2,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  chartLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  goalContainer: {
    marginTop: 'auto',
  },
  goalLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 2,
  },
  progressText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
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