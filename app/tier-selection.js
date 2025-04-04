import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TIERS = {
  Spicer: {
    unlockTime: 40 * 60 * 1000, // 40 minutes
    color: "#4CAF50",
    description: "Start with some light fun",
  },
  Wild: {
    unlockTime: 40 * 60 * 1000, // 40 minutes
    color: "#FF9800",
    description: "Things are getting interesting",
  },
  Extreme: {
    unlockTime: 90 * 60 * 1000, // 90 minutes
    color: "#F44336",
    description: "Not for the faint of heart",
  },
  "Dark Finale": {
    unlockTime: 130 * 60 * 1000, // 130 minutes
    color: "#9C27B0",
    description: "The ultimate challenge",
  },
};

const TierTab = ({
  tier,
  unlocked,
  timeRemaining,
  onPress,
  progress,
  color,
  description,
}) => {
  const progressAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [progress]);

  const formattedTime = () => {
    if (timeRemaining <= 0) return "";
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <TouchableOpacity
      style={[styles.tierTab, { borderColor: color }]}
      onPress={() => {
        if (!unlocked) {
          Alert.alert(
            "Tier Locked",
            `This tier will unlock in ${formattedTime()}. Complete previous tiers first!`
          );
          return;
        }
        onPress(tier);
      }}
      activeOpacity={unlocked ? 0.7 : 1}
    >
      <View style={styles.tierContent}>
        <View style={styles.tierHeader}>
          <Text style={[styles.tierName, { color }]}>{tier}</Text>
          {!unlocked && (
            <View style={styles.lockContainer}>
              <MaterialIcons name="lock" size={20} color={color} />
              <Text style={[styles.timeRemaining, { color }]}>
                {formattedTime()}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.description}>{description}</Text>
        <View
          style={[
            styles.progressBarContainer,
            { backgroundColor: `${color}30` },
          ]}
        >
          <Animated.View
            style={[
              styles.progressBar,
              {
                transform: [
                  {
                    scaleX: progressAnimation.interpolate({
                      inputRange: [0, 100],
                      outputRange: [0, 1],
                      extrapolate: "clamp",
                    }),
                  },
                ],
                backgroundColor: color,
              },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function TierSelection({ navigation }) {
  const [gameStartTime] = useState(new Date());
  const [unlockedTiers, setUnlockedTiers] = useState({ Spicer: true });
  const [timeRemaining, setTimeRemaining] = useState({});
  const [progress, setProgress] = useState({
    Spicer: 100,
    Wild: 0,
    Extreme: 0,
    "Dark Finale": 0,
  });
  const [titleTaps, setTitleTaps] = useState(0);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Load admin mode state on component mount
  useEffect(() => {
    const loadAdminMode = async () => {
      try {
        const adminMode = await AsyncStorage.getItem("adminMode");
        if (adminMode === "true") {
          setIsAdminMode(true);
          unlockAllTiers();
        }
      } catch (error) {
        console.error("Error loading admin mode:", error);
      }
    };
    loadAdminMode();
  }, []);

  const unlockAllTiers = () => {
    const allUnlocked = {
      Spicer: true,
      Wild: true,
      Extreme: true,
      "Dark Finale": true,
    };
    setUnlockedTiers(allUnlocked);
    setProgress({
      Spicer: 100,
      Wild: 100,
      Extreme: 100,
      "Dark Finale": 100,
    });
  };

  const handleTitlePress = async () => {
    const newTaps = titleTaps + 1;
    setTitleTaps(newTaps);

    if (newTaps === 5) {
      // Activate after 5 taps
      setTitleTaps(0);
      const newAdminMode = !isAdminMode;
      setIsAdminMode(newAdminMode);

      try {
        await AsyncStorage.setItem("adminMode", newAdminMode.toString());
        if (newAdminMode) {
          unlockAllTiers();
          Alert.alert("Admin Mode", "All tiers unlocked! 🎉");
        } else {
          // Reset to default state
          setUnlockedTiers({ Spicer: true });
          setProgress({
            Spicer: 100,
            Wild: 0,
            Extreme: 0,
            "Dark Finale": 0,
          });
          Alert.alert("Admin Mode", "Admin mode disabled");
        }
      } catch (error) {
        console.error("Error saving admin mode:", error);
      }
    }
  };

  useEffect(() => {
    if (!isAdminMode) {
      const interval = setInterval(() => {
        const currentTime = new Date();
        const elapsedTime = currentTime - gameStartTime;

        const newUnlockedTiers = { ...unlockedTiers };
        const newTimeRemaining = {};
        const newProgress = { ...progress };

        Object.entries(TIERS).forEach(([tierName, tierData]) => {
          const timeLeft = Math.max(0, tierData.unlockTime - elapsedTime);
          newTimeRemaining[tierName] = timeLeft;

          if (timeLeft === 0) {
            newUnlockedTiers[tierName] = true;
          }

          // Calculate progress percentage
          const tierProgress = Math.min(
            100,
            ((tierData.unlockTime - timeLeft) / tierData.unlockTime) * 100
          );
          newProgress[tierName] = tierName === "Spicer" ? 100 : tierProgress;
        });

        setUnlockedTiers(newUnlockedTiers);
        setTimeRemaining(newTimeRemaining);
        setProgress(newProgress);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameStartTime, isAdminMode]);

  const handleTierPress = (tier) => {
    if (unlockedTiers[tier]) {
      navigation.navigate("Dare", { tier });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleTitlePress}>
        <Text style={styles.title}>
          Select Your Tier {isAdminMode ? "🔓" : ""}
        </Text>
      </TouchableOpacity>
      <View style={styles.tiersContainer}>
        {Object.entries(TIERS).map(([tierName, tierData]) => (
          <TierTab
            key={tierName}
            tier={tierName}
            unlocked={unlockedTiers[tierName]}
            timeRemaining={timeRemaining[tierName]}
            onPress={handleTierPress}
            progress={progress[tierName]}
            color={tierData.color}
            description={tierData.description}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  tiersContainer: {
    gap: 20,
  },
  tierTab: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tierContent: {
    gap: 10,
  },
  tierHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tierName: {
    fontSize: 24,
    fontWeight: "600",
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  lockContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeRemaining: {
    fontSize: 16,
    fontWeight: "500",
  },
  progressBarContainer: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 5,
    backgroundColor: "#f0f0f0",
  },
  progressBar: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    borderRadius: 3,
    transform: [{ scaleX: 0 }], // Initial scale
  },
});
