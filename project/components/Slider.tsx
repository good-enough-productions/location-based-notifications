import React, { useState } from 'react';
import { View, StyleSheet, Text, PanResponder, Animated } from 'react-native';

interface SliderProps {
  minimumValue: number;
  maximumValue: number;
  step: number;
  value: number;
  onValueChange: (value: number) => void;
}

const Slider = ({
  minimumValue,
  maximumValue,
  step,
  value,
  onValueChange,
}: SliderProps) => {
  const [width, setWidth] = useState(0);
  const position = new Animated.Value(
    ((value - minimumValue) / (maximumValue - minimumValue)) * width
  );

  // Update position when width or value changes
  React.useEffect(() => {
    if (width > 0) {
      const newPosition = ((value - minimumValue) / (maximumValue - minimumValue)) * width;
      position.setValue(newPosition);
    }
  }, [width, value, minimumValue, maximumValue, position]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      position.setOffset(position._value);
    },
    onPanResponderMove: (_, gestureState) => {
      let newPosition = gestureState.dx;
      
      // Clamp the position within the track bounds
      if (position._offset + newPosition < 0) {
        newPosition = -position._offset;
      } else if (position._offset + newPosition > width) {
        newPosition = width - position._offset;
      }
      
      position.setValue(newPosition);
    },
    onPanResponderRelease: () => {
      position.flattenOffset();
      
      // Calculate and set the value with the appropriate step
      const ratio = position._value / width;
      const range = maximumValue - minimumValue;
      let newValue = minimumValue + ratio * range;
      
      // Apply step
      newValue = Math.round(newValue / step) * step;
      
      // Clamp to min/max
      newValue = Math.max(minimumValue, Math.min(maximumValue, newValue));
      
      // Update position to match the stepped value
      const newPosition = ((newValue - minimumValue) / range) * width;
      Animated.timing(position, {
        toValue: newPosition,
        duration: 100,
        useNativeDriver: false,
      }).start();
      
      onValueChange(newValue);
    },
  });

  // Generate tick values
  const generateTicks = () => {
    const ticks = [];
    const numTicks = 5; // Number of ticks to display
    const interval = (maximumValue - minimumValue) / (numTicks - 1);
    
    for (let i = 0; i < numTicks; i++) {
      const tickValue = minimumValue + i * interval;
      ticks.push(Math.round(tickValue));
    }
    
    return ticks;
  };

  const ticks = generateTicks();

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const { width: layoutWidth } = event.nativeEvent.layout;
        setWidth(layoutWidth);
        
        // Set initial position
        const initialPosition = ((value - minimumValue) / (maximumValue - minimumValue)) * layoutWidth;
        position.setValue(initialPosition);
      }}
    >
      <View style={styles.trackContainer}>
        <View style={styles.track} />
        <Animated.View
          style={[
            styles.fill,
            {
              width: position,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX: position }],
              left: -12, // Half of thumb width to center it
            },
          ]}
          {...panResponder.panHandlers}
        />
      </View>
      
      <View style={styles.ticksContainer}>
        {ticks.map((tick, index) => (
          <Text key={index} style={styles.tickLabel}>
            {tick}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: '100%',
    paddingHorizontal: 8,
  },
  trackContainer: {
    height: 4,
    width: '100%',
    backgroundColor: '#e1e1e1',
    borderRadius: 2,
    marginVertical: 16,
  },
  track: {
    height: 4,
    width: '100%',
    borderRadius: 2,
    position: 'absolute',
  },
  fill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4A80F0',
    position: 'absolute',
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4A80F0',
    position: 'absolute',
    top: -10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ticksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  tickLabel: {
    color: '#999',
    fontSize: 12,
  },
});

export default Slider;