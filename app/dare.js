import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import {
  useFonts,
  AmaticSC_400Regular,
  AmaticSC_700Bold,
} from "@expo-google-fonts/amatic-sc";
import { BubblegumSans_400Regular } from "@expo-google-fonts/bubblegum-sans";
import { Creepster_400Regular } from "@expo-google-fonts/creepster";

// Move Firebase initialization to a separate file later
const SHOTS_OPTIONS = [
  "Take 1 shot",
  "Take 2 shots",
  "Take 3 shots",
  "Take 4 shots",
  "Take 5 shots",
];

const TIER_ACTS = {
  Starter: [
    "Wink again",
    "Blow a kiss",
    "Give a compliment",
    "Do a dance move",
    "Tell a joke",
  ],
  Wild: [
    "Do 5 pushups",
    "Sing a verse",
    "Show your best move",
    "Tell an embarrassing story",
    "Do an impression",
  ],
  Extreme: [
    "Prank call someone",
    "Do the chicken dance",
    "Speak in an accent",
    "Show your party trick",
    "Do a handstand",
  ],
  "Dark Finale": [
    "Reveal a secret",
    "Take a dare from the group",
    "Do a trust fall",
    "Swap clothes with someone",
    "Let someone post on your social",
  ],
};

// Add new tier-specific effects components with error handling
const LightningEffect = () => {
  return (
    <Animatable.View
      animation={{
        0: { opacity: 0 },
        0.2: { opacity: 0.7 },
        0.3: { opacity: 0 },
        0.4: { opacity: 0.7 },
        0.5: { opacity: 0 },
        1: { opacity: 0 },
      }}
      duration={3000}
      iterationCount="infinite"
      style={StyleSheet.absoluteFill}
    >
      <LinearGradient
        colors={["rgba(255, 235, 59, 0.3)", "rgba(255, 109, 0, 0.3)"]}
        style={StyleSheet.absoluteFill}
      />
    </Animatable.View>
  );
};

const SmokeEffect = () => {
  return (
    <Animatable.View
      animation={{
        0: { opacity: 0.1 },
        0.5: { opacity: 0.3 },
        1: { opacity: 0.1 },
      }}
      duration={5000}
      iterationCount="infinite"
      easing="ease-in-out"
      style={StyleSheet.absoluteFill}
    >
      <LinearGradient
        colors={["rgba(156, 39, 176, 0.2)", "rgba(224, 64, 251, 0.2)"]}
        style={StyleSheet.absoluteFill}
      />
    </Animatable.View>
  );
};

// Add Confetti Effect Component
const ConfettiEffect = () => {
  const confettiColors = ["#FFE082", "#FFF59D", "#FFEE58", "#FDD835"];

  return (
    <Animatable.View style={StyleSheet.absoluteFill}>
      {Array(30)
        .fill()
        .map((_, i) => (
          <Animatable.View
            key={i}
            animation={{
              0: {
                translateY: -20,
                translateX: Math.random() * SCREEN_WIDTH,
                scale: 1,
                rotate: "0deg",
              },
              1: {
                translateY: SCREEN_HEIGHT,
                translateX:
                  Math.random() * SCREEN_WIDTH + (Math.random() - 0.5) * 100,
                scale: 0,
                rotate: "360deg",
              },
            }}
            duration={2000 + Math.random() * 1000}
            delay={Math.random() * 2000}
            iterationCount="infinite"
            easing="linear"
            style={{
              position: "absolute",
              backgroundColor:
                confettiColors[
                  Math.floor(Math.random() * confettiColors.length)
                ],
              width: 8,
              height: 8,
              borderRadius: Math.random() > 0.5 ? 4 : 0,
            }}
          />
        ))}
    </Animatable.View>
  );
};

