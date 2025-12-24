import { motion } from 'framer-motion';
import { BitcoinSymbol } from './BitcoinIcon';
import { WalletButton } from './WalletButton';
import { Badge } from '@/components/ui/badge';

export function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-primary/20"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatDelay: 3 
              }}
            >
              <BitcoinSymbol size={40} className="text-glow" />
            </motion.div>
            
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-bold gradient-text">
                Stacks Tip Jar
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Bitcoin L2 Energy ⚡
              </p>
            </div>
          </motion.div>

          {/* Network Badge + Wallet */}
          <div className="flex items-center gap-3">
            <Badge 
              variant="outline" 
              className="border-primary/50 text-primary bg-primary/10 hidden sm:flex"
            >
              <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
              Testnet
            </Badge>
            
            <WalletButton />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
