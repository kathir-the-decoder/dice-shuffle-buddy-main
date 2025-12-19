import { motion } from "framer-motion";
import { X, Plus, Users } from "lucide-react";
import { soundEffects } from "@/lib/soundEffects";

interface NameInputSectionProps {
  names: string[];
  onNamesChange: (names: string[]) => void;
}

const NameInputSection = ({ names, onNamesChange }: NameInputSectionProps) => {
  const addName = () => {
    soundEffects.playAdd();
    onNamesChange([...names, ""]);
  };

  const removeName = (index: number) => {
    soundEffects.playRemove();
    const newNames = names.filter((_, i) => i !== index);
    onNamesChange(newNames);
  };

  const updateName = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    onNamesChange(newNames);
  };

  return (
    <motion.section
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/20">
          <Users className="text-primary" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Participants</h3>
          <p className="text-sm text-muted-foreground">Add everyone joining the gift exchange</p>
        </div>
      </div>

      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
        {names.map((name, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.03 }}
            className="flex items-center gap-3"
          >
            <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-secondary/20 text-secondary text-sm font-bold flex-shrink-0">
              {index + 1}
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => updateName(index, e.target.value)}
              placeholder={`Player ${index + 1}`}
              className="input-glass flex-1"
            />
            {names.length > 2 && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeName(index)}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors flex-shrink-0"
              >
                <X size={18} />
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={addName}
        className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-accent/30 text-accent/70 hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        <span>Add Participant ({names.length} added)</span>
      </motion.button>
    </motion.section>
  );
};

export default NameInputSection;