// Update TIER_STYLES with new color scheme
const TIER_STYLES = {
  Starter: {
    colors: ["#eba8a2", "#eba8a2"],
    textColor: "#000000",
    buttonColor: "#eba8a2",
    accentColor: "#000000",
    buttonText: "Go!",
    containerStyle: {
      flex: 1,
      backgroundColor: "#eba8a2",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingVertical: 8,
      paddingTop: 25,
    },
    titleStyle: {
      fontFamily: "BubblegumSans_400Regular",
      fontSize: 26,
      color: "#000000",
      textAlign: "center",
      marginTop: 20,
      marginBottom: 12,
      fontWeight: "bold",
    },
    mainContentContainer: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderRadius: 25,
      borderWidth: 3,
      borderColor: "#d88a84",
      padding: 18,
      width: "88%",
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 10,
      marginTop: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    dareTextStyle: {
      fontFamily: "BubblegumSans_400Regular",
      fontSize: 30,
      color: "#000000",
      textAlign: "center",
      paddingHorizontal: 18,
      paddingVertical: 20,
      backgroundColor: "#ffd4d1",
      borderRadius: 20,
      borderWidth: 3,
      borderColor: "#d88a84",
      marginBottom: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
      width: "100%",
      minHeight: 90,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    dareLabelStyle: {
      position: "absolute",
      top: -15,
      left: 0,
      right: 0,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1,
    },
    dareLabelTextContainer: {
      backgroundColor: "#d88a84",
      paddingHorizontal: 15,
      paddingVertical: 5,
      borderRadius: 15,
      borderWidth: 2,
      borderColor: "#fff",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    dareLabelText: {
      fontFamily: "BubblegumSans_400Regular",
      fontSize: 18,
      color: "#fff",
      fontWeight: "bold",
    },
    timerStyle: {
      width: 115,
      height: 115,
      borderRadius: 58,
      backgroundColor: "#eba8a2",
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 12,
      borderWidth: 8,
      borderColor: "#eba8a2",
      position: "relative",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    timerBorderStyle: {
      position: "absolute",
      top: -8,
      left: -8,
      right: -8,
      bottom: -8,
      borderRadius: 68,
      borderWidth: 3,
      borderColor: "#d88a84",
      borderStyle: "dashed",
    },
    timerTextStyle: {
      fontFamily: "BubblegumSans_400Regular",
      fontSize: 45,
      color: "#000000",
      fontWeight: "bold",
    },
    buttonStyle: {
      backgroundColor: "#FFFFFF",
      paddingHorizontal: 35,
      paddingVertical: 12,
      borderRadius: 30,
      borderWidth: 3,
      borderColor: "#d88a84",
      marginVertical: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
      minWidth: 145,
      alignItems: "center",
    },
    buttonTextStyle: {
      fontFamily: "BubblegumSans_400Regular",
      fontSize: 22,
      color: "#000000",
      fontWeight: "bold",
    },
    navigationButtonStyle: {
      backgroundColor: "#eba8a2",
      paddingHorizontal: 35,
      paddingVertical: 12,
      borderRadius: 30,
      borderWidth: 3,
      borderColor: "#d88a84",
      marginVertical: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
      minWidth: 190,
      alignItems: "center",
    },
    nextDareButton: {
      backgroundColor: "#FFFFFF",
      paddingHorizontal: 25,
      paddingVertical: 12,
      borderRadius: 30,
      borderWidth: 3,
      borderColor: "#d88a84",
      marginTop: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
      minWidth: 170,
      alignItems: "center",
    },
    nextDareButtonText: {
      fontFamily: "BubblegumSans_400Regular",
      fontSize: 20,
      color: "#000000",
      fontWeight: "bold",
    },
    endButtonStyle: {
      backgroundColor: "#FF6B6B",
      paddingHorizontal: 40,
      paddingVertical: 15,
      borderRadius: 30,
      borderWidth: 3,
      borderColor: "#d88a84",
      marginVertical: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
      minWidth: 200,
      alignItems: "center",
    },
  },
  Wild: {
    colors: ["#FF5252", "#D32F2F"], // Vibrant red gradient
    textColor: "#FFFFFF",
    buttonColor: "#D32F2F",
    accentColor: "#FF8A80",
    buttonText: "Roll! 🎲",
    containerStyle: {
      backgroundColor: "transparent",
    },
    buttonStyle: {
      backgroundColor: "#D32F2F",
      borderWidth: 2,
      borderColor: "#FF8A80",
    },
    sounds: {
      start: "sax",
      end: "giggle",
    },
  },
  Extreme: {
    colors: ["#FF6D00", "#E65100"], // Orange-red gradient
    textColor: "#000000",
    buttonColor: "#E65100",
    accentColor: "#FFD180",
    fontFamily: "Impact",
    textOutlineColor: "#FFEB3B",
    textOutlineWidth: 1,
    backgroundEffect: LightningEffect,
    buttonText: "Fight! 🔥",
    containerStyle: {
      backgroundColor: "transparent",
    },
    buttonStyle: {
      backgroundColor: "#E65100",
      borderWidth: 2,
      borderColor: "#FFEB3B",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 10,
    },
    pickerStyle: {
      backgroundColor: "rgba(255, 109, 0, 0.1)",
      borderColor: "#FFEB3B",
    },
    sounds: {
      start: "heartbeat",
      end: "applause",
    },
  },
  "Dark Finale": {
    colors: ["#1A1A1A", "#000000"], // Dark gradient with purple accents
    textColor: "#9C27B0",
    buttonColor: "#6A1B9A",
    accentColor: "#E040FB",
    fontFamily: "Creepster",
    glowColor: "#E040FB",
    glowRadius: 15,
    backgroundEffect: SmokeEffect,
    buttonText: "Dare to Enter! 💀",
    containerStyle: {
      backgroundColor: "transparent",
    },
    buttonStyle: {
      backgroundColor: "#6A1B9A",
      borderWidth: 2,
      borderColor: "#E040FB",
      shadowColor: "#E040FB",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.8,
      shadowRadius: 12,
      elevation: 15,
    },
    pickerStyle: {
      backgroundColor: "rgba(156, 39, 176, 0.1)",
      borderColor: "#E040FB",
    },
    sounds: {
      start: "heartbeat",
      end: "giggle",
    },
  },
};

// Add sound mapping
const SOUND_FILES = {
  heartbeat: require("../assets/sounds/heartbeat.mp3"),
  applause: require("../assets/sounds/applause.mp3"),
  sax: require("../assets/sounds/sax.mp3"),
  giggle: require("../assets/sounds/giggle.mp3"),
};

// Get screen dimensions and safe area
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const RESPONSIVE_FONT_SCALE = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) / 400;
const BASE_PADDING = Math.min(8, SCREEN_WIDTH * 0.02);
const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 44 : 24;
const BOTTOM_SPACING = Platform.OS === "ios" ? 34 : 16;

// Base styles that don't depend on dynamic values
const baseStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: STATUS_BAR_HEIGHT + 20,
    paddingBottom: BOTTOM_SPACING + BASE_PADDING,
    paddingHorizontal: BASE_PADDING,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    maxWidth: SCREEN_WIDTH,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  loadingText: {
    marginTop: 10 * RESPONSIVE_FONT_SCALE,
    fontSize: 16 * RESPONSIVE_FONT_SCALE,
    color: "#666",
  },
  errorText: {
    fontSize: 18 * RESPONSIVE_FONT_SCALE,
    color: "#FF3B30",
    marginBottom: 20 * RESPONSIVE_FONT_SCALE,
    textAlign: "center",
  },
  lightningOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.7,
    zIndex: 1,
  },
  smokeOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
    zIndex: 1,
  },
});

