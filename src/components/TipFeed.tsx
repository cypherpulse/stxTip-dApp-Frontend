import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Loader2, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TipCard } from './TipCard';
import { useTips } from '@/hooks/useTips';
import { BitcoinSymbol } from './BitcoinIcon';

export function TipFeed() {
  const { tips, isLoading, isRefetching, refresh } = useTips();
  const [newTipIds, setNewTipIds] = useState<Set<number>>(new Set());
  const [prevTipCount, setPrevTipCount] = useState(0);

  // Track new tips for animation
  useEffect(() => {
    if (tips.length > prevTipCount && prevTipCount > 0) {
      const newIds = new Set(tips.slice(0, tips.length - prevTipCount).map(t => t.id));
      setNewTipIds(newIds);
      setTimeout(() => setNewTipIds(new Set()), 3000);
    }
    setPrevTipCount(tips.length);
  }, [tips.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="card-glow">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <BitcoinSymbol size={24} className="text-glow" />
            <CardTitle className="text-xl">Recent Tips</CardTitle>
            <span className="text-sm text-muted-foreground">
              ({tips.length})
            </span>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              disabled={isRefetching}
              className="border-primary/50 hover:bg-primary/10"
            >
              {isRefetching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span className="ml-2 hidden sm:inline">Refresh</span>
            </Button>
          </motion.div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="card-glow rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : tips.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Inbox className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              </motion.div>
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No tips yet
              </h3>
              <p className="text-sm text-muted-foreground/70">
                Be the first to tip the builder!
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              <AnimatePresence mode="popLayout">
                {tips.map((tip, index) => (
                  <TipCard
                    key={tip.id}
                    tip={tip}
                    index={index}
                    isNew={newTipIds.has(tip.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Auto-refresh indicator */}
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border/50">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">
              Auto-refreshing every 20s
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
