import { motion } from "framer-motion";
import { useMemo } from "react";

const SnowflakeBackground = () => {
  const snowflakes = useMemo(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 10,
      size: 4 + Math.random() * 8,
      opacity: 0.2 + Math.random() * 0.4,
    })), []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute rounded-full bg-foreground"
          style={{
            left: `${flake.left}%`,
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
          }}
          initial={{ y: -20 }}
          animate={{
            y: "100vh",
            x: [0, 30, -30, 0],
          }}
          transition={{
            y: {
              duration: flake.duration,
              repeat: Infinity,
              delay: flake.delay,
              ease: "linear",
            },
            x: {
              duration: flake.duration / 2,
              repeat: Infinity,
              delay: flake.delay,
              ease: "easeInOut",
            },
          }}
        />
      ))}
      
      {/* Festive gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: 'hsl(0 75% 55%)' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -50, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: 'hsl(150 60% 35%)' }}
      />
    </div>
  );
};

export default SnowflakeBackground;
