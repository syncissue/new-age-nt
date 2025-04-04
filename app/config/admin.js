// This file is only used in admin scripts, not in the client app
import * as admin from "firebase-admin";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Check if running in admin context
const isAdminContext = process.env.ADMIN_ENABLED === "true";

let adminApp;
let adminDb;

if (isAdminContext) {
  try {
    // Initialize admin SDK with environment variables
    adminApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        privateKey: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        clientEmail: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
      }),
    });
    adminDb = adminApp.firestore();
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
    adminDb = null;
  }
}

export { adminApp, adminDb };
