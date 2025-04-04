import React, { useState, useEffect } from "react";
import { Animated, Dimensions, View } from "react-native";
import { Svg, Path } from "react-native-svg";

// Petal SVG component
const PetalSvg = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Path
      d="M12 2C8 5 3 10 3 14c0 4 3 8 9 8s9-4 9-8c0-4-5-9-9-12z"
      fill="#FFEBEE"
      opacity={0.8}
    />
  </Svg>
);

const PetalFall = () => {
  const [petals] = useState(Array(30).fill(0));
  const [animatedValues] = useState(() =>
    petals.map(() => ({
      y: new Animated.Value(0),
      x: new Animated.Value(0),
      rotate: new Animated.Value(0),
    }))
  );

  useEffect(() => {
    const animate = () => {
      const animations = petals.map((_, i) => {
        const yAnimation = Animated.timing(animatedValues[i].y, {
          toValue: 1,
          duration: 3000 + Math.random() * 2000,
          useNativeDriver: true,
        });

        const xAnimation = Animated.timing(animatedValues[i].x, {
          toValue: Math.random() * 2 - 1,
          duration: 3000 + Math.random() * 2000,
          useNativeDriver: true,
        });

        const rotateAnimation = Animated.timing(animatedValues[i].rotate, {
          toValue: 1,
          duration: 3000 + Math.random() * 2000,
          useNativeDriver: true,
        });

        return Animated.parallel([yAnimation, xAnimation, rotateAnimation]);
      });

      Animated.stagger(100, animations).start(() => {
        animatedValues.forEach((anim) => {
          anim.y.setValue(0);
          anim.x.setValue(0);
          anim.rotate.setValue(0);
        });
        animate();
      });
    };

    animate();
  }, [petals, animatedValues]);

  return (
    <View style={{ position: "absolute", width: "100%", height: "100%" }}>
      {petals.map((_, i) => (
        <Animated.View
          key={i}
          style={[
            {
              position: "absolute",
              width: 20,
              height: 20,
              left: `${Math.random() * 100}%`,
              transform: [
                {
                  translateY: animatedValues[i].y.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, Dimensions.get("window").height],
                  }),
                },
                {
                  translateX: animatedValues[i].x.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 100],
                  }),
                },
                {
                  rotate: animatedValues[i].rotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            },
          ]}
        >
          <PetalSvg />
        </Animated.View>
      ))}
    </View>
  );
};

export default PetalFall;
