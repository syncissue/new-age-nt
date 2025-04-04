const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBxGXe52PvHF1TYbY0mEbqY6BBNsID3Qc0",
  authDomain: "my-firebase-project-749e6.firebaseapp.com",
  projectId: "my-firebase-project-749e6",
  storageBucket: "my-firebase-project-749e6.appspot.com",
  messagingSenderId: "91484643147",
  appId: "1:91484643147:web:0f1c0e3c1a4c5c1f5b5b5b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const spicerDares = [
  {
    text: "Give your best pickup line to the person next to you",
    tier: "Spicer",
  },
  {
    text: "Do your most dramatic soap opera scene",
    tier: "Spicer",
  },
  {
    text: "Show everyone your best dance move",
    tier: "Spicer",
  },
  {
    text: "Sing the chorus of your favorite song",
    tier: "Spicer",
  },
  {
    text: "Tell a funny joke with a straight face",
    tier: "Spicer",
  },
  {
    text: "Do your best celebrity impression",
    tier: "Spicer",
  },
  {
    text: "Make up a short rap about the person to your right",
    tier: "Spicer",
  },
  {
    text: "Act out your favorite movie scene",
    tier: "Spicer",
  },
  {
    text: "Do your best runway walk",
    tier: "Spicer",
  },
  {
    text: "Tell a story in a different accent",
    tier: "Spicer",
  },
];

async function addSpicerDares() {
  try {
    for (const dare of spicerDares) {
      await addDoc(collection(db, "dares"), dare);
      console.log(`Added dare: ${dare.text}`);
    }
    console.log("Successfully added all Spicer dares!");
  } catch (error) {
    console.error("Error adding dares:", error);
  }
}

addSpicerDares();
