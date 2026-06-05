import apiClient from './client';

export const getRecentFlows = async () => {
  const { data } = await apiClient.get('/flow/');
  return data;
};

export const getFlowHistory = async (params = {}) => {
  const { data } = await apiClient.get('/flow/history/', { params });
  return data;
};

export const getStats = async () => {
  const { data } = await apiClient.get('/stats/');
  return data;
};

export const getNetworkHealth = async () => {
  const { data } = await apiClient.get('/network-health/');
  return data;
};
