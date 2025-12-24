import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Check, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BitcoinSymbol } from './BitcoinIcon';
import { useWallet } from '@/hooks/useWallet';
import { useTips } from '@/hooks/useTips';
import { useToast } from '@/hooks/use-toast';

type TxStatus = 'idle' | 'pending' | 'success' | 'error';

export function TipForm() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [txStatus, setTxStatus] = useState<TxStatus>('idle');
  const [txId, setTxId] = useState<string | null>(null);
  
  const { isConnected, sendTip, connectWallet } = useWallet();
  const { refresh } = useTips();
  const { toast } = useToast();

  const triggerConfetti = () => {
    const colors = ['#FF5C00', '#FF3D00', '#FF8A00', '#FFA500'];
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors,
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
    }, 200);

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
    }, 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      connectWallet();
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid STX amount greater than 0.',
        variant: 'destructive',
      });
      return;
    }

    if (message.length > 280) {
      toast({
        title: 'Message too long',
        description: 'Message must be 280 characters or less.',
        variant: 'destructive',
      });
      return;
    }

    setTxStatus('pending');
    
    try {
      const txHash = await sendTip(amountNum, message || 'No message');
      setTxId(txHash);
      setTxStatus('success');
      triggerConfetti();
      
      toast({
        title: '🎉 Tip sent!',
        description: `You tipped ${amountNum} STX. Transaction submitted!`,
      });

      // Reset form
      setAmount('');
      setMessage('');
      
      // Refresh tips after a delay
      setTimeout(() => {
        refresh();
        setTxStatus('idle');
        setTxId(null);
      }, 3000);

    } catch (error) {
      setTxStatus('error');
      console.error('Tip error:', error);
      toast({
        title: 'Transaction failed',
        description: error instanceof Error ? error.message : 'Failed to send tip',
        variant: 'destructive',
      });
      
      setTimeout(() => setTxStatus('idle'), 3000);
    }
  };

  const presetAmounts = [1, 5, 10, 25];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="card-glow overflow-hidden">
        <CardHeader className="text-center pb-4">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <BitcoinSymbol size={32} className="mx-auto mb-2 text-glow" />
          </motion.div>
          <CardTitle className="text-2xl gradient-text">Send a Tip</CardTitle>
          <CardDescription>
            Support the builder with some STX
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Input */}
            <div className="space-y-3">
              <Label htmlFor="amount" className="text-foreground">
                Amount (STX)
              </Label>
              
              {/* Preset buttons */}
              <div className="flex gap-2">
                {presetAmounts.map((preset) => (
                  <motion.button
                    key={preset}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAmount(preset.toString())}
                    className={`flex-1 py-2 px-3 rounded-lg border transition-all ${
                      amount === preset.toString()
                        ? 'border-primary bg-primary/20 text-primary'
                        : 'border-border bg-secondary hover:border-primary/50'
                    }`}
                  >
                    {preset} STX
                  </motion.button>
                ))}
              </div>

              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  step="0.000001"
                  min="0"
                  placeholder="Enter custom amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-input border-border focus:border-primary text-lg pr-14"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  STX
                </span>
              </div>
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="message" className="text-foreground">
                  Message (optional)
                </Label>
                <span className={`text-xs ${
                  message.length > 280 ? 'text-destructive' : 'text-muted-foreground'
                }`}>
                  {message.length}/280
                </span>
              </div>
              <Textarea
                id="message"
                placeholder="Leave a message for the builder..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={280}
                rows={3}
                className="bg-input border-border focus:border-primary resize-none"
              />
            </div>

            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: txStatus === 'idle' ? 1.02 : 1 }}
              whileTap={{ scale: txStatus === 'idle' ? 0.98 : 1 }}
            >
              <Button
                type="submit"
                size="lg"
                disabled={txStatus !== 'idle'}
                className="w-full btn-glow bg-primary hover:bg-primary-hover text-primary-foreground h-14 text-lg font-semibold"
              >
                <AnimatePresence mode="wait">
                  {txStatus === 'idle' && (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      {isConnected ? 'Send Tip ₿' : 'Connect Wallet to Tip'}
                    </motion.span>
                  )}
                  {txStatus === 'pending' && (
                    <motion.span
                      key="pending"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </motion.span>
                  )}
                  {txStatus === 'success' && (
                    <motion.span
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-green-400"
                    >
                      <Check className="w-5 h-5" />
                      Tip Sent! 🎉
                    </motion.span>
                  )}
                  {txStatus === 'error' && (
                    <motion.span
                      key="error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-destructive"
                    >
                      <AlertCircle className="w-5 h-5" />
                      Failed - Try Again
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

            {/* Transaction Link */}
            <AnimatePresence>
              {txId && txStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-center"
                >
                  <a
                    href={`https://explorer.hiro.so/txid/${txId}?chain=testnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    View transaction on Explorer →
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
