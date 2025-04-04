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
  Spicer: [
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

// Update TIER_STYLES with enhanced styling
const TIER_STYLES = {
  Spicer: {
    colors: ["#4CAF50", "#2E7D32"],
    textColor: "#FFFFFF",
    buttonColor: "#2E7D32",
    accentColor: "#81C784",
    buttonText: "Next Dare 🎲",
    containerStyle: {
      backgroundColor: "transparent",
    },
    textStyle: {
      textShadowColor: "rgba(0,0,0,0.5)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    buttonStyle: {
      backgroundColor: "#2E7D32",
      borderWidth: 2,
      borderColor: "#81C784",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    pickerStyle: {
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      borderColor: "#81C784",
      borderWidth: 2,
      color: "#000000",
      dropdownIconColor: "#FFFFFF",
    },
    sounds: {
      start: "heartbeat",
      end: "applause",
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

// Base styles that don't depend on dynamic values
const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 18,
    color: "#FF3B30",
    marginBottom: 20,
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
      padding: 20,
      backgroundColor: "#fff",
    },
    dareContainer: {
      alignItems: "center",
      marginBottom: 40,
      width: "100%",
    },
    tierText: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#007AFF",
      marginBottom: 20,
    },
    dareText: {
      fontSize: 24,
      textAlign: "center",
      marginBottom: 20,
      color: "#333",
      lineHeight: 32,
    },
    pickerContainer: {
      width: "100%",
      marginVertical: 20,
    },
    picker: {
      width: "100%",
      backgroundColor: "#f5f5f5",
      marginBottom: 10,
    },
    labelText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#333",
      marginBottom: 5,
    },
    buttonContainer: {
      width: "100%",
      alignItems: "center",
    },
    button: {
      padding: 15,
      borderRadius: 8,
      marginVertical: 8,
      width: "80%",
      alignItems: "center",
    },
    scoresButton: {
      backgroundColor: "#FFD700",
      padding: 10,
      borderRadius: 8,
      marginBottom: 20,
      alignSelf: "center",
    },
    dareButton: {
      backgroundColor: "#4CAF50",
      marginTop: 20,
    },
    tierButton: (tier) => {
      const style = TIER_STYLES[tier];
      return {
        ...(style?.buttonStyle || {}),
        padding: 15,
        borderRadius: 8,
        marginVertical: 8,
        width: "80%",
        alignItems: "center",
      };
    },
    endButton: {
      backgroundColor: "#FF3B30",
    },
    buttonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "600",
    },
    tierContainer: (tier) => {
      const style = TIER_STYLES[tier];
      return {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        ...(style?.containerStyle || {}),
      };
    },
    tierDareContainer: (tier) => {
      const style = TIER_STYLES[tier];
      return {
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        padding: 20,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: style?.accentColor || "#fff",
        marginTop: 20,
        width: "100%",
        alignItems: "center",
      };
    },
    tierSpecificText: (tier) => {
      const style = TIER_STYLES[tier];
      const baseStyle = {
        fontFamily: getFontFamily(tier, fontsLoaded),
        fontSize: 32,
        color: style?.textColor || "#FFFFFF",
        textShadowColor: "rgba(0,0,0,0.5)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
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
      const baseStyle = {
        fontFamily: getFontFamily(tier, fontsLoaded),
        fontSize: 32,
        color: style?.textColor || "#FFFFFF",
        textAlign: "center",
        marginVertical: 25,
        lineHeight: 42,
        textShadowColor: "rgba(0,0,0,0.75)",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
        padding: 15,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        borderRadius: 12,
        borderWidth: 2,
        borderColor: style?.accentColor || "#FFFFFF",
      };

      if (tier === "Extreme") {
        return {
          ...baseStyle,
          textShadowColor: "#FFEB3B",
          textShadowOffset: { width: 2, height: 2 },
          textShadowRadius: 4,
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
          textShadowRadius: 15,
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
        marginVertical: 20,
        padding: 15,
        borderRadius: 10,
        borderWidth: 2,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        borderColor: style?.accentColor || "#fff",
      };
    },
    tierPicker: (tier) => {
      const style = TIER_STYLES[tier];
      return {
        width: "100%",
        height: 50,
        marginBottom: 10,
        color: style?.textColor || "#FFFFFF",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      };
    },
    tierLabelText: (tier) => {
      const style = TIER_STYLES[tier];
      return {
        color: style?.textColor || "#FFFFFF",
        fontSize: 24,
        fontFamily: getFontFamily(tier, fontsLoaded),
        marginBottom: 10,
        textShadowColor: "rgba(0,0,0,0.5)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
      };
    },
    tierButtonContainer: (tier) => ({
      marginTop: tier ? 20 : 0,
    }),
    tierNavigationButton: (tier) => {
      const style = TIER_STYLES[tier];
      return tier
        ? {
            backgroundColor: style?.buttonColor,
            borderWidth: 2,
            borderColor: style?.textColor,
          }
        : {};
    },
    tierButtonText: (tier) => {
      const style = TIER_STYLES[tier];
      return {
        fontFamily: getFontFamily(tier, fontsLoaded),
        fontSize: 24,
        color: style?.textColor || "#fff",
        ...(style?.textOutlineColor
          ? {
              textShadowColor: style.textOutlineColor,
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1,
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
  const [selectedShot, setSelectedShot] = useState(SHOTS_OPTIONS[0]);
  const [selectedAct, setSelectedAct] = useState(TIER_ACTS[tier][0]);
  const [dare, setDare] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all required fonts
  const [fontsLoaded] = useFonts({
    AmaticSC_400Regular,
    AmaticSC_700Bold,
    BubblegumSans_400Regular,
    Creepster_400Regular,
  });

  // Font loading effect
  useEffect(() => {
    const checkFonts = async () => {
      try {
        if (!fontsLoaded) {
          console.log("Fonts are still loading...");
          return;
        }

        console.log("Fonts loaded successfully!");
        console.log("Available fonts:", {
          AmaticSC_400Regular: !!AmaticSC_400Regular,
          AmaticSC_700Bold: !!AmaticSC_700Bold,
          BubblegumSans_400Regular: !!BubblegumSans_400Regular,
          Creepster_400Regular: !!Creepster_400Regular,
        });

        // Verify each required font
        const requiredFonts = {
          [FONTS.AMATIC_REGULAR]: AmaticSC_400Regular,
          [FONTS.AMATIC_BOLD]: AmaticSC_700Bold,
          [FONTS.BUBBLEGUM]: BubblegumSans_400Regular,
          [FONTS.CREEPSTER]: Creepster_400Regular,
        };

        const missingFonts = Object.entries(requiredFonts)
          .filter(([_, font]) => !font)
          .map(([name]) => name);

        if (missingFonts.length > 0) {
          console.warn("Missing fonts:", missingFonts);
          setError(`Missing required fonts: ${missingFonts.join(", ")}`);
        }
      } catch (e) {
        console.error("Font loading error:", e);
        setError("Error loading fonts. Please try again.");
      }
    };

    checkFonts();
  }, [fontsLoaded]);

  // Initialize dynamic styles after font check
  const dynamicStyles = useMemo(
    () => getDefaultStyles(fontsLoaded),
    [fontsLoaded]
  );
  const tierStyle = TIER_STYLES[tier] || TIER_STYLES.Spicer;

  // Tier effect
  useEffect(() => {
    if (tier) {
      const acts = TIER_ACTS[tier] || [];
      setSelectedAct(acts[0] || "");
    }
  }, [tier]);

  // Temporary fetchDare without Firebase
  const fetchDare = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const dummyDares = [
        "Take a fun dare!",
        "Show your best move",
        "Tell a joke",
        "Make a funny face",
        "Do a dance move",
      ];
      const randomDare =
        dummyDares[Math.floor(Math.random() * dummyDares.length)];
      setDare({ text: randomDare });
      setLoading(false);
    }, 500);
  }, []);

  // Loading state
  if (!fontsLoaded) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: tierStyle.colors[0] },
        ]}
      >
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={[styles.loadingText, { color: "#FFFFFF" }]}>
          Loading fonts...
        </Text>
      </View>
    );
  }

  // Error state with retry option
  if (error) {
    return (
      <View
        style={[
          styles.errorContainer,
          { backgroundColor: tierStyle.colors[0] },
        ]}
      >
        <Text style={[styles.errorText, { color: "#FFFFFF" }]}>{error}</Text>
        <TouchableOpacity
          style={[
            styles.retryButton,
            { backgroundColor: tierStyle.buttonColor },
          ]}
          onPress={() => {
            setError(null);
            // Force font reload by remounting the component
            navigation.replace("Dare", { tier });
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[dynamicStyles.container, dynamicStyles.tierContainer(tier)]}>
      <LinearGradient
        colors={tierStyle.colors}
        style={StyleSheet.absoluteFill}
      />

      {tierStyle.backgroundEffect && <tierStyle.backgroundEffect />}

      <View
        style={[
          dynamicStyles.dareContainer,
          dynamicStyles.tierDareContainer(tier),
        ]}
      >
        {getStyledText(
          `Tier: ${tier}`,
          [dynamicStyles.tierText, dynamicStyles.tierSpecificText(tier)],
          tier,
          fontsLoaded
        )}

        <TouchableOpacity
          style={[dynamicStyles.scoresButton, dynamicStyles.tierButton(tier)]}
          onPress={() => navigation.navigate("Scores")}
        >
          <Text
            style={[
              dynamicStyles.buttonText,
              dynamicStyles.tierButtonText(tier),
            ]}
          >
            View Scores 🏆
          </Text>
        </TouchableOpacity>

        <Text
          style={[dynamicStyles.dareText, dynamicStyles.tierDareText(tier)]}
        >
          {dare?.text || "No dare available"}
        </Text>

        <View
          style={[
            dynamicStyles.pickerContainer,
            dynamicStyles.tierPickerContainer(tier),
          ]}
        >
          <Text
            style={[dynamicStyles.labelText, dynamicStyles.tierLabelText(tier)]}
          >
            Choose Shot:
          </Text>
          <View
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              borderRadius: 8,
              marginBottom: 10,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: tierStyle.accentColor || "#FFFFFF",
            }}
          >
            <Picker
              selectedValue={selectedShot}
              onValueChange={setSelectedShot}
              style={{
                width: "100%",
                color: "#000000",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              }}
              dropdownIconColor={tierStyle.textColor}
              mode="dropdown"
            >
              {SHOTS_OPTIONS.map((shot) => (
                <Picker.Item
                  key={shot}
                  label={shot}
                  value={shot}
                  color="#000000"
                />
              ))}
            </Picker>
          </View>

          <Text
            style={[dynamicStyles.labelText, dynamicStyles.tierLabelText(tier)]}
          >
            Choose Act:
          </Text>
          <View
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              borderRadius: 8,
              marginBottom: 10,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: tierStyle.accentColor || "#FFFFFF",
            }}
          >
            <Picker
              selectedValue={selectedAct}
              onValueChange={setSelectedAct}
              style={{
                width: "100%",
                color: "#000000",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              }}
              dropdownIconColor={tierStyle.textColor}
              mode="dropdown"
            >
              {TIER_ACTS[tier].map((act) => (
                <Picker.Item
                  key={act}
                  label={act}
                  value={act}
                  color="#000000"
                />
              ))}
            </Picker>
          </View>
        </View>

        <TouchableOpacity
          style={[
            dynamicStyles.button,
            dynamicStyles.dareButton,
            dynamicStyles.tierDareButton(tier),
            tierStyle.buttonStyle,
          ]}
          onPress={fetchDare}
        >
          {getStyledText(
            tierStyle.buttonText || "Next Dare 🎲",
            [dynamicStyles.buttonText, dynamicStyles.tierButtonText(tier)],
            tier,
            fontsLoaded
          )}
        </TouchableOpacity>
      </View>

      <View
        style={[
          dynamicStyles.buttonContainer,
          dynamicStyles.tierButtonContainer(tier),
        ]}
      >
        <TouchableOpacity
          style={[
            dynamicStyles.button,
            dynamicStyles.tierButton,
            dynamicStyles.tierNavigationButton(tier),
          ]}
          onPress={() => navigation.navigate("TierSelection")}
        >
          <Text
            style={[
              dynamicStyles.buttonText,
              dynamicStyles.tierButtonText(tier),
            ]}
          >
            Pick Another Tier
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            dynamicStyles.button,
            dynamicStyles.endButton,
            dynamicStyles.tierNavigationButton(tier),
          ]}
          onPress={() => navigation.navigate("End")}
        >
          <Text
            style={[
              dynamicStyles.buttonText,
              dynamicStyles.tierButtonText(tier),
            ]}
          >
            End Game
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Dare;
