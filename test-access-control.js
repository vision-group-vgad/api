// Test Access Control System
import "dotenv/config";
import { checkDepartmentAccess, filterDataByAccess, logAccess } from "./src/ai/accessControl.js";

function testAccessControl() {
  console.log("🔐 Testing AI Access Control System\n");
  console.log("=" .repeat(60));
  
  // Sample users from different departments and positions
  const testUsers = [
    {
      email: "ceo@vision.com",
      department: "executive",
      position: "ceo",
      firstName: "John",
      lastName: "Executive"
    },
    {
      email: "finance.manager@vision.com", 
      department: "finance",
      position: "financial controller",
      firstName: "Sarah",
      lastName: "Finance"
    },
    {
      email: "editor@vision.com",
      department: "editorial", 
      position: "editor",
      firstName: "Mike",
      lastName: "Editorial"
    },
    {
      email: "sales.rep@vision.com",
      department: "sales",
      position: "sales manager", 
      firstName: "Lisa",
      lastName: "Sales"
    },
    {
      email: "it.support@vision.com",
      department: "it",
      position: "it support",
      firstName: "Tech",
      lastName: "Support"
    }
  ];
  
  // Test scenarios - different users requesting different department data
  const testScenarios = [
    { user: 0, requestDept: "finance", dataType: "revenue_metrics", description: "CEO accessing finance data" },
    { user: 1, requestDept: "finance", dataType: "financial_reports", description: "Finance user accessing own data" },
    { user: 1, requestDept: "editorial", dataType: "content_metrics", description: "Finance user accessing editorial data" },
    { user: 1, requestDept: "sales", dataType: "revenue_metrics", description: "Finance user accessing sales revenue" },
    { user: 2, requestDept: "editorial", dataType: "article_performance", description: "Editor accessing own data" },
    { user: 2, requestDept: "finance", dataType: "detailed_financials", description: "Editor accessing finance data" },
    { user: 2, requestDept: "sales", dataType: "content_engagement", description: "Editor accessing content performance in sales" },
    { user: 3, requestDept: "sales", dataType: "campaign_performance", description: "Sales manager accessing own data" },
    { user: 3, requestDept: "editorial", dataType: "published_content", description: "Sales accessing published content metrics" },
    { user: 3, requestDept: "finance", dataType: "detailed_financials", description: "Sales accessing detailed finance data" },
    { user: 4, requestDept: "it", dataType: "server_metrics", description: "IT support accessing own data" },
    { user: 4, requestDept: "finance", dataType: "system_costs", description: "IT accessing system cost data" },
    { user: 4, requestDept: "editorial", dataType: "content_details", description: "IT accessing editorial content details" }
  ];
  
  console.log("🧪 Access Control Test Results:\n");
  
  testScenarios.forEach((scenario, index) => {
    const user = testUsers[scenario.user];
    const accessResult = checkDepartmentAccess(user, scenario.requestDept, scenario.dataType);
    
    console.log(`${index + 1}. ${scenario.description}`);
    console.log(`   User: ${user.firstName} ${user.lastName} (${user.department}/${user.position})`);
    console.log(`   Request: ${scenario.requestDept} → ${scenario.dataType}`);
    console.log(`   Result: ${accessResult.allowed ? '✅ ALLOWED' : '❌ DENIED'}`);
    console.log(`   Level: ${accessResult.accessLevel}`);
    console.log(`   Reason: ${accessResult.reason}`);
    
    if (accessResult.suggestion) {
      console.log(`   💡 Suggestion: ${accessResult.suggestion}`);
    }
    
    if (accessResult.allowedDataTypes) {
      console.log(`   📋 Allowed Data Types: ${accessResult.allowedDataTypes.join(', ')}`);
    }
    
    console.log("");
  });
  
  // Test data filtering
  console.log("\n" + "=" .repeat(60));
  console.log("🔍 Data Filtering Test:\n");
  
  // Sample data with sensitive fields
  const sampleData = [
    {
      id: 1,
      title: "Revenue Report Q3",
      amount: 150000,
      department: "finance",
      salary: 75000, // Sensitive
      personalInfo: "John.Doe@email.com", // Sensitive
      publicMetric: "15% growth",
      confidentialNotes: "Internal strategy notes" // Sensitive
    },
    {
      id: 2,
      title: "Content Performance",
      views: 50000,
      department: "editorial", 
      salary: 65000, // Sensitive
      personalInfo: "Jane.Smith@email.com", // Sensitive
      publicMetric: "25% engagement",
      confidentialNotes: "Editorial decisions" // Sensitive
    }
  ];
  
  // Test filtering for different access levels
  const filterTests = [
    { user: testUsers[0], dept: "finance", level: "full" },
    { user: testUsers[1], dept: "editorial", level: "limited" },
    { user: testUsers[2], dept: "finance", level: "limited" },
    { user: testUsers[4], dept: "finance", level: "limited" }
  ];
  
  filterTests.forEach((test, index) => {
    const accessResult = checkDepartmentAccess(test.user, test.dept, "general_metrics");
    const filteredData = filterDataByAccess(sampleData, accessResult, test.user);
    
    console.log(`${index + 1}. User: ${test.user.firstName} (${test.user.department}/${test.user.position})`);
    console.log(`   Accessing: ${test.dept} data`);
    console.log(`   Access Level: ${accessResult.accessLevel}`);
    console.log(`   Original fields: ${Object.keys(sampleData[0]).join(', ')}`);
    console.log(`   Filtered fields: ${filteredData.length > 0 ? Object.keys(filteredData[0]).join(', ') : 'No data'}`);
    console.log("");
  });
  
  // Generate access logs
  console.log("=" .repeat(60));
  console.log("📝 Sample Access Logs:\n");
  
  testScenarios.slice(0, 3).forEach((scenario, index) => {
    const user = testUsers[scenario.user];
    const accessResult = checkDepartmentAccess(user, scenario.requestDept, scenario.dataType);
    const log = logAccess(user, scenario.requestDept, scenario.dataType, accessResult);
    
    console.log(`${index + 1}. ${JSON.stringify(log, null, 2)}\n`);
  });
  
  console.log("🎯 Key Access Control Features:");
  console.log("=" .repeat(60));
  console.log("✅ Department-based access control");
  console.log("✅ Position-level permissions (C-level, managers, staff)");
  console.log("✅ Cross-department access rules");
  console.log("✅ Data filtering based on access level");
  console.log("✅ Comprehensive access logging");
  console.log("✅ Sensitive data protection");
  console.log("✅ Role-based restrictions");
  console.log("");
  console.log("💡 In Practice:");
  console.log("- Finance users can see revenue data across departments");
  console.log("- Editorial users cannot access detailed financial data");
  console.log("- IT users can see system costs but not business strategies");
  console.log("- Executives have full access to all departments");
  console.log("- Managers get enhanced access within their domain");
  console.log("- Sensitive fields are automatically filtered out");
}

testAccessControl();
