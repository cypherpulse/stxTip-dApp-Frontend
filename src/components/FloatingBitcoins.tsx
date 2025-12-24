import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BitcoinSymbol } from './BitcoinIcon';

interface FloatingBitcoin {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

export function FloatingBitcoins() {
  const [bitcoins, setBitcoins] = useState<FloatingBitcoin[]>([]);

  useEffect(() => {
    const generateBitcoins = () => {
      const newBitcoins: FloatingBitcoin[] = [];
      const count = 15;

      for (let i = 0; i < count; i++) {
        newBitcoins.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 16 + Math.random() * 32,
          delay: Math.random() * 5,
          duration: 6 + Math.random() * 4,
          opacity: 0.05 + Math.random() * 0.1,
        });
      }
      setBitcoins(newBitcoins);
    };

    generateBitcoins();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {bitcoins.map((bitcoin) => (
        <motion.div
          key={bitcoin.id}
          className="absolute"
          style={{
            left: `${bitcoin.x}%`,
            top: `${bitcoin.y}%`,
            opacity: bitcoin.opacity,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: bitcoin.duration,
            delay: bitcoin.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <BitcoinSymbol 
            size={bitcoin.size} 
            className="text-primary opacity-50" 
          />
        </motion.div>
      ))}

      {/* Large decorative Bitcoin icons */}
      <motion.div
        className="absolute -left-20 top-1/4 opacity-[0.03]"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <BitcoinSymbol size={300} />
      </motion.div>

      <motion.div
        className="absolute -right-20 bottom-1/4 opacity-[0.03]"
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      >
        <BitcoinSymbol size={400} />
      </motion.div>
    </div>
  );
}
