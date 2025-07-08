// Quick test to verify we're getting real CMC data
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

async function testRealDataFetch() {
  console.log('=== Testing Real CMC Data Fetch ===');
  
  try {
    // Test with a date range that should have data (August 2021)
    const response = await axios.get('http://localhost:4000/api/v1/finance/close-metrics?startDate=2021-08-01&endDate=2021-08-31');
    
    console.log('✅ Finance API Response:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
    // Test raw CMC API directly
    const cmcResponse = await axios.get(`${process.env.CMC_API_BASE_URL}/bc-datasets/2021-08-01/2021-08-31`, {
      headers: {
        'Authorization': `Bearer ${process.env.CMC_API_BEARER_TOKEN}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('\n✅ Direct CMC API Response:');
    console.log('Status:', cmcResponse.status);
    console.log('Data count:', cmcResponse.data.data?.length || 0);
    console.log('Sample data:', JSON.stringify(cmcResponse.data.data?.[0], null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testRealDataFetch();
