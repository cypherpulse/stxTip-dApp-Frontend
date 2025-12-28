import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, LogOut, Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWallet } from '@/hooks/useWallet';
import { truncateAddress } from '@/lib/stacks';
import { useToast } from '@/hooks/use-toast';

// Small tweak for frontend update
export function WalletButton() {
  const { isConnected, address, isConnecting, connectWallet, disconnectWallet } = useWallet();
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    toast({
      title: 'Address copied!',
      description: 'Your wallet address has been copied to clipboard.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="outline" 
              className="border-primary/50 bg-primary/10 hover:bg-primary/20 gap-2"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="font-mono">{truncateAddress(address)}</span>
            </Button>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-card border-primary/30">
          <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
            {copied ? (
              <Check className="mr-2 h-4 w-4 text-green-500" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )}
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={`https://explorer.hiro.so/address/${address}?chain=testnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View on Explorer
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={disconnectWallet}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        onClick={connectWallet}
        disabled={isConnecting}
        className="btn-glow bg-primary hover:bg-primary-hover text-primary-foreground gap-2"
      >
        <AnimatePresence mode="wait">
          {isConnecting ? (
            <motion.div
              key="connecting"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Connecting...
            </motion.div>
          ) : (
            <motion.div
              key="connect"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
}
