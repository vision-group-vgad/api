// Test the improved finance endpoints with dropdown support
import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/v1/finance';

console.log('=== Testing Improved Finance System ===');

async function testImprovedFinanceSystem() {
  
  // Test 1: Get G/L Account Names for dropdown
  console.log('\n--- Testing G/L Account Names Endpoint ---');
  try {
    const response = await axios.get(`${BASE_URL}/gl-accounts`);
    console.log('✅ G/L Accounts Success!');
    console.log('Status:', response.status);
    console.log('Total Accounts:', response.data.totalAccounts);
    console.log('Sample Accounts:');
    response.data.data.slice(0, 5).forEach(account => {
      console.log(`  - ${account.displayName}`);
    });
  } catch (error) {
    console.log('❌ G/L Accounts Failed:', error.message);
  }

  // Test 2: Get Document Types for dropdown
  console.log('\n--- Testing Document Types Endpoint ---');
  try {
    const response = await axios.get(`${BASE_URL}/document-types`);
    console.log('✅ Document Types Success!');
    console.log('Status:', response.status);
    console.log('Total Types:', response.data.totalTypes);
    console.log('Available Document Types:');
    response.data.data.forEach(type => {
      console.log(`  - ${type.displayName}`);
    });
  } catch (error) {
    console.log('❌ Document Types Failed:', error.message);
  }

  // Test 3: Get raw data with improved transformation
  console.log('\n--- Testing Raw Data with Complete Attributes ---');
  try {
    const response = await axios.get(`${BASE_URL}/raw-data?startDate=2021-08-01&endDate=2021-08-31&limit=2`);
    console.log('✅ Raw Data Success!');
    console.log('Status:', response.status);
    console.log('Total Records:', response.data.totalRecords);
    
    if (response.data.data && response.data.data.length > 0) {
      const sample = response.data.data[0];
      console.log('\n📊 Complete Data Structure:');
      console.log('Primary Info:');
      console.log(`  - ID: ${sample.id}`);
      console.log(`  - Entry No: ${sample.entryNo}`);
      console.log(`  - Transaction No: ${sample.transactionNo}`);
      
      console.log('Account Info:');
      console.log(`  - Account No: ${sample.accountNo}`);
      console.log(`  - Account Name: ${sample.accountName}`);
      
      console.log('Document Info:');
      console.log(`  - Document Type: ${sample.documentType}`);
      console.log(`  - Document No: ${sample.documentNo}`);
      console.log(`  - Source Code: ${sample.sourceCode}`);
      
      console.log('Financial Amounts:');
      console.log(`  - Amount: ${sample.amount}`);
      console.log(`  - Debit Amount: ${sample.debitAmount}`);
      console.log(`  - Credit Amount: ${sample.creditAmount}`);
      console.log(`  - VAT Amount: ${sample.vatAmount}`);
      
      console.log('Additional Attributes:');
      console.log(`  - Gen Posting Type: ${sample.genPostingType}`);
      console.log(`  - Tax Liable: ${sample.taxLiable}`);
      console.log(`  - Dimension Set ID: ${sample.dimensionSetId}`);
      console.log(`  - Business Unit Code: ${sample.businessUnitCode}`);
    }
  } catch (error) {
    console.log('❌ Raw Data Failed:', error.message);
  }

  // Test 4: Test filter integration
  console.log('\n--- Testing Filter Integration ---');
  try {
    // First get available accounts
    const accountsResponse = await axios.get(`${BASE_URL}/gl-accounts`);
    const accounts = accountsResponse.data.data;
    
    if (accounts.length > 0) {
      const testAccount = accounts[0].accountNo;
      console.log(`Testing with account: ${accounts[0].displayName}`);
      
      // Get document types
      const typesResponse = await axios.get(`${BASE_URL}/document-types`);
      const types = typesResponse.data.data;
      
      if (types.length > 0) {
        const testType = types[0].value;
        console.log(`Testing with document type: ${testType}`);
        
        // Test filtered data
        const filteredResponse = await axios.get(`${BASE_URL}/raw-data?startDate=2021-08-01&endDate=2021-08-31&accountNo=${testAccount}&documentType=${testType}&limit=5`);
        console.log('✅ Filtered Data Success!');
        console.log(`Records found: ${filteredResponse.data.totalRecords}`);
        console.log('Applied filters:', filteredResponse.data.filters);
      }
    }
  } catch (error) {
    console.log('❌ Filter Integration Failed:', error.message);
  }
}

testImprovedFinanceSystem().catch(console.error);
