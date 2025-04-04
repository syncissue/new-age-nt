import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const tiers = ["Spicer", "Wild", "Extreme", "Dark Finale"];

const TierSelectionScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pick a tier</Text>
      {tiers.map((tier) => (
        <TouchableOpacity
          key={tier}
          style={styles.button}
          onPress={() => navigation.navigate("Dare", { tier })}
        >
          <Text style={styles.buttonText}>{tier}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default TierSelectionScreen;
