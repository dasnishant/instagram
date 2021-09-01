import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDghgOgm9BP9SBr1jx8KsM-4xHeP9qrFjo",
  authDomain: "instagram-92f71.firebaseapp.com",
  projectId: "instagram-92f71",
  storageBucket: "instagram-92f71.appspot.com",
  messagingSenderId: "801632615032",
  appId: "1:801632615032:web:1432c16ef01ac1aae40b8d",
};

firebase.initializeApp(firebaseConfig);
const firebaseAuth = firebase.auth();
const firestore = firebase.firestore();

export { firebaseAuth, firestore };
