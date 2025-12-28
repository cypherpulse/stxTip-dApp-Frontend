import { motion } from 'framer-motion';
import { ExternalLink, MessageSquare } from 'lucide-react';
import { BitcoinSymbol } from './BitcoinIcon';
import { Tip, formatSTX, truncateAddress } from '@/lib/stacks';

// Small tweak for frontend update
interface TipCardProps {
  tip: Tip;
  index: number;
  isNew?: boolean;
}

export function TipCard({ tip, index, isNew = false }: TipCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05,
        ease: 'easeOut'
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`card-glow rounded-xl p-4 relative overflow-hidden ${
        isNew ? 'glow-pulse ring-2 ring-primary' : ''
      }`}
    >
      {/* Amount Badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.div
            animate={isNew ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5, repeat: isNew ? 2 : 0 }}
          >
            <BitcoinSymbol size={20} className="text-glow" />
          </motion.div>
          <span className="text-xl font-bold gradient-text">
            {formatSTX(tip.amount)} STX
          </span>
        </div>

        <a
          href={`https://explorer.hiro.so/address/${tip.tipper}?chain=testnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
          title="View on Explorer"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Tipper Address */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-xs font-bold text-primary-foreground">
          {tip.tipper.slice(2, 4).toUpperCase()}
        </div>
        <span className="font-mono text-sm text-muted-foreground">
          {truncateAddress(tip.tipper)}
        </span>
      </div>

      {/* Message */}
      {tip.message && tip.message !== 'No message' && (
        <div className="bg-secondary/50 rounded-lg p-3 border border-border/50">
          <div className="flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground/90 break-words">
              {tip.message}
            </p>
          </div>
        </div>
      )}

      {/* Block Height */}
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Tip #{tip.id}</span>
        <span>Block #{tip.blockHeight.toString()}</span>
      </div>

      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-primary/10 to-transparent pointer-events-none" />
    </motion.div>
  );
}
