import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
import { firebaseConfig } from "./firebaseConfig";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const old = firebase.initializeApp(
  {
    ...firebaseConfig,
    databaseURL:
      "https://sy-order-default-rtdb.asia-southeast1.firebasedatabase.app",
  },
  "old"
);

export const wel = firebase.initializeApp(
  {
    ...firebaseConfig,
    databaseURL:
      "https://sy-order-default-rtdb.asia-southeast1.firebasedatabase.app",
  },
  "wel"
);
//firebase.analytics();

export default firebase;
