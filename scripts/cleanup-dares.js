const admin = require("firebase-admin");

// Initialize Firebase Admin SDK with service account
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function cleanupDares() {
  try {
    console.log("Starting cleanup...");
    const daresRef = db.collection("dares");

    // Get all dares
    const snapshot = await daresRef.get();

    // Group dares by text and tier
    const dareGroups = {};
    snapshot.forEach((doc) => {
      const data = doc.data();
      const key = `${data.tier}:${data.text}`;
      if (!dareGroups[key]) {
        dareGroups[key] = [];
      }
      dareGroups[key].push({
        id: doc.id,
        ...data,
      });
    });

    // Delete duplicates and keep only one copy of each dare
    const batch = db.batch();
    let deletedCount = 0;

    for (const [key, dares] of Object.entries(dareGroups)) {
      if (dares.length > 1) {
        // Keep the first one, delete the rest
        console.log(`Found ${dares.length} copies of dare: ${key}`);
        for (let i = 1; i < dares.length; i++) {
          batch.delete(daresRef.doc(dares[i].id));
          deletedCount++;
        }
      }
    }

    // Commit the batch
    await batch.commit();
    console.log(`Cleanup complete. Deleted ${deletedCount} duplicate dares.`);
  } catch (error) {
    console.error("Error cleaning up dares:", error);
  } finally {
    admin.app().delete();
  }
}

cleanupDares();
