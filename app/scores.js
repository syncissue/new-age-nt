import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

export default function Scores({ navigation }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchScores = async () => {
    try {
      const db = getFirestore();
      const scoresRef = collection(db, "scores");
      const q = query(scoresRef, orderBy("points", "desc")); // Sort by points in descending order
      const querySnapshot = await getDocs(q);

      const scoreData = [];
      querySnapshot.forEach((doc) => {
        scoreData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setScores(scoreData);
    } catch (error) {
      console.error("Error fetching scores:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchScores();
  };

  useEffect(() => {
    fetchScores();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading scores...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard 🏆</Text>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007AFF"]}
          />
        }
      >
        {scores.length === 0 ? (
          <Text style={styles.noScoresText}>No scores yet. Start playing!</Text>
        ) : (
          scores.map((score, index) => (
            <View key={score.id} style={styles.scoreCard}>
              <View style={styles.rankContainer}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>
              <View style={styles.scoreInfo}>
                <Text style={styles.playerName}>{score.playerName}</Text>
                <Text style={styles.points}>{score.points} points</Text>
                <Text style={styles.timestamp}>
                  Last updated:{" "}
                  {new Date(score.lastUpdated).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back to Game</Text>
      </TouchableOpacity>
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
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  scrollView: {
    flex: 1,
  },
  scoreCard: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  rankText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  scoreInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  points: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  noScoresText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  backButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
