import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getLatestTips, 
  getTipCount, 
  getTotalTipped, 
  getContractBalance,
  Tip 
} from '@/lib/stacks';

const POLLING_INTERVAL = 20000; // 20 seconds

export function useTips() {
  const queryClient = useQueryClient();

  const tipsQuery = useQuery({
    queryKey: ['tips'],
    queryFn: () => getLatestTips(30),
    refetchInterval: POLLING_INTERVAL,
    staleTime: 10000,
  });

  const tipCountQuery = useQuery({
    queryKey: ['tipCount'],
    queryFn: getTipCount,
    refetchInterval: POLLING_INTERVAL,
    staleTime: 10000,
  });

  const totalTippedQuery = useQuery({
    queryKey: ['totalTipped'],
    queryFn: getTotalTipped,
    refetchInterval: POLLING_INTERVAL,
    staleTime: 10000,
  });

  const contractBalanceQuery = useQuery({
    queryKey: ['contractBalance'],
    queryFn: getContractBalance,
    refetchInterval: POLLING_INTERVAL,
    staleTime: 10000,
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['tips'] });
    queryClient.invalidateQueries({ queryKey: ['tipCount'] });
    queryClient.invalidateQueries({ queryKey: ['totalTipped'] });
    queryClient.invalidateQueries({ queryKey: ['contractBalance'] });
  };

  return {
    tips: tipsQuery.data ?? [],
    tipCount: tipCountQuery.data ?? BigInt(0),
    totalTipped: totalTippedQuery.data ?? BigInt(0),
    contractBalance: contractBalanceQuery.data ?? BigInt(0),
    isLoading: tipsQuery.isLoading || tipCountQuery.isLoading || totalTippedQuery.isLoading,
    isRefetching: tipsQuery.isRefetching,
    error: tipsQuery.error || tipCountQuery.error || totalTippedQuery.error,
    refresh,
  };
}
