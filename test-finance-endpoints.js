// Test finance endpoints with real CMC data
import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/v1/finance';

console.log('=== Testing Finance Endpoints with Real CMC Data ===');

async function testFinanceEndpoints() {
  const endpoints = [
    {
      name: 'Financial Close Metrics',
      url: `${BASE_URL}/close-metrics`,
      description: 'Get financial close metrics'
    },
    {
      name: 'Financial Close Metrics with Date Range',
      url: `${BASE_URL}/close-metrics?startDate=2021-08-01&endDate=2021-08-31`,
      description: 'Get financial close metrics for August 2021'
    },
    {
      name: 'Audit Trail Analysis',
      url: `${BASE_URL}/audit-trail`,
      description: 'Get audit trail analysis'
    },
    {
      name: 'Audit Trail with Invoice Filter',
      url: `${BASE_URL}/audit-trail?documentType=Invoice`,
      description: 'Get audit trail for invoices only'
    },
    {
      name: 'Reporting Accuracy',
      url: `${BASE_URL}/reporting-accuracy`,
      description: 'Get reporting accuracy metrics'
    },
    {
      name: 'Chart Data - Line',
      url: `${BASE_URL}/chart-data?chartType=line&startDate=2021-08-01&endDate=2021-08-31`,
      description: 'Get line chart data for August 2021'
    },
    {
      name: 'Chart Data - Bar',
      url: `${BASE_URL}/chart-data?chartType=bar&startDate=2021-08-01&endDate=2021-08-31`,
      description: 'Get bar chart data for August 2021'
    }
  ];

  for (const endpoint of endpoints) {
    console.log(`\n--- Testing: ${endpoint.name} ---`);
    console.log(`URL: ${endpoint.url}`);
    console.log(`Description: ${endpoint.description}`);
    
    try {
      const response = await axios.get(endpoint.url, {
        timeout: 30000 // 30 second timeout
      });
      
      console.log('✅ Success!');
      console.log('Status:', response.status);
      console.log('Data preview:', JSON.stringify(response.data, null, 2).substring(0, 500) + '...');
      
      // Check if we got real data or dummy data
      if (response.data && response.data.length > 0) {
        console.log('📊 Data count:', response.data.length);
      } else if (response.data && typeof response.data === 'object') {
        console.log('📊 Data type:', typeof response.data);
        console.log('📊 Keys:', Object.keys(response.data));
      }
      
    } catch (error) {
      console.log('❌ Failed:');
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Status Text:', error.response.statusText);
        console.log('Response:', JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        console.log('Network Error:', error.message);
      } else {
        console.log('Error:', error.message);
      }
    }
  }
}

// Run the tests
testFinanceEndpoints().catch(console.error);
