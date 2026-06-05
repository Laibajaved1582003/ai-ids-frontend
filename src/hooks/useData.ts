import { useQuery } from '@tanstack/react-query';
import { getRecentFlows, getStats, getNetworkHealth, getFlowHistory } from '../api/flows';

export const useFlows = (interval = 3000) => {
  return useQuery({
    queryKey: ['recentFlows'],
    queryFn: getRecentFlows,
    refetchInterval: interval,
  });
};

export const useStats = (interval = 5000) => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
    refetchInterval: interval,
  });
};

export const useNetworkHealth = (interval = 10000) => {
  return useQuery({
    queryKey: ['networkHealth'],
    queryFn: getNetworkHealth,
    refetchInterval: interval,
  });
};

export const useFlowHistory = (params = {}) => {
  return useQuery({
    queryKey: ['flowHistory', params],
    queryFn: () => getFlowHistory(params),
  });
};
