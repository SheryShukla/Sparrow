
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2CBj4jqaA79QqYiYlWYajM-uaRKlf2Ss",
  authDomain: "a-website-like-twitter-8c70a.firebaseapp.com",
  projectId: "a-website-like-twitter-8c70a",
  storageBucket: "a-website-like-twitter-8c70a.firebasestorage.app",
  messagingSenderId: "410202651659",
  appId: "1:410202651659:web:0831bf4d361570f14f5b0e",
  measurementId: "G-43CNCQ3KGN"
};

const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export default app
// const analytics = getAnalytics(app);
