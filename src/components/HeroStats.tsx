import { motion } from 'framer-motion';
import { Coins, Users, Zap } from 'lucide-react';
import { BitcoinSymbol } from './BitcoinIcon';
import { formatSTX } from '@/lib/stacks';
import { useTips } from '@/hooks/useTips';
import { Skeleton } from '@/components/ui/skeleton';

export function HeroStats() {
  const { totalTipped, tipCount, contractBalance, isLoading } = useTips();

  const stats = [
    {
      label: 'Total Tipped',
      value: formatSTX(totalTipped),
      suffix: 'STX',
      icon: Coins,
      highlight: true,
    },
    {
      label: 'Total Tips',
      value: tipCount.toString(),
      suffix: '',
      icon: Users,
      highlight: false,
    },
    {
      label: 'Contract Balance',
      value: formatSTX(contractBalance),
      suffix: 'STX',
      icon: Zap,
      highlight: false,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="text-center py-12 md:py-20"
    >
      {/* Main Headline */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-8"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <motion.div
            animate={{ 
              y: [0, -5, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <BitcoinSymbol size={48} className="text-glow-intense" />
          </motion.div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">
            <span className="text-foreground">Tip the</span>{' '}
            <span className="gradient-text text-glow">Stacks Bitcoin Builder!</span>
          </h1>
          <motion.div
            animate={{ 
              y: [0, -5, 0],
              rotate: [0, -5, 5, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5
            }}
          >
            <BitcoinSymbol size={48} className="text-glow-intense" />
          </motion.div>
        </div>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Support Bitcoin innovation on Stacks. Every tip powers the future of decentralized finance.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className={`card-glow rounded-xl p-6 ${
              stat.highlight ? 'ring-2 ring-primary/50' : ''
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <stat.icon className={`w-5 h-5 ${stat.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="text-sm text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </span>
            </div>
            
            {isLoading ? (
              <Skeleton className="h-10 w-32 mx-auto" />
            ) : (
              <motion.div
                key={stat.value}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex items-baseline justify-center gap-2"
              >
                <span className={`text-3xl md:text-4xl font-bold ${
                  stat.highlight ? 'gradient-text text-glow' : 'text-foreground'
                }`}>
                  {stat.value}
                </span>
                {stat.suffix && (
                  <span className="text-lg text-muted-foreground">{stat.suffix}</span>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
