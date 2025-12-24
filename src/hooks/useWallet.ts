import { useState, useCallback, useEffect } from 'react';
import { 
  connect as stacksConnect, 
  request, 
  disconnect as stacksDisconnect, 
  isConnected, 
  getLocalStorage 
} from '@stacks/connect';
import { STACKS_TESTNET } from '@stacks/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME, FUNCTIONS, stxToMicro, buildTipArgs } from '@/lib/stacks';
import { PostConditionMode } from '@stacks/transactions';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  isConnecting: boolean;
  error: string | null;
}

interface UseWalletReturn extends WalletState {
  connectWallet: () => void;
  disconnectWallet: () => void;
  sendTip: (amountSTX: number, message: string) => Promise<string>;
  withdraw: () => Promise<string>;
}

export function useWallet(): UseWalletReturn {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    address: null,
    isConnecting: false,
    error: null,
  });

  // Check for existing session on mount
  useEffect(() => {
    if (isConnected()) {
      const localData = getLocalStorage();
      if (localData?.addresses?.stx?.[0]?.address) {
        setState({
          isConnected: true,
          address: localData.addresses.stx[0].address,
          isConnecting: false,
          error: null,
        });
      }
    }
  }, []);

  const connectWallet = useCallback(async () => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      // First establish connection which triggers wallet modal
      await stacksConnect();
      
      // After connection, get addresses using request
      const response = await request({}, 'getAddresses');
      
      // Parse the addresses from response
      const addresses = (response as any)?.addresses;
      
      if (addresses && addresses.length > 0) {
        // Find the Stacks address
        const stxAddress = addresses.find((addr: any) => 
          addr.symbol === 'STX' || addr.address?.startsWith('SP') || addr.address?.startsWith('ST')
        );
        
        if (stxAddress?.address) {
          setState({
            isConnected: true,
            address: stxAddress.address,
            isConnecting: false,
            error: null,
          });
        } else {
          // Fallback to localStorage
          const localData = getLocalStorage();
          if (localData?.addresses?.stx?.[0]?.address) {
            setState({
              isConnected: true,
              address: localData.addresses.stx[0].address,
              isConnecting: false,
              error: null,
            });
          } else {
            setState(prev => ({ 
              ...prev, 
              isConnecting: false,
              error: 'Failed to get wallet address'
            }));
          }
        }
      } else {
        setState(prev => ({ 
          ...prev, 
          isConnecting: false,
          error: 'No addresses returned from wallet'
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Connection failed'
      }));
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    stacksDisconnect(); // Clears local storage and selected wallet
    setState({
      isConnected: false,
      address: null,
      isConnecting: false,
      error: null,
    });
  }, []);

  const sendTip = useCallback(async (amountSTX: number, message: string): Promise<string> => {
    if (!state.isConnected) {
      throw new Error('Wallet not connected');
    }

    if (!state.address) {
      throw new Error('No wallet address available');
    }

    const amountMicro = stxToMicro(amountSTX);
    
    try {
      const response = await request({}, 'stx_callContract', {
        contract: `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`,
        functionName: FUNCTIONS.TIP,
        functionArgs: buildTipArgs(amountMicro, message),
        network: 'testnet',
        postConditionMode: PostConditionMode.Allow,
      });
      return response.txid;
    } catch (error) {
      console.error('Tip transaction error:', error);
      throw new Error(error instanceof Error ? error.message : 'Transaction failed');
    }
  }, [state.isConnected, state.address]);

  const withdraw = useCallback(async (): Promise<string> => {
    if (!state.isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      const response = await request({}, 'stx_callContract', {
        contract: `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`,
        functionName: FUNCTIONS.WITHDRAW,
        functionArgs: [],
        network: 'testnet',
        postConditionMode: PostConditionMode.Allow,
      });
      return response.txid;
    } catch (error) {
      console.error('Withdraw transaction error:', error);
      throw new Error(error instanceof Error ? error.message : 'Transaction failed');
    }
  }, [state.isConnected]);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    sendTip,
    withdraw,
  };
}
