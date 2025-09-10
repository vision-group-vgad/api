import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

// Head of Sales credentials
const SALES_USER = {
  email: 'headofsales@vision.com',
  password: 'hos@vision2025'
};

async function testSalesAPIs() {
  console.log('🏢 SALES DEPARTMENT API TEST');
  console.log('═'.repeat(60));
  console.log('👤 Testing as: Head of Sales');
  console.log('📧 Email:', SALES_USER.email);
  console.log('🎯 Testing all available Sales APIs\n');

  try {
    // Step 1: Authenticate
    console.log('🔐 Step 1: Authentication...');
    const loginResponse = await axios.post(`${BASE_URL}/api/v1/auth/login`, SALES_USER);
    const { token, role_code } = loginResponse.data;
    console.log('✅ Login successful');
    console.log('🔑 Token received');
    console.log('🏷️ Role Code:', role_code);

    const headers = {
      'Authorization': `Bearer ${token}`,
      'x-role-code': role_code,
      'Content-Type': 'application/json'
    };

    // Step 2: Test all Sales APIs
    console.log('\n📊 Step 2: Testing Sales APIs...');
    console.log('─'.repeat(60));

    // All Sales APIs from usermapping.json that head-of-sales should have access to
    const salesAPIs = [
      {
        name: 'Campaign ROI',
        endpoint: '/api/v1/sales/campaign-roi',
        description: 'Campaign return on investment analysis'
      },
      {
        name: 'Revenue Attribution (Range)',
        endpoint: '/api/v1/sales/revenue-attribution/in-range',
        description: 'Revenue attribution analysis for date range',
        params: '?start-date=2025-01-01&end-date=2025-12-31'
      },
      {
        name: 'Client Lifetime Value (Range)',
        endpoint: '/api/v1/sales/client-lifetime-value/in-range',
        description: 'Client lifetime value for date range',
        params: '?start-date=2025-01-01&end-date=2025-12-31'
      },
      {
        name: 'Supervisor Sales Analytics - Pipeline Velocity',
        endpoint: '/api/v1/sales/SupervisorSalesAnalytics/pipeline-velocity',
        description: 'Sales pipeline velocity metrics'
      },
      {
        name: 'Supervisor Sales Analytics - Revenue Forecast',
        endpoint: '/api/v1/sales/SupervisorSalesAnalytics/revenue-forecast',
        description: 'Revenue forecasting analytics'
      },
      {
        name: 'Supervisor Sales Analytics - Target Achievement',
        endpoint: '/api/v1/sales/SupervisorSalesAnalytics/target-achievement',
        description: 'Sales target achievement metrics'
      },
      {
        name: 'Conversion Funnels (Range)',
        endpoint: '/api/v1/sales/conversion-funnels/in-range',
        description: 'Conversion funnel analysis for date range',
        params: '?start-date=2025-01-01&end-date=2025-12-31'
      }
    ];

    let successCount = 0;
    let totalTests = salesAPIs.length;

    for (const [index, api] of salesAPIs.entries()) {
      console.log(`\n${index + 1}. Testing: ${api.name}`);
      console.log(`   📍 Endpoint: ${api.endpoint}`);
      console.log(`   📝 Description: ${api.description}`);
      
      try {
        const fullEndpoint = api.params ? `${api.endpoint}${api.params}` : api.endpoint;
        const response = await axios.get(`${BASE_URL}${fullEndpoint}`, { headers });
        console.log(`   ✅ SUCCESS - Status: ${response.status}`);
        
        if (response.data) {
          const data = response.data;
          if (Array.isArray(data)) {
            console.log(`   📊 Data Type: Array with ${data.length} records`);
            if (data.length > 0) {
              console.log(`   🔑 Sample Keys: ${Object.keys(data[0]).slice(0, 5).join(', ')}`);
            }
          } else if (typeof data === 'object') {
            console.log(`   📊 Data Type: Object`);
            console.log(`   🔑 Keys: ${Object.keys(data).slice(0, 5).join(', ')}`);
          }
        }
        successCount++;
        
      } catch (error) {
        console.log(`   ❌ FAILED - Status: ${error.response?.status || 'Unknown'}`);
        if (error.response?.data) {
          console.log(`   💬 Error: ${JSON.stringify(error.response.data, null, 2)}`);
        } else {
          console.log(`   💬 Error: ${error.message}`);
        }
      }
    }

    // Step 3: Test AI Natural Language Queries for Sales
    console.log('\n🤖 Step 3: Testing AI Natural Language Queries...');
    console.log('─'.repeat(60));

    const salesQuestions = [
      "What's our sales performance this quarter?",
      "Show me revenue attribution across channels",
      "How are our marketing campaigns performing?",
      "What's the client lifetime value analysis?",
      "Give me supervisor sales analytics",
      "What's our campaign ROI for this month?",
      "Show me sales conversion metrics",
      "How are we performing in different territories?"
    ];

    let aiSuccessCount = 0;

    for (const [index, question] of salesQuestions.entries()) {
      console.log(`\n${index + 1}. AI Question: "${question}"`);
      
      try {
        const startTime = Date.now();
        const response = await axios.post(`${BASE_URL}/api/v1/ai/query`, 
          { question }, 
          { 
            headers,
            timeout: 30000 // 30 second timeout for AI processing
          }
        );
        const duration = Date.now() - startTime;
        
        console.log(`   ✅ SUCCESS (${duration}ms)`);
        const result = response.data;
        console.log(`   🎯 Intent: ${result.intent}`);
        console.log(`   🏢 Department: ${result.department}`);
        console.log(`   📊 Confidence: ${Math.round((result.confidence || 0) * 100)}%`);
        
        if (result.data) {
          if (Array.isArray(result.data)) {
            console.log(`   📈 Data Records: ${result.data.length}`);
          } else {
            console.log(`   📈 Has Data: Yes`);
          }
        }
        
        if (result.insights && result.insights.length > 0) {
          console.log(`   💡 Insights: ${result.insights.slice(0, 2).join('; ')}`);
        }
        
        aiSuccessCount++;
        
      } catch (error) {
        console.log(`   ❌ FAILED - Status: ${error.response?.status || 'Unknown'}`);
        if (error.response?.status === 403) {
          console.log('   🔒 Access Denied - This may be expected for RBAC');
        } else if (error.response?.data) {
          console.log(`   💬 Error: ${JSON.stringify(error.response.data, null, 2)}`);
        } else {
          console.log(`   💬 Error: ${error.message}`);
        }
      }
    }

    // Results Summary
    console.log('\n' + '═'.repeat(60));
    console.log('📊 SALES DEPARTMENT TEST RESULTS');
    console.log('═'.repeat(60));
    console.log(`🎯 Direct API Tests: ${successCount}/${totalTests} (${Math.round((successCount/totalTests)*100)}%)`);
    console.log(`🤖 AI Query Tests: ${aiSuccessCount}/${salesQuestions.length} (${Math.round((aiSuccessCount/salesQuestions.length)*100)}%)`);
    console.log(`📈 Overall Success: ${successCount + aiSuccessCount}/${totalTests + salesQuestions.length} (${Math.round(((successCount + aiSuccessCount)/(totalTests + salesQuestions.length))*100)}%)`);
    
    if (successCount > 0) {
      console.log('\n✅ SALES APIs ARE WORKING!');
      console.log('💡 Head of Sales can access sales department data');
    }
    
    if (aiSuccessCount > 0) {
      console.log('✅ AI NATURAL LANGUAGE QUERIES ARE WORKING!');
      console.log('💡 Users can ask questions in natural language and get sales data');
    }

  } catch (error) {
    console.log('❌ Authentication failed:', error.response?.data || error.message);
  }
}

console.log('🚀 Starting Sales Department API Test...\n');
testSalesAPIs()
  .then(() => {
    console.log('\n🏁 Sales API Test Completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test Failed:', error.message);
    process.exit(1);
  });
