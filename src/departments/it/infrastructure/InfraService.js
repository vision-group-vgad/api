// infrastructure/infraService.js
// Service layer for Business Central API integration

import axios from 'axios';

class InfrastructureService {
  constructor() {
    // Business Central API configuration
    this.baseURL = 'https://ims-vgad.visiongroup.co.ug/api'; // Update with actual API base URL
    this.credentials = {
      username: 'intern-developer@newvision.co.ug',
      password: '45!3@Vgad2025'
    };
    
    // Create axios instance with default config
    this.apiClient = axios.create({
      baseURL: this.baseURL,
      timeout: 10000, // 10 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add authentication interceptor
    this.setupAuthentication();
  }

  setupAuthentication() {
    // Add authentication to every request
    this.apiClient.interceptors.request.use((config) => {
      // You might need to implement different auth methods:
      // Option 1: Basic Auth
      const token = Buffer.from(`${this.credentials.username}:${this.credentials.password}`).toString('base64');
      config.headers.Authorization = `Basic ${token}`;
      
      // Option 2: Bearer Token (if they provide JWT)
      // config.headers.Authorization = `Bearer ${this.getAuthToken()}`;
      
      return config;
    });

    // Handle response errors
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        
        throw error;
      }
    );
  }

  // Method to fetch CPU and Memory trends from Business Central
  async getCpuMemoryTrends() {
    try {
      // TODO: Replace with actual Business Central endpoint
      const response = await this.apiClient.get('/infrastructure/cpu-memory-trends');
      
      // Transform the data to match your frontend expectations
      return this.transformCpuMemoryData(response.data);
    } catch (error) {
      // Fallback to dummy data during development
      
      return this.getDummyCpuMemoryData();
    }
  }

  // Method to fetch latency trends
  async getLatencyTrends() {
    try {
      // TODO: Replace with actual Business Central endpoint
      const response = await this.apiClient.get('/infrastructure/latency-trends');
      return this.transformLatencyData(response.data);
    } catch (error) {
      
      return this.getDummyLatencyData();
    }
  }

  // Method to fetch asset status
  async getAssetStatus() {
    try {
      // TODO: Replace with actual Business Central endpoint
      const response = await this.apiClient.get('/infrastructure/asset-status');
      return this.transformAssetData(response.data);
    } catch (error) {
      
      return this.getDummyAssetData();
    }
  }

  // Data transformation methods
  transformCpuMemoryData(apiData) {
    // Transform Business Central data format to your API format
    // This will depend on what structure Business Central returns
    return apiData.map(item => ({
      month: item.period || item.month,
      location: item.site || item.location,
      cpu: parseFloat(item.cpuUtilization || item.cpu),
      memory: parseFloat(item.memoryUtilization || item.memory)
    }));
  }

  transformLatencyData(apiData) {
    return apiData.map(item => ({
      month: item.period || item.month,
      location: item.site || item.location,
      latency: parseFloat(item.networkLatency || item.latency)
    }));
  }

  transformAssetData(apiData) {
    return apiData.map(item => ({
      status: item.assetStatus || item.status,
      count: parseInt(item.assetCount || item.count)
    }));
  }

  // Fallback dummy data methods
  getDummyCpuMemoryData() {
    return [
      { month: 'Jan', location: 'HQ', cpu: 40, memory: 70 },
      { month: 'Feb', location: 'HQ', cpu: 55, memory: 68 },
      { month: 'Mar', location: 'HQ', cpu: 60, memory: 80 },
      { month: 'Jan', location: 'Branch A', cpu: 35, memory: 60 },
      { month: 'Feb', location: 'Branch A', cpu: 50, memory: 65 },
      { month: 'Mar', location: 'Branch A', cpu: 53, memory: 66 },
    ];
  }

  getDummyLatencyData() {
    return [
      { month: 'Jan', location: 'HQ', latency: 20 },
      { month: 'Feb', location: 'HQ', latency: 35 },
      { month: 'Mar', location: 'HQ', latency: 30 },
      { month: 'Jan', location: 'Branch A', latency: 45 },
      { month: 'Feb', location: 'Branch A', latency: 40 },
      { month: 'Mar', location: 'Branch A', latency: 38 },
    ];
  }

  getDummyAssetData() {
    return [
      { status: 'Active', count: 120 },
      { status: 'Under Maintenance', count: 25 },
      { status: 'Decommissioned', count: 10 },
    ];
  }
}

export default new InfrastructureService();
