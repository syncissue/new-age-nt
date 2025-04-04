import React, { useState, useEffect } from "react";
import { Animated, Dimensions, StyleSheet } from "react-native";

const Confetti = () => {
  const [particles] = useState(Array(50).fill(0));
  const [animatedValues] = useState(() =>
    particles.map(() => new Animated.Value(0))
  );

  useEffect(() => {
    const animate = () => {
      const animations = particles.map((_, i) => {
        return Animated.timing(animatedValues[i], {
          toValue: 1,
          duration: 3000 + Math.random() * 2000,
          useNativeDriver: true,
        });
      });

      Animated.stagger(100, animations).start(() => {
        animatedValues.forEach((anim) => anim.setValue(0));
        animate();
      });
    };

    animate();
  }, [particles, animatedValues]);

  return (
    <>
      {particles.map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.confetti,
            {
              left: `${Math.random() * 100}%`,
              transform: [
                {
                  translateY: animatedValues[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, Dimensions.get("window").height],
                  }),
                },
                {
                  rotate: animatedValues[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  confetti: {
    position: "absolute",
    width: 10,
    height: 10,
    backgroundColor: "#FFD700",
    borderRadius: 5,
  },
});

export default Confetti;
