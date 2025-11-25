import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, push, update, remove, get, child, onDisconnect } from "firebase/database";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/setup#config-object

const firebaseConfig = {
    apiKey: "AIzaSyDRQHHm2P17PCD29J-GM7RbevWaEwp9Bxc",
    authDomain: "tictactoe-7fea7.firebaseapp.com",
    databaseURL: "https://tictactoe-7fea7-default-rtdb.firebaseio.com",
    projectId: "tictactoe-7fea7",
    storageBucket: "tictactoe-7fea7.firebasestorage.app",
    messagingSenderId: "250246429154",
    appId: "1:250246429154:web:0881b618dc5dc5c4cda1bb",
    measurementId: "G-KV7YYQ6VJK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, onValue, push, update, remove, get, child, onDisconnect };
