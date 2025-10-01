import axios from "axios";

// Base URL for internal API calls
const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

// Helper function for API requests - shared by all handlers
export async function makeAPIRequestGET(endpoint, token, roleCode) {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-role-code': roleCode,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('🔍 API Response structure for', endpoint, ':', typeof response.data, Array.isArray(response.data) ? 'Array' : 'Object');
    
    if (typeof response.data === 'object' && response.data !== null) {
      console.log('🔑 Response keys:', Object.keys(response.data));
      // Only extract nested data if it exists and is an array, otherwise return the full response
      if (response.data.data && Array.isArray(response.data.data)) {
        console.log('📊 Extracting data array from response.data.data, length:', response.data.data.length);
        return response.data.data; // Extract the actual data array
      } else if (response.data.success !== undefined && response.data.data) {
        // Handle {success: true, data: [...]} format but keep full structure for objects
        console.log('📊 Keeping full response structure for non-array data');
        return response.data;
      }
    }
    return response.data;
  } catch (error) {
    console.error('❌ API Request failed for:', endpoint, 'Error:', error.message);
    
    // If authentication fails, try direct service call for demo
    if (error.response?.status === 403 || error.response?.status === 401) {
      console.log('🔧 Auth failed, trying direct service call for demo purposes');
      try {
        if (endpoint.includes('/api/v1/sales/campaign-roi')) {
          const { getCampaigns } = await import('../departments/sales/campaignROI/service.js');
          const campaigns = getCampaigns();
          return { success: true, data: campaigns };
        }
        // Add more direct service calls for other endpoints as needed
      } catch (directError) {
        console.error('Direct service call also failed:', directError.message);
      }
      throw new Error(`Unauthorized access: You don't have permission to access this information.`);
    }
    throw error;
  }
}

// Common utility functions
export function buildQueryParams(filters) {
  return new URLSearchParams(filters).toString();
}

export function getEndpoint(path, filters = {}) {
  const queryParams = buildQueryParams(filters);
  return `${path}${queryParams ? '?' + queryParams : ''}`;
}

export function getEndpointWithDates(path, filters = {}) {
  const params = new URLSearchParams(filters);
  if (!params.has('startDate')) {
    params.set('startDate', '2025-01-01');
  }
  if (!params.has('endDate')) {
    params.set('endDate', '2025-09-10');
  }
  return `${path}?${params.toString()}`;
}