// Add font family constants to avoid typos
const FONTS = {
  AMATIC_REGULAR: "AmaticSC_400Regular",
  AMATIC_BOLD: "AmaticSC_700Bold",
  BUBBLEGUM: "BubblegumSans_400Regular",
  IMPACT: "Impact",
  CREEPSTER: "Creepster_400Regular",
};

// Helper functions first
const getFontFamily = (tier, fontsLoaded) => {
  if (!fontsLoaded) return undefined;

  switch (tier) {
    case "Wild":
      return FONTS.AMATIC_BOLD;
    case "Extreme":
      return FONTS.AMATIC_BOLD;
    case "Dark Finale":
      return FONTS.CREEPSTER;
    default:
      return FONTS.AMATIC_REGULAR;
  }
};

// Define getDefaultStyles function after getFontFamily is defined
const getDefaultStyles = (fontsLoaded) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: BASE_PADDING,
      backgroundColor: "#fff",
    },
    dareContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      padding: 20,
    },
    tierText: {
      fontSize: 32 * RESPONSIVE_FONT_SCALE,
      fontWeight: "bold",
      color: "#5D4037", // Dark brown for contrast
      marginBottom: 10 * RESPONSIVE_FONT_SCALE,
      textAlign: "center",
    },
    dareText: {
      fontSize: 20 * RESPONSIVE_FONT_SCALE,
      textAlign: "center",
      marginBottom: 5 * RESPONSIVE_FONT_SCALE,
      color: "#333",
      lineHeight: 24 * RESPONSIVE_FONT_SCALE,
    },
    pickerContainer: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    picker: {
      width: "100%",
      backgroundColor: "#f5f5f5",
      marginBottom: 3 * RESPONSIVE_FONT_SCALE,
    },
    labelText: {
      fontSize: 20 * RESPONSIVE_FONT_SCALE,
      fontWeight: "600",
      color: "#FFFFFF",
      marginBottom: 8 * RESPONSIVE_FONT_SCALE,
    },
    buttonContainer: {
      width: "100%",
      maxWidth: SCREEN_WIDTH,
      alignItems: "center",
      marginTop: 0,
      paddingBottom: 10 * RESPONSIVE_FONT_SCALE,
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
    },
    scoresButton: {
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      padding: 6 * RESPONSIVE_FONT_SCALE,
      borderRadius: 8,
      marginBottom: 5 * RESPONSIVE_FONT_SCALE,
      alignSelf: "center",
      borderWidth: 1,
      borderColor: "#FFB300",
    },
    dareButton: {
      backgroundColor: "#4CAF50",
      marginTop: 20 * RESPONSIVE_FONT_SCALE,
    },
    tierButton: (tier) => {
      const style = TIER_STYLES[tier];
      return {
        ...(style?.buttonStyle || {}),
        padding: 15 * RESPONSIVE_FONT_SCALE,
        borderRadius: 8,
        marginVertical: 8 * RESPONSIVE_FONT_SCALE,
        width: "80%",
        maxWidth: 300,
        alignItems: "center",
      };
    },
    endButton: {
      backgroundColor: "#FF3B30",
    },
    buttonText: {
      textAlign: "center",
    },
    tierContainer: (tier) => {
      const style = TIER_STYLES[tier];
      return {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: BASE_PADDING,
        maxWidth: SCREEN_WIDTH,
        ...(style?.containerStyle || {}),
      };
    },
    tierDareContainer: (tier) => {
      const style = TIER_STYLES[tier];
      return {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        padding: 6 * RESPONSIVE_FONT_SCALE,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#FFB300",
        marginTop: 5 * RESPONSIVE_FONT_SCALE,
        width: "98%",
        maxWidth: SCREEN_WIDTH * 0.98,
        alignItems: "center",
      };
    },
    tierSpecificText: (tier) => {
      const style = TIER_STYLES[tier];
      const baseStyle = {
        fontFamily: getFontFamily(tier, fontsLoaded),
        fontSize: 32 * RESPONSIVE_FONT_SCALE,
        color: style?.textColor || "#FFFFFF",
        textShadowColor: "rgba(0,0,0,0.5)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        textAlign: "center",
        paddingHorizontal: BASE_PADDING,
      };

      if (tier === "Extreme") {
        return {
          ...baseStyle,
          textShadowColor: "#FFEB3B",
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 2,
          color: "#FFFFFF",
        };
      }

      if (tier === "Dark Finale") {
        return {
          ...baseStyle,
          textShadowColor: "#E040FB",
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 10,
          color: "#E040FB",
        };
      }

      return {
        ...baseStyle,
        ...(style?.textStyle || {}),
      };
    },
    tierDareText: (tier) => {
      const style = TIER_STYLES[tier];
      if (tier === "Starter") {
        return style.dareTextStyle;
      }
      const baseStyle = {
        fontFamily: getFontFamily(tier, fontsLoaded),
        fontSize: 28 * RESPONSIVE_FONT_SCALE,
        color: "#5D4037", // Dark brown for contrast
        textAlign: "center",
        marginVertical: 8 * RESPONSIVE_FONT_SCALE,
        lineHeight: 34 * RESPONSIVE_FONT_SCALE,
        textShadowColor: "rgba(0,0,0,0.2)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2 * RESPONSIVE_FONT_SCALE,
        padding: 20 * RESPONSIVE_FONT_SCALE,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: 12 * RESPONSIVE_FONT_SCALE,
        borderWidth: 1,
        borderColor: "#FFB300",
        maxWidth: "90%",
      };

      if (tier === "Extreme") {
        return {
          ...baseStyle,
          textShadowColor: "#FFEB3B",
          textShadowOffset: { width: 2, height: 2 },
          textShadowRadius: 4 * RESPONSIVE_FONT_SCALE,
          color: "#FFFFFF",
          borderColor: "#FFEB3B",
          backgroundColor: "rgba(255, 109, 0, 0.3)",
        };
      }

      if (tier === "Dark Finale") {
        return {
          ...baseStyle,
          textShadowColor: "#E040FB",
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 15 * RESPONSIVE_FONT_SCALE,
          color: "#E040FB",
          borderColor: "#E040FB",
          backgroundColor: "rgba(156, 39, 176, 0.2)",
        };
      }

      return {
        ...baseStyle,
        ...(style?.textStyle || {}),
      };
    },
    tierPickerContainer: (tier) => {
      const style = TIER_STYLES[tier];
      return {
        width: "100%",
        marginVertical: 5 * RESPONSIVE_FONT_SCALE,
        padding: 6 * RESPONSIVE_FONT_SCALE,
        borderRadius: 6 * RESPONSIVE_FONT_SCALE,
        borderWidth: 1,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        borderColor: style?.accentColor || "#fff",
      };
    },
    tierPicker: (tier) => {
      const style = TIER_STYLES[tier];
      return {
        width: "100%",
        height: 36 * RESPONSIVE_FONT_SCALE,
        marginBottom: 3 * RESPONSIVE_FONT_SCALE,
        color: style?.textColor || "#FFFFFF",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      };
    },
    tierLabelText: (tier) => {
      const style = TIER_STYLES[tier];
      return {
        color: style?.textColor || "#FFFFFF",
        fontSize: 20 * RESPONSIVE_FONT_SCALE,
        fontFamily: getFontFamily(tier, fontsLoaded),
        marginBottom: 5 * RESPONSIVE_FONT_SCALE,
        textShadowColor: "rgba(0,0,0,0.5)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2 * RESPONSIVE_FONT_SCALE,
      };
    },
    tierButtonContainer: (tier) => ({
      marginTop: tier ? 20 * RESPONSIVE_FONT_SCALE : 0,
    }),
    tierNavigationButton: (tier) => {
      const style = TIER_STYLES[tier];
      return tier
        ? {
            backgroundColor: style?.buttonColor,
            borderWidth: 2 * RESPONSIVE_FONT_SCALE,
            borderColor: style?.textColor,
          }
        : {};
    },
    tierButtonText: (tier) => {
      const style = TIER_STYLES[tier];
      return {
        fontFamily: getFontFamily(tier, fontsLoaded),
        fontSize: 24 * RESPONSIVE_FONT_SCALE,
        color: style?.textColor || "#fff",
        ...(style?.textOutlineColor
          ? {
              textShadowColor: style.textOutlineColor,
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1 * RESPONSIVE_FONT_SCALE,
            }
          : {}),
      };
    },
    tierDareButton: (tier) => {
      const style = TIER_STYLES[tier];
      return {
        ...(style?.buttonStyle || {}),
      };
    },
  });

