import { motion } from "framer-motion";
import { Gift, ArrowRight, RotateCcw, Users, Shield } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import { soundEffects } from "@/lib/soundEffects";

interface Pair {
  giver: string;
  receiver: string;
}

interface PairResultsProps {
  pairs: Pair[];
  currentUserName: string;
  isAdmin?: boolean;
  onReset: () => void;
  onShuffleAgain: () => void;
}

const PairResults = ({
  pairs,
  currentUserName,
  isAdmin = false,
  onReset,
  onShuffleAgain,
}: PairResultsProps) => {
  const myPair = pairs.find(
    (pair) => pair.giver.toLowerCase() === currentUserName.toLowerCase()
  );
  useEffect(() => {
    // Play celebration sounds
    soundEffects.playCelebration();
    setTimeout(() => soundEffects.playJingleBells(), 1000);
    
    // Trigger confetti on mount
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const colors = ['#e63946', '#2d6a4f', '#ffd700', '#ffffff'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const handleReset = () => {
    soundEffects.playClick();
    onReset();
  };

  const handleReshuffle = () => {
    soundEffects.playClick();
    onShuffleAgain();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center glow-gold"
          style={{ background: "var(--gradient-gold)" }}
        >
          {isAdmin ? (
            <Shield size={40} className="text-background" />
          ) : (
            <Gift size={40} className="text-background" />
          )}
        </motion.div>
        <h2 className="font-display text-4xl md:text-5xl font-black gradient-text-gold mb-2">
          {isAdmin ? "Admin View" : "Your Secret Santa!"}
        </h2>
        <p className="text-muted-foreground">
          {isAdmin
            ? "Full access - All pairs visible"
            : "Here's who you're giving a gift to"}
        </p>
      </motion.div>

      {/* Admin view - show all pairs */}
      {isAdmin ? (
        <div className="space-y-3">
          {pairs.map((pair, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="pair-card"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 text-center">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                    Giver
                  </p>
                  <p className="font-bold text-lg text-foreground truncate">
                    {pair.giver}
                  </p>
                </div>

                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex-shrink-0"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: "var(--gradient-festive)" }}
                  >
                    <ArrowRight size={20} className="text-foreground" />
                  </div>
                </motion.div>

                <div className="flex-1 text-center">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                    Receiver
                  </p>
                  <p className="font-bold text-lg text-accent truncate">
                    {pair.receiver}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Single user result */
        myPair && (
          <motion.div
            initial={{ opacity: 0, y: 30, rotateY: -90 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 0.5 }}
            onAnimationStart={() => {
              soundEffects.playSparkle();
            }}
            className="pair-card max-w-md mx-auto"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 text-center">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                  You
                </p>
                <p className="font-bold text-lg text-foreground truncate">
                  {myPair.giver}
                </p>
              </div>

              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex-shrink-0"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: "var(--gradient-festive)" }}
                >
                  <ArrowRight size={24} className="text-foreground" />
                </div>
              </motion.div>

              <div className="flex-1 text-center">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                  Give gift to
                </p>
                <p className="font-bold text-lg text-accent truncate">
                  {myPair.receiver}
                </p>
              </div>
            </div>
          </motion.div>
        )
      )}

      {/* Actions - Only admin can see Next Person button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
      >
        {isAdmin && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReshuffle}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Users size={20} />
            Next Person
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className={`${isAdmin ? "btn-secondary" : "btn-primary"} flex items-center justify-center gap-2`}
        >
          <RotateCcw size={20} />
          New Game
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default PairResults;
