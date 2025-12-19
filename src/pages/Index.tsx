import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Shuffle, TreePine, Users, UserPlus, Eye } from "lucide-react";
import SnowflakeBackground from "@/components/SnowflakeBackground";
import ShuffleReveal from "@/components/ShuffleReveal";
import PairResults from "@/components/PairResults";
import { soundEffects } from "@/lib/soundEffects";
import {
  updateGameState,
  subscribeToGameState,
  resetGame,
  GameState,
} from "@/lib/firebase";

interface Pair {
  giver: string;
  receiver: string;
}

type GamePhase = "joining" | "shuffling" | "reveal";

const MAX_PLAYERS = 40;

const Index = () => {
  const [players, setPlayers] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [showCountdown, setShowCountdown] = useState(false);
  const [pairs, setPairs] = useState<Pair[] | null>(null);
  const [gamePhase, setGamePhase] = useState<GamePhase>("joining");
  const [revealName, setRevealName] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminVerified, setIsAdminVerified] = useState(false);

  // Subscribe to Firebase real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToGameState((state: GameState | null) => {
      if (state) {
        setPlayers(state.players || []);
        setPairs(state.pairs || null);
        setGamePhase(state.gamePhase || "joining");
        setIsAdminVerified(state.isAdminVerified || false);
      } else {
        // No game state exists, initialize
        setPlayers([]);
        setPairs(null);
        setGamePhase("joining");
        setIsAdminVerified(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Check if kathir has joined
  const adminJoined = players.some((p) => p.toLowerCase() === "kathir");

  // Perfect derangement - each person gives to exactly one other person
  const createSecretSantaPairs = (participants: string[]): Pair[] => {
    const shuffled = [...participants];

    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.map((giver, i) => ({
      giver,
      receiver: shuffled[(i + 1) % shuffled.length],
    }));
  };

  // Sync state to Firebase
  const syncToFirebase = async (
    newPlayers: string[],
    newPairs: Pair[] | null,
    newPhase: GamePhase,
    newAdminVerified: boolean
  ) => {
    await updateGameState({
      players: newPlayers,
      pairs: newPairs,
      gamePhase: newPhase,
      isAdminVerified: newAdminVerified,
    });
  };

  const handleJoin = async () => {
    const trimmedName = currentInput.trim();
    const isDuplicate = players.some(
      (p) => p.toLowerCase() === trimmedName.toLowerCase()
    );

    if (trimmedName && !isDuplicate && players.length < MAX_PLAYERS) {
      soundEffects.playAdd();
      const newPlayers = [...players, trimmedName];
      setCurrentInput("");
      await syncToFirebase(newPlayers, pairs, gamePhase, isAdminVerified);
    }
  };

  const startShuffle = () => {
    if (players.length < 2) return;
    soundEffects.playShuffle();
    soundEffects.playUnwrap();
    setShowCountdown(true);
  };

  const handleShuffleComplete = useCallback(async () => {
    setShowCountdown(false);
    const newPairs = createSecretSantaPairs(players);
    await syncToFirebase(players, newPairs, "reveal", isAdminVerified);
  }, [players, isAdminVerified]);

  const handleReveal = () => {
    if (revealName.trim() && pairs) {
      const found = pairs.find(
        (p) => p.giver.toLowerCase() === revealName.trim().toLowerCase()
      );
      if (found) {
        soundEffects.playClick();
        setShowResult(true);
      }
    }
  };

  const handleReset = async () => {
    await resetGame();
    setRevealName("");
    setShowResult(false);
    setCurrentInput("");
    setAdminPassword("");
  };

  const handleBackToReveal = () => {
    setRevealName("");
    setShowResult(false);
  };

  const handleAdminVerify = async () => {
    if (adminPassword.toLowerCase() === "kathir") {
      await syncToFirebase(players, pairs, gamePhase, true);
    }
  };

  const isAdmin = revealName.trim().toLowerCase() === "kathir";
  const myPair = isAdmin
    ? pairs?.[0]
    : pairs?.find(
        (p) => p.giver.toLowerCase() === revealName.trim().toLowerCase()
      );

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <SnowflakeBackground />

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10"
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-4"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="w-14 h-14 rounded-xl flex items-center justify-center glow-red"
              style={{ background: "var(--gradient-festive)" }}
            >
              <Gift className="text-foreground" size={32} />
            </motion.div>
            <h1 className="font-display text-5xl md:text-7xl font-black gradient-text">
              Shuff
            </h1>
          </motion.div>

          <div className="flex items-center justify-center gap-2 mb-3">
            <TreePine className="text-secondary" size={20} />
            <p className="text-lg text-muted-foreground">
              Secret Santa Gift Exchange
            </p>
            <TreePine className="text-secondary" size={20} />
          </div>
        </motion.header>

        <div className="max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {gamePhase === "joining" && (
              <motion.div
                key="joining"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Join Section */}
                <motion.div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/20">
                      <UserPlus className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Join the Game</h3>
                      <p className="text-sm text-muted-foreground">
                        Enter your name to join
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mb-6">
                    <input
                      type="text"
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                      placeholder="Enter your name"
                      className="input-glass flex-1"
                      autoFocus
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleJoin}
                      disabled={
                        !currentInput.trim() || players.length >= MAX_PLAYERS
                      }
                      className={`btn-primary px-6 ${
                        !currentInput.trim() || players.length >= MAX_PLAYERS
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      Join
                    </motion.button>
                  </div>

                  {/* Player count - names hidden */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30">
                    <Users className="text-muted-foreground" size={20} />
                    <span className="text-muted-foreground">
                      {players.length}/{MAX_PLAYERS} player
                      {players.length !== 1 ? "s" : ""} joined
                    </span>
                  </div>

                  {/* Max players warning */}
                  {players.length >= MAX_PLAYERS && (
                    <p className="text-sm text-destructive mt-2">
                      Maximum {MAX_PLAYERS} players reached!
                    </p>
                  )}

                  {/* Show player numbers only */}
                  {players.length > 0 && (
                    <div className="mt-4 max-h-32 overflow-y-auto custom-scrollbar">
                      <div className="flex flex-wrap gap-2">
                        {players.map((_, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-medium"
                          >
                            Player {index + 1}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Shuffle Button - Only visible when kathir joined */}
                {adminJoined && (
                  <motion.div className="glass-card p-6 text-center">
                    <p className="text-muted-foreground mb-4">
                      {players.length < 2
                        ? `Need at least ${2 - players.length} more player${
                            2 - players.length > 1 ? "s" : ""
                          }`
                        : "All players joined? Let's shuffle!"}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={startShuffle}
                      disabled={players.length < 2}
                      className={`btn-primary w-full flex items-center justify-center gap-3 ${
                        players.length < 2
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <Shuffle size={24} />
                      Shuffle & Assign!
                    </motion.button>
                  </motion.div>
                )}

                {/* Message for non-admin users */}
                {!adminJoined && players.length >= 2 && (
                  <motion.div className="glass-card p-6 text-center">
                    <p className="text-muted-foreground">
                      Waiting for admin (kathir) to start the shuffle...
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {gamePhase === "reveal" && !showResult && (
              <motion.div
                key="reveal-login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-8 text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center glow-gold"
                  style={{ background: "var(--gradient-gold)" }}
                >
                  <Eye size={40} className="text-background" />
                </motion.div>

                <h2 className="font-display text-3xl font-bold gradient-text mb-2">
                  Shuffle Complete!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Enter your name to see who you're giving a gift to
                </p>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={revealName}
                    onChange={(e) => setRevealName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleReveal()}
                    placeholder="Enter your name"
                    className="input-glass w-full"
                    autoFocus
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReveal}
                    disabled={!revealName.trim()}
                    className={`btn-primary w-full flex items-center justify-center gap-3 ${
                      !revealName.trim() ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Eye size={20} />
                    See My Match
                  </motion.button>
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                  Only you will see your result
                </p>
              </motion.div>
            )}

            {gamePhase === "reveal" && showResult && myPair && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <PairResults
                  pairs={pairs!}
                  currentUserName={revealName}
                  isAdmin={isAdmin}
                  onReset={handleReset}
                  onShuffleAgain={handleBackToReveal}
                />
              </motion.div>
            )}

            {gamePhase === "reveal" && showResult && !myPair && (
              <motion.div
                key="not-found"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-8 text-center"
              >
                <p className="text-destructive mb-4">
                  Name not found! Make sure you entered the same name you used
                  to join.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBackToReveal}
                  className="btn-secondary"
                >
                  Try Again
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showCountdown && (
          <ShuffleReveal
            isActive={showCountdown}
            onComplete={handleShuffleComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
