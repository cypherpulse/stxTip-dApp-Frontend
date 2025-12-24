import { STACKS_TESTNET } from '@stacks/network';
import {
  uintCV,
  stringAsciiCV,
  cvToValue,
  ClarityValue,
  OptionalCV,
  TupleCV,
  serializeCV,
  deserializeCV,
  fetchCallReadOnlyFunction,
} from '@stacks/transactions';

// Contract Configuration
export const CONTRACT_ADDRESS = 'STGDS0Y17973EN5TCHNHGJJ9B31XWQ5YXBQ0KQ2Y';
export const CONTRACT_NAME = 'tip-jar';
export const CONTRACT_OWNER = 'STGDS0Y17973EN5TCHNHGJJ9B31XWQ5YXBQ0KQ2Y';

// Network Configuration - Using Testnet
export const NETWORK = STACKS_TESTNET;
export const NETWORK_NAME = 'testnet';

// API endpoints
export const API_BASE_URL = 'https://api.testnet.hiro.so';

// Contract function names
export const FUNCTIONS = {
  TIP: 'tip',
  WITHDRAW: 'withdraw',
  GET_CONTRACT_BALANCE: 'get-contract-balance',
  GET_OWNER: 'get-owner',
  GET_TIP: 'get-tip',
  GET_TIP_COUNT: 'get-tip-count',
  GET_TOTAL_TIPPED: 'get-total-tipped',
} as const;

// Type definitions for tip data
export interface Tip {
  id: number;
  tipper: string;
  amount: bigint;
  message: string;
  blockHeight: bigint;
}

// Convert microSTX to STX
export function microToSTX(microSTX: bigint | number): number {
  return Number(microSTX) / 1_000_000;
}

// Convert STX to microSTX
export function stxToMicro(stx: number): bigint {
  return BigInt(Math.floor(stx * 1_000_000));
}

// Format STX amount with proper decimals
export function formatSTX(microSTX: bigint | number): string {
  const stx = microToSTX(typeof microSTX === 'bigint' ? microSTX : BigInt(microSTX));
  return stx.toLocaleString(undefined, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 6 
  });
}

// Truncate Stacks address for display
export function truncateAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Build function arguments for tip
export function buildTipArgs(amountMicro: bigint, message: string): ClarityValue[] {
  return [
    uintCV(amountMicro),
    stringAsciiCV(message),
  ];
}

// Parse tip response from contract
export function parseTipResponse(cv: OptionalCV<TupleCV>): Tip | null {
  const value = cvToValue(cv);
  if (!value) return null;
  
  return {
    id: 0, // Will be set by caller
    tipper: value.tipper,
    amount: BigInt(value.amount),
    message: value.message,
    blockHeight: BigInt(value['block-height']),
  };
}

// Make read-only call to contract
export async function callReadOnly<T>(
  functionName: string,
  args: ClarityValue[] = []
): Promise<T> {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName,
      functionArgs: args,
      network: STACKS_TESTNET,
      senderAddress: CONTRACT_ADDRESS,
    });
    
    return cvToValue(result) as T;
  } catch (error) {
    console.error(`Error calling ${functionName}:`, error);
    throw error;
  }
}

// Get contract balance
export async function getContractBalance(): Promise<bigint> {
  const result = await callReadOnly<string>(FUNCTIONS.GET_CONTRACT_BALANCE);
  return BigInt(result);
}

// Get tip count
export async function getTipCount(): Promise<bigint> {
  const result = await callReadOnly<string>(FUNCTIONS.GET_TIP_COUNT);
  return BigInt(result);
}

// Get total tipped
export async function getTotalTipped(): Promise<bigint> {
  const result = await callReadOnly<string>(FUNCTIONS.GET_TOTAL_TIPPED);
  return BigInt(result);
}

// Get tip by ID
export async function getTipById(id: number): Promise<Tip | null> {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: FUNCTIONS.GET_TIP,
      functionArgs: [uintCV(id)],
      network: STACKS_TESTNET,
      senderAddress: CONTRACT_ADDRESS,
    });
    
    const value = cvToValue(result);
    
    if (!value || value === null) return null;

    return {
      id,
      tipper: value.tipper,
      amount: BigInt(value.amount),
      message: value.message,
      blockHeight: BigInt(value['block-height']),
    };
  } catch (error) {
    console.error(`Error fetching tip ${id}:`, error);
    return null;
  }
}

// Get latest tips
export async function getLatestTips(count: number = 30): Promise<Tip[]> {
  try {
    const tipCount = await getTipCount();
    const totalTips = Number(tipCount);
    
    if (totalTips === 0) return [];

    const startId = Math.max(1, totalTips - count + 1);
    const tipPromises: Promise<Tip | null>[] = [];

    for (let i = totalTips; i >= startId; i--) {
      tipPromises.push(getTipById(i));
    }

    const tips = await Promise.all(tipPromises);
    return tips.filter((tip): tip is Tip => tip !== null);
  } catch (error) {
    console.error('Error fetching tips:', error);
    return [];
  }
}

// Check if address is contract owner
export function isContractOwner(address: string): boolean {
  return address === CONTRACT_OWNER;
}
