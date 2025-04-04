const admin = require("firebase-admin");

// Initialize Firebase Admin SDK with service account
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function verifyDares() {
  try {
    console.log("Fetching all dares...");
    const daresRef = db.collection("dares");
    const snapshot = await daresRef.get();

    if (snapshot.empty) {
      console.log("No dares found in the database!");
      return;
    }

    const daresByTier = {};

    snapshot.forEach((doc) => {
      const data = doc.data();
      const tier = data.tier;

      if (!daresByTier[tier]) {
        daresByTier[tier] = [];
      }

      daresByTier[tier].push({
        id: doc.id,
        ...data,
      });
    });

    console.log("\nDares by tier:");
    Object.entries(daresByTier).forEach(([tier, dares]) => {
      console.log(`\n${tier} (${dares.length} dares):`);
      dares.forEach((dare) => {
        console.log(`- ${dare.text} (ID: ${dare.id})`);
      });
    });
  } catch (error) {
    console.error("Error verifying dares:", error);
  } finally {
    admin.app().delete();
  }
}

verifyDares();
