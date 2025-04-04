import React, { useState, useEffect } from "react";
import { Animated, View, StyleSheet } from "react-native";
import { Svg, Path } from "react-native-svg";

// Heart Spark SVG component
const HeartSparkSvg = ({ style }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" style={style}>
    <Path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="#FF80AB"
      opacity={0.8}
    />
  </Svg>
);

const DiceRollAnimation = ({ isRolling }) => {
  const [sparkles] = useState(Array(12).fill(0));
  const [animatedValues] = useState(() =>
    sparkles.map(() => ({
      scale: new Animated.Value(0),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  );

  useEffect(() => {
    if (isRolling) {
      sparkles.forEach((_, i) => {
        const delay = i * 100;
        Animated.sequence([
          Animated.parallel([
            Animated.timing(animatedValues[i].scale, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
              delay,
            }),
            Animated.timing(animatedValues[i].opacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
              delay,
            }),
            Animated.timing(animatedValues[i].rotate, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
              delay,
            }),
          ]),
          Animated.parallel([
            Animated.timing(animatedValues[i].scale, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValues[i].opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      });
    }
  }, [isRolling]);

  return (
    <View style={styles.container}>
      {sparkles.map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.sparkle,
            {
              transform: [
                {
                  scale: animatedValues[i].scale,
                },
                {
                  rotate: animatedValues[i].rotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
              opacity: animatedValues[i].opacity,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            },
          ]}
        >
          <HeartSparkSvg />
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  },
  sparkle: {
    position: "absolute",
    width: 16,
    height: 16,
  },
});

export default DiceRollAnimation;
