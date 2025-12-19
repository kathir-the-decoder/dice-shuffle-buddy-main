import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Gift } from "lucide-react";
import { soundEffects } from "@/lib/soundEffects";

interface ShuffleRevealProps {
  isActive: boolean;
  onComplete: () => void;
}

const ShuffleReveal = ({ isActive, onComplete }: ShuffleRevealProps) => {
  const [count, setCount] = useState(5);
  const hasPlayedReveal = useRef(false);

  useEffect(() => {
    if (!isActive) {
      setCount(5);
      hasPlayedReveal.current = false;
      return;
    }

    if (count > 0) {
      // Play countdown sound
      soundEffects.playCountdown(count);
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Play reveal sound only once
      if (!hasPlayedReveal.current) {
        hasPlayedReveal.current = true;
        soundEffects.playReveal();
      }
      setTimeout(onComplete, 500);
    }
  }, [isActive, count, onComplete]);

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="w-32 h-32 mx-auto mb-8 rounded-2xl flex items-center justify-center glow-red"
          style={{ background: 'var(--gradient-festive)' }}
        >
          <Gift size={64} className="text-foreground" />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={count}
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {count > 0 ? (
              <span className="font-display text-[150px] font-black gradient-text">
                {count}
              </span>
            ) : (
              <motion.p
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="font-display text-4xl font-bold gradient-text-gold"
              >
                Assigning Gifts!
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground mt-4"
        >
          Matching Secret Santas...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default ShuffleReveal;
