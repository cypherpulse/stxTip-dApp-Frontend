import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ArrowDownToLine, Loader2, Check, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useWallet } from '@/hooks/useWallet';
import { useTips } from '@/hooks/useTips';
import { isContractOwner, formatSTX } from '@/lib/stacks';
import { useToast } from '@/hooks/use-toast';
import { BitcoinSymbol } from './BitcoinIcon';

type WithdrawStatus = 'idle' | 'pending' | 'success' | 'error';

export function OwnerPanel() {
  const { isConnected, address, withdraw } = useWallet();
  const { contractBalance, refresh } = useTips();
  const { toast } = useToast();
  const [status, setStatus] = useState<WithdrawStatus>('idle');

  // Only show for contract owner
  if (!isConnected || !address || !isContractOwner(address)) {
    return null;
  }

  const handleWithdraw = async () => {
    setStatus('pending');
    
    try {
      const txId = await withdraw();
      setStatus('success');
      
      toast({
        title: '💰 Withdrawal initiated!',
        description: `Transaction submitted. TxID: ${txId.slice(0, 10)}...`,
      });

      setTimeout(() => {
        refresh();
        setStatus('idle');
      }, 3000);

    } catch (error) {
      setStatus('error');
      console.error('Withdraw error:', error);
      
      toast({
        title: 'Withdrawal failed',
        description: error instanceof Error ? error.message : 'Failed to withdraw',
        variant: 'destructive',
      });
      
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const hasBalance = contractBalance > BigInt(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <Card className="card-glow border-2 border-primary/50 relative overflow-hidden">
        {/* Owner badge */}
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
          <Shield className="w-3 h-3" />
          Owner
        </div>

        <CardHeader className="text-center">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <BitcoinSymbol size={40} className="mx-auto mb-2 text-glow-intense" />
          </motion.div>
          <CardTitle className="text-xl gradient-text">Contract Owner Panel</CardTitle>
          <CardDescription>
            Manage the tip jar contract
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Balance Display */}
          <div className="text-center p-4 bg-secondary/50 rounded-xl border border-primary/20">
            <div className="text-sm text-muted-foreground mb-1">Available Balance</div>
            <div className="text-3xl font-bold gradient-text text-glow">
              {formatSTX(contractBalance)} STX
            </div>
          </div>

          {/* Withdraw Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <motion.div
                whileHover={{ scale: hasBalance ? 1.02 : 1 }}
                whileTap={{ scale: hasBalance ? 0.98 : 1 }}
              >
                <Button
                  size="lg"
                  disabled={!hasBalance || status !== 'idle'}
                  className="w-full btn-glow bg-primary hover:bg-primary-hover text-primary-foreground h-14"
                >
                  <AnimatePresence mode="wait">
                    {status === 'idle' && (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <ArrowDownToLine className="w-5 h-5" />
                        Withdraw All Funds
                      </motion.span>
                    )}
                    {status === 'pending' && (
                      <motion.span
                        key="pending"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </motion.span>
                    )}
                    {status === 'success' && (
                      <motion.span
                        key="success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-green-400"
                      >
                        <Check className="w-5 h-5" />
                        Withdrawal Initiated!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </AlertDialogTrigger>
            
            <AlertDialogContent className="bg-card border-primary/30">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-primary" />
                  Confirm Withdrawal
                </AlertDialogTitle>
                <AlertDialogDescription>
                  You are about to withdraw <strong className="text-primary">{formatSTX(contractBalance)} STX</strong> from the tip jar contract to your wallet.
                  <br /><br />
                  This action will be submitted as a blockchain transaction.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleWithdraw}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                  Confirm Withdrawal
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {!hasBalance && (
            <p className="text-center text-sm text-muted-foreground">
              No funds available to withdraw
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
