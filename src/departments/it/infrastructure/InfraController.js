// infrastructure/infraController.js

// Controller to get CPU & Memory utilization trends
export const getCpuMemoryTrends = (req, res) => {
  const sampleData = [
    { month: 'Jan', location: 'HQ', cpu: 40, memory: 70 },
    { month: 'Feb', location: 'HQ', cpu: 55, memory: 68 },
    { month: 'Mar', location: 'HQ', cpu: 60, memory: 80 },
    { month: 'Jan', location: 'Branch A', cpu: 35, memory: 60 },
    { month: 'Feb', location: 'Branch A', cpu: 50, memory: 65 },
    { month: 'Mar', location: 'Branch A', cpu: 53, memory: 66 },
  ];

  res.status(200).json({ success: true, data: sampleData });
};

// Controller to get latency trends
export const getLatencyTrends = (req, res) => {
  const latencyData = [
    { month: 'Jan', location: 'HQ', latency: 20 },
    { month: 'Feb', location: 'HQ', latency: 35 },
    { month: 'Mar', location: 'HQ', latency: 30 },
    { month: 'Jan', location: 'Branch A', latency: 45 },
    { month: 'Feb', location: 'Branch A', latency: 40 },
    { month: 'Mar', location: 'Branch A', latency: 38 },
  ];

  res.status(200).json({ success: true, data: latencyData });
};

// Controller to get asset inventory status
export const getAssetStatus = (req, res) => {
  const statusData = [
    { status: 'Active', count: 120 },
    { status: 'Under Maintenance', count: 25 },
    { status: 'Decommissioned', count: 10 },
  ];

  res.status(200).json({ success: true, data: statusData });
};