// Add getStyledText function before the Dare component
const getStyledText = (text, style, tier, fontsLoaded) => {
  if (!text) return null;

  const fontFamily = getFontFamily(tier, fontsLoaded);
  const baseStyle = [style, fontFamily ? { fontFamily } : undefined].filter(
    Boolean
  );

  // Check if this is a dare text (contains the word "dare" or is longer than a typical label)
  const isDareText = text.toLowerCase().includes("dare") || text.length > 30;

  if (tier === "Dark Finale") {
    return (
      <Animatable.Text
        animation={
          isDareText
            ? {
                0: { scale: 1, textShadowRadius: 5 },
                0.5: { scale: 1.05, textShadowRadius: 15 },
                1: { scale: 1, textShadowRadius: 5 },
              }
            : {
                0: { textShadowRadius: 5 },
                0.5: { textShadowRadius: 15 },
                1: { textShadowRadius: 5 },
              }
        }
        duration={2000}
        iterationCount="infinite"
        easing="ease-in-out"
        style={[
          baseStyle,
          {
            textShadowColor: "#E040FB",
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: isDareText ? 15 : 10,
          },
        ]}
      >
        {text}
      </Animatable.Text>
    );
  }

  if (tier === "Extreme") {
    return (
      <Animatable.Text
        animation={isDareText ? "pulse" : undefined}
        duration={1000}
        iterationCount="infinite"
        style={[
          baseStyle,
          {
            textShadowColor: "#FFEB3B",
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: isDareText ? 4 : 2,
          },
        ]}
      >
        {text}
      </Animatable.Text>
    );
  }

  // For other tiers, add a subtle pulse animation only for dare text
  if (isDareText) {
    return (
      <Animatable.Text
        animation="pulse"
        duration={2000}
        iterationCount="infinite"
        style={baseStyle}
      >
        {text}
      </Animatable.Text>
    );
  }

  return <Text style={baseStyle}>{text}</Text>;
};

