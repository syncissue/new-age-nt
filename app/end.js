import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function End({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Night's over</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("TierSelection")}
      >
        <Text style={styles.buttonText}>Play Again</Text>
      </TouchableOpacity>
    </View>
  );
}

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
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
