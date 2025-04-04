import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const DareScreen = ({ navigation, route }) => {
  const { tier } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dare goes here</Text>
      <Text style={styles.tierText}>Tier: {tier}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("TierSelection")}
        >
          <Text style={styles.buttonText}>Pick Another Tier</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("End")}
        >
          <Text style={styles.buttonText}>End Game</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 10,
  },
  tierText: {
    fontSize: 18,
    marginBottom: 30,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
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

export default DareScreen;
