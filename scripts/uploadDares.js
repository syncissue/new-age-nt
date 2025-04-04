const admin = require("firebase-admin");
const dares = require("./dares.json");

// Initialize Firebase Admin SDK
// Replace with your service account key file path
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function uploadDares() {
  try {
    const batch = db.batch();
    const daresRef = db.collection("dares");

    // Add each dare to the batch
    dares.dares.forEach((dare, index) => {
      const docRef = daresRef.doc(); // Auto-generated document ID
      batch.set(docRef, {
        ...dare,
        id: docRef.id, // Store the document ID in the data
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    // Commit the batch
    await batch.commit();
    console.log("Successfully uploaded all dares to Firestore!");
  } catch (error) {
    console.error("Error uploading dares:", error);
  } finally {
    // Clean up
    admin.app().delete();
  }
}

async function verifyDares() {
  try {
    const daresRef = db.collection("dares");
    const snapshot = await daresRef.get();

    console.log(`Total dares in database: ${snapshot.size}`);

    // Display sample data from each tier
    const tiers = ["Spicer", "Wild", "Extreme", "Dark Finale"];
    for (const tier of tiers) {
      const tierSnapshot = await daresRef.where("tier", "==", tier).get();
      console.log(`\n${tier} dares: ${tierSnapshot.size}`);

      // Show first dare from each tier
      if (!tierSnapshot.empty) {
        const firstDare = tierSnapshot.docs[0].data();
        console.log("Sample dare:", {
          text: firstDare.text,
          points: firstDare.points,
          duration: firstDare.duration,
        });
      }
    }
  } catch (error) {
    console.error("Error verifying dares:", error);
  } finally {
    admin.app().delete();
  }
}

uploadDares();
verifyDares();
