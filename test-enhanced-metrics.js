// Test the enhanced financial close metrics with different granularities
import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/v1/finance';

console.log('=== Testing Enhanced Financial Close Metrics ===');

async function testEnhancedCloseMetrics() {
  
  const granularities = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];
  
  for (const granularity of granularities) {
    console.log(`\n--- Testing ${granularity.toUpperCase()} Granularity ---`);
    
    try {
      const response = await axios.get(`${BASE_URL}/close-metrics`, {
        params: {
          startDate: '2021-08-01',
          endDate: '2021-08-31',
          granularity: granularity,
          limit: 5000
        }
      });
      
      console.log('✅ Success!');
      console.log('Status:', response.status);
      console.log('Summary:', response.data.summary);
      
      if (response.data.data && response.data.data.length > 0) {
        const sample = response.data.data[0];
        console.log('\n📊 Sample Metrics:');
        console.log(`  - Period: ${sample.period}`);
        console.log(`  - Granularity: ${sample.granularity}`);
        console.log(`  - Total Amount: $${sample.totalAmount.toLocaleString()}`);
        console.log(`  - Transaction Count: ${sample.transactionCount}`);
        console.log(`  - Average Amount: $${sample.averageAmount}`);
        console.log(`  - Max Amount: $${sample.maxAmount}`);
        console.log(`  - Min Amount: $${sample.minAmount}`);
        console.log(`  - Balance Accuracy: ${sample.balanceAccuracy}%`);
        console.log(`  - Close Status: ${sample.closeStatus}`);
        console.log(`  - Unique Accounts: ${sample.uniqueAccounts}`);
        console.log(`  - Document Types: ${sample.documentTypes?.join(', ')}`);
        console.log(`  - Debit/Credit Ratio: ${sample.debitCreditRatio}`);
        console.log(`  - Period: ${sample.periodStart} to ${sample.periodEnd}`);
        
        if (response.data.data.length > 1) {
          console.log(`  - Total Periods: ${response.data.data.length}`);
        }
      }
      
    } catch (error) {
      console.log('❌ Failed:');
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Error:', error.response.data.error);
      } else {
        console.log('Error:', error.message);
      }
    }
  }

  // Test with specific filters
  console.log('\n--- Testing with Multiple Filters ---');
  try {
    const response = await axios.get(`${BASE_URL}/close-metrics`, {
      params: {
        startDate: '2021-08-01',
        endDate: '2021-08-31',
        granularity: 'weekly',
        documentType: 'Payment',
        accountNo: '10060',
        limit: 1000
      }
    });
    
    console.log('✅ Filtered Test Success!');
    console.log('Applied Filters:', response.data.filters);
    console.log('Results:', response.data.summary);
    
    if (response.data.data && response.data.data.length > 0) {
      console.log(`📈 Found ${response.data.data.length} weekly periods with filters applied`);
      response.data.data.forEach((period, index) => {
        console.log(`  Week ${index + 1}: ${period.period} - ${period.transactionCount} transactions, $${period.totalAmount}`);
      });
    }
    
  } catch (error) {
    console.log('❌ Filtered test failed:', error.message);
  }
}

testEnhancedCloseMetrics().catch(console.error);