// Modified timer component
const Timer = ({ style, textStyle, start }) => {
  const [time, setTime] = useState(30);
  const [isRunning, setIsRunning] = useState(false);

  // Reset and start timer when start prop changes
  useEffect(() => {
    if (start) {
      setTime(30);
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  }, [start]);

  // Timer countdown logic
  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, time]);

  return (
    <View style={style}>
      <View style={TIER_STYLES.Starter.timerBorderStyle} />
      <Text style={textStyle}>{time}</Text>
    </View>
  );
};

// Move styles to the top level
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#E53935",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

const Dare = ({ route, navigation }) => {
  const { tier } = route.params;
  const [dare, setDare] = useState(null);
  const [nextDare, setNextDare] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [time, setTime] = useState(30);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scores, setScores] = useState({ couple1: 0, couple2: 0 });
  const [showPointAnimation, setShowPointAnimation] = useState({
    couple1: false,
    couple2: false,
  });

  const fetchDare = useCallback(() => {
    const dummyDares = [
      "Do a dance move",
      "Show your best move",
      "Tell a joke",
      "Make a funny face",
      "Do a dance move",
    ];
    const randomDare =
      dummyDares[Math.floor(Math.random() * dummyDares.length)];
    return { text: randomDare };
  }, []);

  const handleNextDare = useCallback(() => {
    const newDare = fetchDare();
    setNextDare(newDare);
    setDare(null);
    setIsTimerRunning(false);
    setTime(30);
  }, [fetchDare]);

  const handleGo = useCallback(() => {
    if (nextDare) {
      setDare(nextDare);
      setNextDare(null);
      setIsTimerRunning(true);
      setTime(30);
    } else if (dare && !isTimerRunning) {
      setIsTimerRunning(true);
    }
  }, [nextDare, dare, isTimerRunning]);

  const handlePause = useCallback(() => {
    setIsTimerRunning(false);
  }, []);

  const handleScore = useCallback((couple) => {
    setScores((prev) => ({
      ...prev,
      [couple]: prev[couple] + 1,
    }));
    setShowPointAnimation((prev) => ({
      ...prev,
      [couple]: true,
    }));
    setTimeout(() => {
      setShowPointAnimation((prev) => ({
        ...prev,
        [couple]: false,
      }));
    }, 1000);
  }, []);

  useEffect(() => {
    if (!dare && !nextDare && tier === "Starter") {
      handleNextDare();
    }
  }, [tier, handleNextDare]);

  useEffect(() => {
    let interval;
    if (isTimerRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerRunning, time]);

  if (tier === "Starter") {
    return (
      <SafeAreaView
        style={[
          baseStyles.safeArea,
          isDarkMode && { backgroundColor: "#1a1a1a" },
        ]}
      >
        <View
          style={[
            TIER_STYLES[tier].containerStyle,
            isDarkMode && { backgroundColor: "#2a2a2a" },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 25,
              paddingHorizontal: 20,
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Text
              style={[
                TIER_STYLES[tier].titleStyle,
                isDarkMode && { color: "#ffffff" },
              ]}
            >
              Double Trouble: Starter Dares ❤️‍🔥
            </Text>
          </View>

          <Animatable.View
            animation="fadeIn"
            duration={1000}
            style={[
              TIER_STYLES[tier].mainContentContainer,
              isDarkMode && { backgroundColor: "rgba(255, 255, 255, 0.1)" },
            ]}
          >
            <Animatable.View
              animation={dare ? "bounceIn" : "fadeIn"}
              duration={1000}
              style={[
                TIER_STYLES[tier].dareTextStyle,
                isDarkMode && {
                  backgroundColor: "#3a3a3a",
                  borderColor: "#d88a84",
                },
              ]}
            >
              <View style={TIER_STYLES[tier].dareLabelStyle}>
                <View style={TIER_STYLES[tier].dareLabelTextContainer}>
                  <Text style={TIER_STYLES[tier].dareLabelText}>DARE</Text>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  paddingTop: 15,
                }}
              >
                <Text
                  style={[
                    {
                      fontFamily: "BubblegumSans_400Regular",
                      fontSize: 32,
                      color: isDarkMode ? "#ffffff" : "#000000",
                      textAlign: "center",
                      width: "100%",
                      paddingHorizontal: 10,
                    },
                  ]}
                >
                  {dare
                    ? dare.text
                    : nextDare
                    ? nextDare.text
                    : "Click Next Dare to start"}
                </Text>
              </View>
            </Animatable.View>

            <Animatable.View
              animation="pulse"
              iterationCount="infinite"
              duration={2000}
              style={TIER_STYLES[tier].timerStyle}
            >
              <View style={TIER_STYLES[tier].timerBorderStyle} />
              <Text
                style={[
                  TIER_STYLES[tier].timerTextStyle,
                  isDarkMode && { color: "#ffffff" },
                ]}
              >
                {time}
              </Text>
            </Animatable.View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
                marginVertical: 10,
              }}
            >
              <TouchableOpacity
                style={[
                  {
                    backgroundColor: "#fff",
                    padding: 12,
                    borderRadius: 20,
                    borderWidth: 3,
                    borderColor: "#ff69b4",
                    minWidth: 145,
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 3,
                  },
                  isDarkMode && { backgroundColor: "#3a3a3a" },
                ]}
                onPress={() => handleScore("couple1")}
              >
                <Text
                  style={[
                    {
                      fontFamily: "BubblegumSans_400Regular",
                      fontSize: 17,
                      color: "#000",
                      textAlign: "center",
                    },
                    isDarkMode && { color: "#fff" },
                  ]}
                >
                  ❤️ Couple 1 👫{"\n"}Score: {scores.couple1}
                </Text>
                {showPointAnimation.couple1 && (
                  <Animatable.Text
                    animation="bounceOut"
                    duration={1000}
                    style={{
                      position: "absolute",
                      top: -20,
                      fontSize: 20,
                      color: "#ff69b4",
                      fontWeight: "bold",
                    }}
                  >
                    🏆 +1 Point!
                  </Animatable.Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  {
                    backgroundColor: "#fff",
                    padding: 12,
                    borderRadius: 20,
                    borderWidth: 3,
                    borderColor: "#4169e1",
                    minWidth: 145,
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 3,
                  },
                  isDarkMode && { backgroundColor: "#3a3a3a" },
                ]}
                onPress={() => handleScore("couple2")}
              >
                <Text
                  style={[
                    {
                      fontFamily: "BubblegumSans_400Regular",
                      fontSize: 17,
                      color: "#000",
                      textAlign: "center",
                    },
                    isDarkMode && { color: "#fff" },
                  ]}
                >
                  💙 Couple 2 👫{"\n"}Score: {scores.couple2}
                </Text>
                {showPointAnimation.couple2 && (
                  <Animatable.Text
                    animation="bounceOut"
                    duration={1000}
                    style={{
                      position: "absolute",
                      top: -20,
                      fontSize: 20,
                      color: "#4169e1",
                      fontWeight: "bold",
                    }}
                  >
                    🏆 +1 Point!
                  </Animatable.Text>
                )}
              </TouchableOpacity>
            </View>

            <Animatable.View
              animation="fadeInUp"
              duration={1000}
              style={{ width: "100%", alignItems: "center", marginTop: 10 }}
            >
              <TouchableOpacity
                style={[
                  TIER_STYLES[tier].buttonStyle,
                  !nextDare && !dare && { opacity: 0.5 },
                ]}
                onPress={isTimerRunning ? handlePause : handleGo}
                disabled={!nextDare && !dare}
              >
                <Text
                  style={[
                    TIER_STYLES[tier].buttonTextStyle,
                    isDarkMode && { color: "#ffffff" },
                  ]}
                >
                  {isTimerRunning ? "⏸ Pause" : dare ? "Resume 🎯" : "Go! 🎯"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={TIER_STYLES[tier].nextDareButton}
                onPress={handleNextDare}
              >
                <Text
                  style={[
                    TIER_STYLES[tier].nextDareButtonText,
                    isDarkMode && { color: "#ffffff" },
                  ]}
                >
                  🎲 Next Dare
                </Text>
              </TouchableOpacity>
            </Animatable.View>
          </Animatable.View>

          <View
            style={{
              width: "100%",
              alignItems: "center",
              marginTop: -5,
            }}
          >
            <TouchableOpacity
              style={[
                TIER_STYLES[tier].navigationButtonStyle,
                isDarkMode && { backgroundColor: "#3a3a3a" },
              ]}
              onPress={() => navigation.navigate("TierSelection")}
            >
              <Text
                style={[
                  TIER_STYLES[tier].buttonTextStyle,
                  isDarkMode && { color: "#ffffff" },
                ]}
              >
                🎮 Pick Another Level
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                TIER_STYLES[tier].endButtonStyle,
                isDarkMode && { backgroundColor: "#ff4444" },
                { marginTop: 5 },
              ]}
              onPress={() => navigation.navigate("End")}
            >
              <Text
                style={[
                  TIER_STYLES[tier].buttonTextStyle,
                  isDarkMode && { color: "#ffffff" },
                ]}
              >
                🌙 End the Night
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        baseStyles.safeArea,
        isDarkMode && { backgroundColor: "#1a1a1a" },
      ]}
    >
      {(() => {
        const BackgroundEffect = TIER_STYLES[tier].backgroundEffect;
        if (BackgroundEffect) {
          return <BackgroundEffect />;
        }
        return null;
      })()}
      <View style={baseStyles.contentContainer}>
        <View
          style={[
            getDefaultStyles(true).dareContainer,
            getDefaultStyles(true).tierDareContainer(tier),
          ]}
        >
          {getStyledText(
            tier,
            [
              getDefaultStyles(true).tierText,
              getDefaultStyles(true).tierSpecificText(tier),
            ],
            tier,
            true
          )}

          <TouchableOpacity
            style={[
              getDefaultStyles(true).scoresButton,
              getDefaultStyles(true).tierButton(tier),
            ]}
            onPress={() => navigation.navigate("Scores")}
          >
            <Text
              style={[
                getDefaultStyles(true).buttonText,
                getDefaultStyles(true).tierButtonText(tier),
              ]}
            >
              View Scores
            </Text>
          </TouchableOpacity>

          <View
            style={[
              getDefaultStyles(true).pickerContainer,
              getDefaultStyles(true).tierPickerContainer(tier),
            ]}
          >
            <Text
              style={[
                getDefaultStyles(true).dareText,
                getDefaultStyles(true).tierDareText(tier),
                { textAlign: "center" },
              ]}
            >
              {dare?.text || "No dare available"}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              getDefaultStyles(true).button,
              getDefaultStyles(true).tierButton(tier),
            ]}
            onPress={() => {
              const newDare = fetchDare();
              setDare(newDare);
            }}
          >
            <Text
              style={[
                getDefaultStyles(true).buttonText,
                getDefaultStyles(true).tierButtonText(tier),
              ]}
            >
              {TIER_STYLES[tier].buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={[
          getDefaultStyles(true).buttonContainer,
          getDefaultStyles(true).tierButtonContainer(tier),
        ]}
      >
        <TouchableOpacity
          style={[
            getDefaultStyles(true).button,
            getDefaultStyles(true).tierButton,
            getDefaultStyles(true).tierNavigationButton(tier),
          ]}
          onPress={() => navigation.navigate("TierSelection")}
        >
          <Text
            style={[
              getDefaultStyles(true).buttonText,
              getDefaultStyles(true).tierButtonText(tier),
            ]}
          >
            Pick Another Level
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            getDefaultStyles(true).button,
            getDefaultStyles(true).endButton,
            getDefaultStyles(true).tierNavigationButton(tier),
          ]}
          onPress={() => navigation.navigate("End")}
        >
          <Text
            style={[
              getDefaultStyles(true).buttonText,
              getDefaultStyles(true).tierButtonText(tier),
            ]}
          >
            End Game
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Dare;
