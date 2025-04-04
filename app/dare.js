import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxGXe52PvHF1TYbY0mEbqY6BBNsID3Qc0",
  authDomain: "my-firebase-project-749e6.firebaseapp.com",
  projectId: "my-firebase-project-749e6",
  storageBucket: "my-firebase-project-749e6.appspot.com",
  messagingSenderId: "91484643147",
  appId: "1:91484643147:web:0f1c0e3c1a4c5c1f5b5b5b",
};

// Initialize Firebase (only if not already initialized)
let app;
let db;
try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export default function Dare({ route, navigation }) {
  const { tier } = route.params;
  const [dare, setDare] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Check if Firebase is initialized
  useEffect(() => {
    if (!app || !db) {
      setError("Firebase not initialized properly");
      setLoading(false);
      return;
    }
    setInitialized(true);
  }, []);

  const fetchDare = useCallback(async () => {
    if (!initialized) {
      console.error("Firebase not initialized yet");
      setError("App not initialized properly");
      setLoading(false);
      return;
    }

    try {
      console.log("Starting to fetch dare for tier:", tier);
      setLoading(true);
      setError(null);

      if (!tier) {
        throw new Error("No tier selected");
      }

      const daresRef = collection(db, "dares");
      const q = query(daresRef, where("tier", "==", tier));
      console.log("Executing Firestore query for tier:", tier);

      const querySnapshot = await getDocs(q);
      console.log("Query complete. Found documents:", querySnapshot.size);

      if (querySnapshot.empty) {
        console.log("No dares found for tier:", tier);
        throw new Error(`No dares found for tier: ${tier}`);
      }

      // Get random dare from the tier
      const dares = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        console.log("Dare document:", { id: doc.id, ...data });
        return {
          id: doc.id,
          ...data,
        };
      });

      if (!dares.length) {
        throw new Error("No valid dares found");
      }

      console.log("Total dares found:", dares.length);
      const randomDare = dares[Math.floor(Math.random() * dares.length)];
      console.log("Selected random dare:", randomDare);

      if (!randomDare || !randomDare.text) {
        throw new Error("Invalid dare data received");
      }

      setDare(randomDare);
      setError(null);
    } catch (err) {
      console.error("Error fetching dare:", err);
      console.error("Error details:", {
        code: err.code,
        message: err.message,
        stack: err.stack,
      });
      setError(err.message || "Failed to load dare");
      setDare(null);
    } finally {
      setLoading(false);
    }
  }, [tier, initialized]);

  useEffect(() => {
    console.log("Dare component mounted/updated with tier:", tier);
    if (initialized && tier) {
      fetchDare();
    }
  }, [tier, fetchDare, initialized]);

  if (!initialized) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Initializing app...</Text>
      </View>
    );
  }

  if (!tier) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No tier selected</Text>
        <TouchableOpacity
          style={[styles.button, styles.tierButton]}
          onPress={() => navigation.navigate("TierSelection")}
        >
          <Text style={styles.buttonText}>Select Tier</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading dare...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={[styles.button, styles.tierButton]}
          onPress={() => navigation.navigate("TierSelection")}
        >
          <Text style={styles.buttonText}>Try Different Tier</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.dareContainer}>
        <Text style={styles.tierText}>Tier: {tier}</Text>
        <Text style={styles.dareText}>{dare?.text || "No dare available"}</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Points: {dare?.points || 0}</Text>
          <Text style={styles.statsText}>Duration: {dare?.duration || 0}s</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.nextButton]}
          onPress={fetchDare}
        >
          <Text style={styles.buttonText}>Next Dare</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.tierButton]}
          onPress={() => navigation.navigate("TierSelection")}
        >
          <Text style={styles.buttonText}>Pick Another Tier</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.endButton]}
          onPress={() => navigation.navigate("End")}
        >
          <Text style={styles.buttonText}>End Game</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  statsText: {
    fontSize: 18,
    color: "#666",
    fontWeight: "500",
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
  nextButton: {
    backgroundColor: "#007AFF",
  },
  tierButton: {
    backgroundColor: "#5856D6",
  },
  endButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
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
});
