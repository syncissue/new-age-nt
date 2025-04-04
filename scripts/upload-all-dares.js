const admin = require("firebase-admin");

// Initialize Firebase Admin SDK with service account
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const allDares = {
  Spicer: [
    "Give your best pickup line to the person next to you",
    "Do your most dramatic soap opera scene",
    "Show everyone your best dance move",
    "Sing the chorus of your favorite song",
    "Tell a funny joke with a straight face",
    "Do your best celebrity impression",
    "Make up a short rap about the person to your right",
    "Act out your favorite movie scene",
    "Do your best runway walk",
    "Tell a story in a different accent",
  ],
};

async function uploadAllDares() {
  try {
    const batch = db.batch();
    const daresRef = db.collection("dares");

    // Add Spicer dares
    for (const dareText of allDares.Spicer) {
      const docRef = daresRef.doc(); // Auto-generated document ID
      batch.set(docRef, {
        text: dareText,
        tier: "Spicer",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

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

uploadAllDares();
