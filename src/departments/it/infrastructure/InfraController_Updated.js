// infrastructure/infraController.js
// Updated controller to use real API service

import InfrastructureService from './InfraService.js';

// Controller to get CPU & Memory utilization trends
export const getCpuMemoryTrends = async (req, res) => {
  try {
    const data = await InfrastructureService.getCpuMemoryTrends();
    res.status(200).json({ success: true, data });
  } catch (error) {
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch CPU and memory trends',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Controller to get latency trends
export const getLatencyTrends = async (req, res) => {
  try {
    const data = await InfrastructureService.getLatencyTrends();
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching latency trends:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch latency trends',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Controller to get asset inventory status
export const getAssetStatus = async (req, res) => {
  try {
    const data = await InfrastructureService.getAssetStatus();
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching asset status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch asset status',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
