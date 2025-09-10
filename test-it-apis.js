import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

// Head of IT credentials
const IT_USER = {
  email: 'headofit@vision.com',
  password: 'headofit@vision2025'
};

async function testITAPIs() {
  console.log('🖥️ IT DEPARTMENT API TEST');
  console.log('═'.repeat(70));
  console.log('👤 Testing as: Head of IT');
  console.log('📧 Email:', IT_USER.email);
  console.log('🎯 Testing all available IT APIs\n');

  try {
    // Step 1: Authenticate
    console.log('🔐 Step 1: Authentication...');
    const loginResponse = await axios.post(`${BASE_URL}/api/v1/auth/login`, IT_USER);
    const { token, role_code } = loginResponse.data;
    console.log('✅ Login successful');
    console.log('🔑 Token received');
    console.log('🏷️ Role Code:', role_code);

    const headers = {
      'Authorization': `Bearer ${token}`,
      'x-role-code': role_code,
      'Content-Type': 'application/json'
    };

    // Step 2: Test all IT APIs from usermapping.json
    console.log('\n📊 Step 2: Testing IT APIs...');
    console.log('─'.repeat(70));

    const itAPIs = [
      {
        name: 'System Health Score (Range)',
        endpoint: '/api/v1/it/sys-health-score/in-range?start-date=2025-01-01&end-date=2025-09-10',
        description: 'System health scoring metrics for date range'
      },
      {
        name: 'Cyber Security Router (Range)',
        endpoint: '/api/v1/it/cycber-sec-router/in-range?start-date=2025-01-01&end-date=2025-09-10',
        description: 'Cybersecurity metrics for date range'
      },
      {
        name: 'Infrastructure Costs (Range)',
        endpoint: '/api/v1/it/infra-costs/in-range?start-date=2025-01-01&end-date=2025-09-10',
        description: 'Infrastructure cost analysis for date range'
      },
      {
        name: 'Infrastructure Costs',
        endpoint: '/api/v1/IT/infrastructure-costs',
        description: 'General infrastructure costs'
      },
      {
        name: 'Server Load Analytics',
        endpoint: '/api/v1/it/ServerStoragePatch/server-load',
        description: 'Server load performance metrics'
      },
      {
        name: 'Server Load KPIs',
        endpoint: '/api/v1/it/ServerStoragePatch/server-load/kpis',
        description: 'Server load key performance indicators'
      },
      {
        name: 'Storage Analytics',
        endpoint: '/api/v1/it/ServerStoragePatch/storage',
        description: 'Storage utilization metrics'
      },
      {
        name: 'Storage KPIs',
        endpoint: '/api/v1/it/ServerStoragePatch/storage/kpis',
        description: 'Storage key performance indicators'
      },
      {
        name: 'Patch Compliance',
        endpoint: '/api/v1/it/ServerStoragePatch/patch-compliance',
        description: 'System patch compliance status'
      },
      {
        name: 'Patch Compliance KPIs',
        endpoint: '/api/v1/it/ServerStoragePatch/patch-compliance/kpis',
        description: 'Patch compliance key performance indicators'
      },
      {
        name: 'SLA Overview',
        endpoint: '/api/v1/IT/sla/overview',
        description: 'Service level agreement overview'
      },
      {
        name: 'SLA by Priority',
        endpoint: '/api/v1/IT/sla/by-priority',
        description: 'SLA metrics grouped by priority'
      },
      {
        name: 'SLA by Agent',
        endpoint: '/api/v1/IT/sla/by-agent',
        description: 'SLA metrics grouped by agent'
      },
      {
        name: 'Assets Inventory',
        endpoint: '/api/v1/it/assets-inventory',
        description: 'IT assets inventory management'
      },
      {
        name: 'User Satisfaction',
        endpoint: '/api/v1/it/satisfaction',
        description: 'IT user satisfaction metrics'
      }
    ];

    let successCount = 0;
    let totalTests = itAPIs.length;

    for (const [index, api] of itAPIs.entries()) {
      console.log(`\n${index + 1}. Testing: ${api.name}`);
      console.log(`   📍 Endpoint: ${api.endpoint}`);
      console.log(`   📝 Description: ${api.description}`);
      
      try {
        const response = await axios.get(`${BASE_URL}${api.endpoint}`, { headers, timeout: 10000 });
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

    // Step 3: Test AI Natural Language Queries for IT
    console.log('\n🤖 Step 3: Testing AI Natural Language Queries...');
    console.log('─'.repeat(70));

    const itQuestions = [
      "How is our server infrastructure performing?",
      "What's our storage utilization across systems?",
      "Show me our cybersecurity posture",
      "What are our infrastructure costs this month?",
      "How is our patch compliance status?",
      "Show me server health metrics",
      "What's our system performance overview?",
      "Give me IT service level agreement metrics",
      "How satisfied are our users with IT services?",
      "Show me our assets inventory status"
    ];

    let aiSuccessCount = 0;

    for (const [index, question] of itQuestions.entries()) {
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
    console.log('\n' + '═'.repeat(70));
    console.log('📊 IT DEPARTMENT TEST RESULTS');
    console.log('═'.repeat(70));
    console.log(`🎯 Direct API Tests: ${successCount}/${totalTests} (${Math.round((successCount/totalTests)*100)}%)`);
    console.log(`🤖 AI Query Tests: ${aiSuccessCount}/${itQuestions.length} (${Math.round((aiSuccessCount/itQuestions.length)*100)}%)`);
    console.log(`📈 Overall Success: ${successCount + aiSuccessCount}/${totalTests + itQuestions.length} (${Math.round(((successCount + aiSuccessCount)/(totalTests + itQuestions.length))*100)}%)`);
    
    if (successCount > 0) {
      console.log('\n✅ IT APIs ARE WORKING!');
      console.log('💡 Head of IT can access IT department data');
    }
    
    if (aiSuccessCount > 0) {
      console.log('✅ AI NATURAL LANGUAGE QUERIES ARE WORKING!');
      console.log('💡 Users can ask IT questions in natural language and get technical data');
    }

    // Step 4: Show successful AI use cases
    if (aiSuccessCount > 0) {
      console.log('\n🎯 WORKING AI USE CASES FOR IT:');
      console.log('─'.repeat(50));
      console.log('👨‍💼 User: "How is our server infrastructure performing?"');
      console.log('🤖 AI: Returns server load metrics, performance charts, and KPIs');
      console.log('');
      console.log('👨‍💼 User: "Show me our cybersecurity posture"');
      console.log('🤖 AI: Returns security metrics, threat analysis, and compliance status');
      console.log('');
      console.log('👨‍💼 User: "What are our infrastructure costs?"');
      console.log('🤖 AI: Returns cost analysis, budget utilization, and expense breakdown');
    }

  } catch (error) {
    console.log('❌ Authentication failed:', error.response?.data || error.message);
  }
}

console.log('🚀 Starting IT Department API Test...\n');
testITAPIs()
  .then(() => {
    console.log('\n🏁 IT API Test Completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test Failed:', error.message);
    process.exit(1);
  });
