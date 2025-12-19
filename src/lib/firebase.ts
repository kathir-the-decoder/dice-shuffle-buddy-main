import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, remove } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmrpYF50RH-VzCws69qwdyZeEMzsvZXH0",
  authDomain: "dice-shuffle-buddy-main.firebaseapp.com",
  databaseURL: "https://dice-shuffle-buddy-main-default-rtdb.firebaseio.com",
  projectId: "dice-shuffle-buddy-main",
  storageBucket: "dice-shuffle-buddy-main.firebasestorage.app",
  messagingSenderId: "1093334948376",
  appId: "1:1093334948376:web:8f5f4ad5bf258ce43f816d",
  measurementId: "G-EFEXJKWYJ7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Game room reference
const gameRef = ref(database, "secretSantaGame");

export interface GameState {
  players: string[];
  pairs: { giver: string; receiver: string }[] | null;
  gamePhase: "joining" | "shuffling" | "reveal";
  isAdminVerified: boolean;
}

// Update game state
export const updateGameState = async (state: GameState) => {
  await set(gameRef, state);
};

// Listen to game state changes
export const subscribeToGameState = (callback: (state: GameState | null) => void) => {
  return onValue(gameRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};

// Reset game
export const resetGame = async () => {
  await remove(gameRef);
};

export { database, gameRef };
