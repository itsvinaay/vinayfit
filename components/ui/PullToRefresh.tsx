import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  Animated,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Dumbbell } from 'lucide-react-native';
import { useColorScheme, getColors } from '@/hooks/useColorScheme';

const { height: screenHeight } = Dimensions.get('window');
const REFRESH_HEIGHT = 80;
const TRIGGER_HEIGHT = 60;

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  refreshing?: boolean;
}

export default function PullToRefresh({ 
  children, 
  onRefresh, 
  refreshing = false 
}: PullToRefreshProps) {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);
  const styles = createStyles(colors);

  const [isRefreshing, setIsRefreshing] = useState(refreshing);
  const translateY = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: false }
  );

  const handleStateChange = async (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.END) {
      const { translationY } = event.nativeEvent;
      
      if (translationY > TRIGGER_HEIGHT && !isRefreshing) {
        // Trigger refresh
        setIsRefreshing(true);
        
        // Animate to refresh position
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: REFRESH_HEIGHT,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.loop(
            Animated.timing(rotateValue, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: false,
            })
          ),
        ]).start();

        try {
          await onRefresh();
        } finally {
          // Reset after refresh
          setIsRefreshing(false);
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }),
            Animated.timing(scaleValue, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }),
            Animated.timing(rotateValue, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }),
          ]).start();
        }
      } else {
        // Reset to original position
        Animated.parallel([
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: false,
          }),
          Animated.timing(scaleValue, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start();
      }
    }
  };

  const pullProgress = translateY.interpolate({
    inputRange: [0, TRIGGER_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const iconRotation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const iconScale = scaleValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  const refreshOpacity = translateY.interpolate({
    inputRange: [0, TRIGGER_HEIGHT / 2, TRIGGER_HEIGHT],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Refresh Indicator */}
      <Animated.View 
        style={[
          styles.refreshContainer,
          {
            opacity: refreshOpacity,
            transform: [
              { translateY: Animated.subtract(translateY, REFRESH_HEIGHT) }
            ],
          }
        ]}
      >
        <Animated.View
          style={[
            styles.refreshIcon,
            {
              transform: [
                { rotate: isRefreshing ? iconRotation : '0deg' },
                { scale: iconScale },
              ],
            }
          ]}
        >
          <Dumbbell 
            size={24} 
            color={colors.primary} 
            strokeWidth={2.5}
          />
        </Animated.View>
      </Animated.View>

      {/* Content */}
      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleStateChange}
        enabled={!isRefreshing}
      >
        <Animated.View style={styles.content}>
          <Animated.View
            style={{
              transform: [{ translateY }],
            }}
          >
            <ScrollView
              ref={scrollViewRef}
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              bounces={false}
            >
              {children}
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  refreshContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: REFRESH_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  refreshIcon: {
    width: 48,
    height: 48,
    backgroundColor: colors.surface,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});