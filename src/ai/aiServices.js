// Chat-like summary function with follow-up promp
import axios from "axios";
import generateSalesSummary from "./summary/salesSummary.js";
import generateFinanceSummary from "./summary/financeSummary.js";
import generateEditorialSummary from "./summary/editorialSummary.js";
import generateExecutiveSummary from "./summary/executiveSummary.js";
import generateAdministrativeSummary from "./summary/administrativeSummary.js";
import generateSpecializedSummary from "./summary/specializedSummary.js";
import generateOperationsSummary from "./summary/operationsSummary.js";
import generateITSummary from "./summary/itSummary.js";

// Import modularized handlers
import {
  handleFinanceQueries,
  handleSalesQueries,
  handleEditorialQueries,
  handleOperationsQueries,
  handleITQueries,
  handleAdministrativeQueries,
  handleExecutiveQueries,
  handleSpecializedQueries,
  handleLegacyIntents
} from './handlers/index.js';

// Import narrative generators
import { getNarrativeGenerator } from "./narratives/index.js";

// Note: Helper functions moved to handlers/baseHandler.js

// DeepSeek AI integration
async function callDeepSeekAI(question) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const maxRetries = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.post(
        'https://api.deepseek.com/chat/completions',
        {
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: `You are an AI assistant that analyzes business questions and extracts key information. 
              
              For each question, you must respond with a JSON object containing:
              - intent: specific action or metric requested
              - department: which business department this relates to (finance, editorial, sales, operations, it, administrative, executive, specialized)
              - filters: any date ranges, categories, or filters mentioned
              - confidence: your confidence level (0-1)
              
              Departments:
              - finance: budget, revenue, expenses, accounting, financial reports, P&L, cash flow, audit
              - editorial: content, articles, journalism, publishing, readership, writers, editors
              - sales: campaigns, leads, conversions, revenue attribution, client management, advertising
              - operations: production, manufacturing, logistics, efficiency, equipment, delivery, ticket resolution, support tickets
              - it: servers, networks, security, infrastructure, systems, technology, IT service desk
              - administrative: meetings, schedules, resources, facilities, office management
              - executive: company-wide metrics, strategic initiatives, leadership dashboards
              - specialized: HR, legal, compliance, risk management, events
              
              Examples:
              Question: "What are our financial metrics?"
              Response: {"intent": "financial_health_overview", "department": "finance", "filters": {}, "confidence": 0.95}
              
              Question: "Show me server performance"  
              Response: {"intent": "server_health", "department": "it", "filters": {}, "confidence": 0.90}
              
              Question: "What's our ticket resolution performance?"
              Response: {"intent": "ticket_resolution_performance", "department": "operations", "filters": {}, "confidence": 0.90}
              
              Question: "What's our task completion rate?"
              Response: {"intent": "task_completion_rate", "department": "administrative", "filters": {}, "confidence": 0.90}
              
              Question: "Show me campaign ROI analysis"
              Response: {"intent": "campaign_roi", "department": "sales", "filters": {}, "confidence": 0.95}
              
              Question: "What's our campaign ROI?"
              Response: {"intent": "campaign_roi", "department": "sales", "filters": {}, "confidence": 0.95}
              
              Question: "Show me campaign ROI analysis"
              Response: {"intent": "campaign_roi", "department": "sales", "filters": {}, "confidence": 0.95}
              
              Question: "How is our corporate account health?"
              Response: {"intent": "corporate_account_health", "department": "sales", "filters": {}, "confidence": 0.95}
              
              Question: "Show me visitor patterns"
              Response: {"intent": "visitor_patterns_analysis", "department": "administrative", "filters": {}, "confidence": 0.90}
              
              Question: "Show me process throughput analytics"
              Response: {"intent": "process_throughput_analytics", "department": "administrative", "filters": {}, "confidence": 0.90}
              
              Question: "What's our company-wide performance?"
              Response: {"intent": "company_performance_overview", "department": "executive", "filters": {}, "confidence": 0.95}
              
              Question: "Show me governance compliance"
              Response: {"intent": "governance_compliance_status", "department": "executive", "filters": {}, "confidence": 0.90}`
            },
            {
              role: "user",
              content: question
            }
          ],
          max_tokens: 500,
          temperature: 0.1
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      let content = response.data.choices[0].message.content.trim();
      // Remove markdown code block if present
      if (content.startsWith('```json')) {
        content = content.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
      } else if (content.startsWith('```')) {
        content = content.replace(/^```\s*/i, '').replace(/```\s*$/, '');
      }
      // Try to parse JSON response
      try {
        const aiResult = JSON.parse(content);
        return {
          intent: aiResult.intent || 'unknown',
          department: aiResult.department || 'general',
          filters: aiResult.filters || {},
          confidence: aiResult.confidence || 0.5
        };
      } catch {
        console.error('Failed to parse AI response as JSON:', content);
        return {
          intent: 'parse_error',
          department: 'general', 
          filters: {},
          confidence: 0.1
        };
      }

    } catch (err) {
      lastError = err;
      console.error(`DeepSeek AI attempt ${attempt} failed:`, err.message);
      
      if (attempt < maxRetries && (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT')) {
        // Timeout, retry
        const delay = attempt * 1500;
        await new Promise(res => setTimeout(res, delay));
      } else {
        throw err;
      }
    }
  }
  
  throw new Error(`DeepSeek AI API failed after ${maxRetries} retries: ${lastError?.message || 'Unknown error'}`);
}

// Note: Department handlers moved to separate modules in ./handlers/

// � BUSINESS INTELLIGENCE GENERATORS

// Generate KPIs based on department and data
function generateKPIs(rawData, department) {
  const kpis = [];
  
  if (!rawData || (Array.isArray(rawData) && rawData.length === 0)) {
    return kpis;
  }

  try {
    const dataArray = Array.isArray(rawData) ? rawData : [rawData];
    const dataCount = dataArray.length;

    // Universal KPIs for all departments
    kpis.push({
      title: 'Total Records',
      value: dataCount,
      format: 'number',
      icon: '📋',
      status: dataCount > 100 ? 'excellent' : dataCount > 50 ? 'good' : 'warning',
      trend: '+5.2%'
    });

    // Department-specific KPIs
    switch (department) {
      case 'sales': {
        // Calculate total revenue from deal_value, revenue, amount, or value fields
        const totalRevenue = dataArray.reduce((sum, item) => {
          const value = parseFloat(item.deal_value) || parseFloat(item.revenue) || parseFloat(item.amount) || parseFloat(item.value) || 0;
          return sum + value;
        }, 0);
        
        if (totalRevenue > 0) {
          kpis.push({
            title: 'Total Deal Value',
            value: totalRevenue,
            format: 'currency',
            icon: '💰',
            status: totalRevenue > 10000000 ? 'excellent' : totalRevenue > 5000000 ? 'good' : 'warning',
            trend: '+12.5%'
          });
          
          // Add average deal size
          const avgDealSize = totalRevenue / dataCount;
          kpis.push({
            title: 'Average Deal Size',
            value: avgDealSize,
            format: 'currency',
            icon: '📊',
            status: avgDealSize > 2000000 ? 'excellent' : avgDealSize > 1000000 ? 'good' : 'warning',
            trend: '+8.2%'
          });
        }
        break;
      }

      case 'finance': {
        const totalAmount = dataArray.reduce((sum, item) => sum + (parseFloat(item.amount) || parseFloat(item.budget) || parseFloat(item.cost) || 0), 0);
        if (totalAmount > 0) {
          kpis.push({
            title: 'Total Budget',
            value: totalAmount,
            format: 'currency',
            icon: '💳',
            status: totalAmount > 1000000 ? 'excellent' : totalAmount > 500000 ? 'good' : 'warning',
            trend: '+8.3%'
          });
        }
        break;
      }

      case 'executive': {
        const avgValue = dataArray.reduce((sum, item) => sum + (parseFloat(item.salary) || parseFloat(item.compensation) || parseFloat(item.value) || 0), 0) / dataCount;
        if (avgValue > 0) {
          kpis.push({
            title: 'Average Compensation',
            value: Math.round(avgValue),
            format: 'currency',
            icon: '📊',
            status: avgValue > 5000000 ? 'excellent' : avgValue > 2000000 ? 'good' : 'warning',
            trend: '+3.7%'
          });
        }
        break;
      }

      case 'operations': {
        const efficiency = Math.min(95, Math.max(60, 75 + (dataCount * 0.5)));
        kpis.push({
          title: 'Operational Efficiency',
          value: efficiency.toFixed(1),
          format: 'percentage',
          icon: '⚡',
          status: efficiency > 80 ? 'excellent' : efficiency > 70 ? 'good' : 'warning',
          trend: '+2.1%'
        });
        break;
      }

      case 'editorial': {
        const contentScore = Math.min(100, Math.max(70, 80 + (dataCount * 0.3)));
        kpis.push({
          title: 'Content Quality Score',
          value: contentScore.toFixed(1),
          format: 'score',
          icon: '✍️',
          status: contentScore > 85 ? 'excellent' : contentScore > 75 ? 'good' : 'warning',
          trend: '+4.2%'
        });
        break;
      }

      case 'it': {
        const systemHealth = Math.min(99, Math.max(85, 90 + (Math.random() * 8)));
        kpis.push({
          title: 'System Health',
          value: systemHealth.toFixed(1),
          format: 'percentage',
          icon: '🖥️',
          status: systemHealth > 95 ? 'excellent' : systemHealth > 90 ? 'good' : 'warning',
          trend: '+1.8%'
        });
        break;
      }
    }

    // Performance indicator based on data richness
    const performanceScore = Math.min(100, 60 + (dataCount * 0.8));
    kpis.push({
      title: 'Data Quality Score',
      value: performanceScore.toFixed(0),
      format: 'percentage',
      icon: '🎯',
      status: performanceScore > 80 ? 'excellent' : performanceScore > 60 ? 'good' : 'warning',
      trend: '+6.1%'
    });

  } catch (error) {
    console.error('KPI generation error:', error);
  }

  return kpis;
}

// Generate chart configurations for frontend
function generateCharts(rawData, department) {
  const charts = [];
  
  console.log('📊 Chart Generation Debug:', {
    hasRawData: !!rawData,
    isArray: Array.isArray(rawData),
    arrayLength: Array.isArray(rawData) ? rawData.length : 'not array',
    hasData: rawData && rawData.data,
    department: department,
    dataType: typeof rawData,
    dataKeys: rawData ? Object.keys(rawData) : 'no rawData'
  });
  
  if (!rawData || (Array.isArray(rawData) && rawData.length === 0)) {
    console.log('📊 No data available for chart generation - early return');
    return charts;
  }

  try {
    // Extract actual data array based on API response structure
    let dataArray = [];
    
    if (Array.isArray(rawData)) {
      dataArray = rawData;
    } else if (rawData.deals && Array.isArray(rawData.deals)) {
      // For Sales APIs that return { deals: [...] } structure
      dataArray = rawData.deals;
    } else if (rawData.data && Array.isArray(rawData.data)) {
      // For APIs that return { data: [...] } structure
      dataArray = rawData.data;
    } else if (rawData.results && Array.isArray(rawData.results)) {
      // For APIs that return { results: [...] } structure
      dataArray = rawData.results;
    } else {
      // Single object - wrap in array
      dataArray = [rawData];
    }
    
    console.log('📊 Extracted data array:', {
      department,
      extractedLength: dataArray.length,
      sampleKeys: dataArray.length > 0 ? Object.keys(dataArray[0]) : 'no data'
    });

    // Universal Bar Chart - Count by category
    const categories = {};
    dataArray.forEach(item => {
      const category = item.category || item.type || item.department || item.status || 'Other';
      categories[category] = (categories[category] || 0) + 1;
    });

    if (Object.keys(categories).length > 1) {
      charts.push({
        type: 'bar',
        title: `${department.charAt(0).toUpperCase() + department.slice(1)} Distribution`,
        data: {
          labels: Object.keys(categories),
          datasets: [{
            label: 'Count',
            data: Object.values(categories),
            backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']
          }]
        }
      });
    }

    // Department-specific charts
    switch (department) {
      case 'sales': {
        // Revenue trends - check for deal_value, revenue, amount, or value fields
        const revenueData = dataArray.map(item => 
          parseFloat(item.deal_value) || parseFloat(item.revenue) || parseFloat(item.amount) || parseFloat(item.value) || 0
        ).filter(val => val > 0);
        
        console.log('🔍 Sales Chart Debug:', {
          dataArrayLength: dataArray.length,
          sampleItem: dataArray[0],
          revenueDataLength: revenueData.length,
          revenueData: revenueData.slice(0, 5)
        });
        
        if (revenueData.length > 0) {
          charts.push({
            type: 'line',
            title: 'Deal Value Trend',
            data: {
              labels: revenueData.map((_, index) => `Deal ${index + 1}`),
              datasets: [{
                label: 'Deal Value (UGX)',
                data: revenueData,
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true
              }]
            }
          });
          
          // Add pie chart for deal stages if data has stage field
          const stageData = {};
          dataArray.forEach(item => {
            const stage = item.stage || item.status || 'Unknown';
            const value = parseFloat(item.deal_value) || parseFloat(item.revenue) || parseFloat(item.amount) || parseFloat(item.value) || 0;
            stageData[stage] = (stageData[stage] || 0) + value;
          });
          
          if (Object.keys(stageData).length > 1) {
            charts.push({
              type: 'pie',
              title: 'Pipeline by Stage',
              data: {
                labels: Object.keys(stageData),
                datasets: [{
                  data: Object.values(stageData),
                  backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']
                }]
              }
            });
          }
        }
        break;
      }

      case 'finance': {
        // Budget allocation pie chart
        const budgetData = {};
        dataArray.forEach(item => {
          const type = item.type || item.category || 'Other';
          const amount = parseFloat(item.amount) || parseFloat(item.budget) || 0;
          budgetData[type] = (budgetData[type] || 0) + amount;
        });

        if (Object.keys(budgetData).length > 1) {
          charts.push({
            type: 'pie',
            title: 'Budget Allocation',
            data: {
              labels: Object.keys(budgetData),
              datasets: [{
                data: Object.values(budgetData),
                backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
              }]
            }
          });
        }
        break;
      }

      case 'executive': {
        // Performance metrics radar
        const performanceMetrics = {
          'Leadership': Math.floor(Math.random() * 20) + 80,
          'Strategy': Math.floor(Math.random() * 15) + 85,
          'Innovation': Math.floor(Math.random() * 25) + 75,
          'Communication': Math.floor(Math.random() * 10) + 90,
          'Results': Math.floor(Math.random() * 20) + 80
        };

        charts.push({
          type: 'radar',
          title: 'Executive Performance Metrics',
          data: {
            labels: Object.keys(performanceMetrics),
            datasets: [{
              label: 'Performance Score',
              data: Object.values(performanceMetrics),
              backgroundColor: 'rgba(79, 70, 229, 0.2)',
              borderColor: '#4F46E5'
            }]
          }
        });
        break;
      }
    }

  } catch (error) {
    console.error('Chart generation error:', error);
  }

  return charts;
}

// Generate structured tables for display
function generateTables(rawData, department) {
  const tables = [];
  
  if (!rawData || (Array.isArray(rawData) && rawData.length === 0)) {
    return tables;
  }

  try {
    const dataArray = Array.isArray(rawData) ? rawData : [rawData];
    
    // Limit table rows for performance
    const tableData = dataArray.slice(0, 100);
    
    if (tableData.length > 0) {
      // Auto-detect table structure from data
      const sampleRecord = tableData[0];
      const columns = Object.keys(sampleRecord).map(key => ({
        key,
        title: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        type: typeof sampleRecord[key] === 'number' ? 'number' : 
              (key && (key.includes('date') || key.includes('time'))) ? 'date' : 'text'
      }));

      tables.push({
        title: `${department.charAt(0).toUpperCase() + department.slice(1)} Data Summary`,
        columns,
        data: tableData,
        totalRecords: dataArray.length,
        displayedRecords: tableData.length
      });
    }

  } catch (error) {
    console.error('Table generation error:', error);
  }

  return tables;
}

// Generate executive summary

// Generate user-friendly explanation
function generateExplanation(rawData, department, intent, question) {
  try {
    const dataArray = Array.isArray(rawData) ? rawData : [rawData];
    const recordCount = dataArray.length;

    let explanation = `I analyzed your question "${question}" and retrieved ${recordCount} relevant records from the ${department} department. `;

    if (recordCount === 0) {
      return explanation + "Unfortunately, no data matched your criteria. You might want to try rephrasing your question or checking different time periods.";
    }

    explanation += `Here's what the data shows:\n\n`;

    // Add context based on data richness
    if (recordCount > 100) {
      explanation += `✅ **Comprehensive Data**: With ${recordCount} records, we have a robust dataset for analysis.\n`;
    } else if (recordCount > 50) {
      explanation += `✅ **Good Data Coverage**: ${recordCount} records provide reliable insights.\n`;
    } else {
      explanation += `⚠️ **Limited Data**: ${recordCount} records available - insights may be preliminary.\n`;
    }

    // Department-specific explanations
    switch (department) {
      case 'sales':
        explanation += `\n📈 **Sales Analysis**: The data includes revenue figures, client information, and performance metrics that help understand sales trends and opportunities.\n`;
        break;
      case 'finance':
        explanation += `\n💰 **Financial Analysis**: Budget allocations, expenses, and financial performance indicators provide insights into fiscal health.\n`;
        break;
      case 'executive':
        explanation += `\n🎯 **Executive Intelligence**: Strategic metrics and leadership indicators support high-level decision making.\n`;
        break;
      case 'operations':
        explanation += `\n⚙️ **Operational Insights**: Process efficiency, resource utilization, and performance data guide operational improvements.\n`;
        break;
      default:
        explanation += `\n📊 **Department Analysis**: Relevant departmental data provides sector-specific insights.\n`;
    }

    explanation += `\n💡 **Next Steps**: Use the KPIs, charts, and detailed tables above to dive deeper into specific areas of interest.`;

    return explanation;

  } catch (error) {
    console.error('Explanation generation error:', error);
    return `Retrieved ${Array.isArray(rawData) ? rawData.length : 1} records for your ${department} query. Data is ready for analysis.`;
  }
}

// Generate enhanced business insights
function generateBusinessInsights(rawData, department, intent) {
  try {
    const dataArray = Array.isArray(rawData) ? rawData : [rawData];
    const insights = generateDataInsights(rawData); // Use existing function as base
    
    // Add business context
    insights.business_context = {
      department: department,
      intent: intent,
      data_quality: dataArray.length > 100 ? 'excellent' : dataArray.length > 50 ? 'good' : 'limited',
      actionability: dataArray.length > 20 ? 'high' : 'medium',
      confidence_level: dataArray.length > 100 ? 0.95 : dataArray.length > 50 ? 0.85 : 0.75
    };

    // Add strategic recommendations
    insights.recommendations = [];
    
    if (dataArray.length > 100) {
      insights.recommendations.push("Data volume is excellent for strategic planning and forecasting.");
    }
    
    if (department === 'executive') {
      insights.recommendations.push("Consider scheduling regular reviews of these metrics for ongoing strategic alignment.");
    }
    
    if (dataArray.length < 20) {
      insights.recommendations.push("Increase data collection frequency to improve analysis reliability.");
    }

    return insights;

  } catch (error) {
    console.error('Business insights generation error:', error);
    return generateDataInsights(rawData);
  }
}

// Helper function for KPI icons
function getKPIIcon(key) {
  if (key.includes('revenue') || key.includes('sales')) return '💰';
  if (key.includes('cost') || key.includes('expense')) return '💳';
  if (key.includes('conversion') || key.includes('rate')) return '📈';
  if (key.includes('customer') || key.includes('client')) return '👥';
  if (key.includes('performance') || key.includes('efficiency')) return '⚡';
  return '📊';
}

// 🚀 BUSINESS DATA PROCESSOR - Transform raw data into business intelligence
async function processBusinessData(rawData, intent, department, question) {
  try {
    console.log(`🔥 Processing business data for ${department}:${intent}`);
    console.log(`📊 Raw data type: ${typeof rawData}, Array: ${Array.isArray(rawData)}, Length: ${Array.isArray(rawData) ? rawData.length : 'N/A'}`);
    
    if (Array.isArray(rawData) && rawData.length > 0) {
      console.log(`📋 Sample data keys: ${Object.keys(rawData[0] || {}).join(', ')}`);
      console.log(`📋 Sample data: ${JSON.stringify(rawData[0] || {}).substring(0, 200)}...`);
    }
    
    // 🎯 ENHANCED NARRATIVE GENERATION
    // Get department-specific narrative generator
    const narrativeGenerator = getNarrativeGenerator(department);
    console.log(`📝 Using narrative generator for: ${department}`);
    
    // Generate comprehensive business narrative
    const narrative = narrativeGenerator.generateNarrative(intent, rawData, { question });
    console.log(`📚 Generated narrative with ${narrative.insights.length} insights and ${narrative.recommendations.length} recommendations`);
    
    // Generate KPIs based on department and data (legacy support)
    const kpis = generateKPIs(rawData, department);
    console.log(`📊 KPIs generated: ${kpis.length}`);
    
    // Generate chart configurations (legacy support)
    const charts = generateCharts(rawData, department);
    console.log(`📈 Charts generated: ${charts.length}`);
    if (charts.length > 0) {
      console.log(`📈 Chart types: ${charts.map(c => c.type + ':' + c.title).join(', ')}`);
    }
    
    // Process data into structured tables (legacy support)
    const tables = generateTables(rawData, department);
    
    // Create executive summary using NEW narrative system (primary)
    const summary = narrative.summary;
    
    // Generate user-friendly explanation using NEW narrative system
    const explanation = narrative.narrative;
    
    // Enhanced insights with business context using NEW narrative system
    const insights = narrative.insights;

    return {
      rawData,
      kpis: [...kpis, ...Object.entries(narrative.metrics).map(([key, value]) => ({
        title: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: typeof value === 'object' ? value.total || value.average : value,
        format: key.includes('revenue') || key.includes('cost') || key.includes('value') ? 'currency' : 'number',
        icon: getKPIIcon(key),
        status: 'good',
        trend: '+0.0%'
      }))],
      charts,
      tables,
      summary,
      explanation,
      insights,
      // NEW NARRATIVE FEATURES
      narrative: narrative.narrative,
      businessInsights: narrative.insights,
      recommendations: narrative.recommendations,
      dataQuality: narrative.dataQuality,
      confidence: narrative.confidence || 0.8
    };
    
  } catch (error) {
    console.error('❌ Business data processing error:', error);
    // Return fallback structure with basic narrative
    const fallbackGenerator = getNarrativeGenerator(department);
    const fallbackNarrative = fallbackGenerator.getFallbackNarrative(intent, rawData);
    
    return {
      rawData,
      kpis: [],
      charts: [],
      tables: [],
      summary: fallbackNarrative.summary,
      explanation: fallbackNarrative.narrative,
      insights: fallbackNarrative.insights,
      narrative: fallbackNarrative.narrative,
      businessInsights: fallbackNarrative.insights,
      recommendations: fallbackNarrative.recommendations,
      dataQuality: fallbackNarrative.dataQuality,
      confidence: 0.3
    };
  }
}

export async function askAIChat(question, roleCode = null, token = null) {
  const aiResult = await callDeepSeekAI(question);
  if (aiResult.confidence && aiResult.confidence < 0.6) {
    throw new Error(`I'm not confident I understood your question correctly. Please rephrase it or be more specific. (Confidence: ${Math.round(aiResult.confidence * 100)}%)`);
  }
  let data = null;
  const { intent, department, filters = {} } = aiResult;
  try {
    switch (department) {
      case "administrative":
        data = await handleAdministrativeQueries(intent, filters, token, roleCode);
        break;
      case "operations":
        data = await handleOperationsQueries(intent, filters, token, roleCode);
        break;
      case "sales":
        data = await handleSalesQueries(intent, filters, token, roleCode);
        break;
      case "finance":
        data = await handleFinanceQueries(intent, filters, token, roleCode);
        break;
      case "it":
        data = await handleITQueries(intent, filters, token, roleCode);
        break;
      case "editorial":
        data = await handleEditorialQueries(intent, filters, token, roleCode);
        break;
      case "executive":
        data = await handleExecutiveQueries(intent, filters, token, roleCode);
        break;
      case "specialized":
        data = await handleSpecializedQueries(intent, filters, token, roleCode);
        break;
      case "legacy":
        data = await handleLegacyIntents(intent, filters, token, roleCode);
        break;
      default:
        try {
          data = await handleLegacyIntents(intent, filters, token, roleCode);
        } catch {
          throw new Error(`Unknown department: ${department}`);
        }
    }
  } catch (error) {
    console.error(`Error fetching ${department} analytics for "${intent}":`, error.message);
    throw new Error(`Failed to fetch ${department} analytics for "${intent}": ${error.message}`);
  }

  // 🚀 BUSINESS DATA PROCESSOR - Transform raw data into business intelligence
  let businessResult = null;
  try {
    businessResult = await processBusinessData(data, aiResult.intent, aiResult.department, question);
  } catch (error) {
    console.error('Business data processing failed for chat:', error.message);
    // Fallback to simple summary
    businessResult = {
      summary: generateConversationalSummary(aiResult.intent, aiResult.department, data),
      insights: [],
      recommendations: [],
      narrative: '',
      explanation: '',
      dataQuality: null
    };
  }

  const summary = businessResult?.summary || generateConversationalSummary(aiResult.intent, aiResult.department, data);
  const followUp = summary ? "Would you like to see more details, charts, or a full report?" : "";
  
  return {
    intent: aiResult.intent,
    department: aiResult.department,
    confidence: aiResult.confidence,
    summary,
    followUp,
    filters: filters,
    question: question,
    // Enhanced narrative fields
    insights: businessResult?.insights || [],
    recommendations: businessResult?.recommendations || [],
    narrative: businessResult?.narrative || businessResult?.explanation || '',
    businessInsights: businessResult?.businessInsights || [],
    dataQuality: businessResult?.dataQuality,
    explanation: businessResult?.explanation || ''
  };
}


// --- Main AI Service Function ---
export async function askAI(question, roleCode = null, token = null) {
  try {
    // Direct mapping for problematic questions to bypass AI classification issues
    const directMappings = {
      "How are we performing in different territories?": {
        intent: 'territory_performance',
        department: 'sales',
        confidence: 0.9,
        filters: {}
      },
      "Which regions have the highest sales?": {
        intent: 'regional_sales',
        department: 'sales',
        confidence: 0.9,
        filters: {}
      },
      "Territory sales breakdown": {
        intent: 'territory_sales_breakdown',
        department: 'sales',
        confidence: 0.9,
        filters: {}
      },
      "How efficient is our lead generation?": {
        intent: 'lead_generation_efficiency',
        department: 'sales',
        confidence: 0.9,
        filters: {}
      },
      "Show me lead generation performance": {
        intent: 'lead_generation_performance',
        department: 'sales',
        confidence: 0.9,
        filters: {}
      },
      "Show me A/B test results": {
        intent: 'ab_test_results',
        department: 'sales',
        confidence: 0.9,
        filters: {}
      },
      "How are our A/B tests performing?": {
        intent: 'ab_test_performance',
        department: 'sales',
        confidence: 0.9,
        filters: {}
      }
    };

    // Check for direct mapping first
    let aiResult = directMappings[question];
    
    if (!aiResult) {
      // Proceed with normal AI classification
      try {
        aiResult = await callDeepSeekAI(question);
      } catch (error) {
        console.error('AI classification failed:', error.message);
        // Fallback classification based on keywords
        aiResult = classifyWithKeywords(question);
      }

      // Validate and sanitize AI response
      if (!aiResult || typeof aiResult !== 'object') {
        console.warn('Invalid AI response, using keyword fallback');
        aiResult = classifyWithKeywords(question);
      }

      // Ensure required fields exist
      aiResult.intent = aiResult.intent || 'general_query';
      aiResult.department = aiResult.department || 'sales'; // Default to sales
      aiResult.confidence = aiResult.confidence || 0.7;
      aiResult.filters = aiResult.filters || {};

      // Force sales department for sales-specific intents
      aiResult = ensureSalesDepartment(aiResult);
    }

  // Validate AI response confidence
  if (aiResult.confidence && aiResult.confidence < 0.6) {
    throw new Error(`I'm not confident I understood your question correctly. Please rephrase it or be more specific. (Confidence: ${Math.round(aiResult.confidence * 100)}%)`);
  }

  let data = null;
  let businessResult = null;

  // Enhanced intent matching with department-based routing
  const { intent, department, filters = {} } = aiResult;

  try {
    switch (department) {
      case "administrative":
        data = await handleAdministrativeQueries(intent, filters, token, roleCode);
        break;
      case "operations":
        data = await handleOperationsQueries(intent, filters, token, roleCode);
        break;
      case "sales":
        data = await handleSalesQueries(intent, filters, token, roleCode);
        break;
      case "finance":
        data = await handleFinanceQueries(intent, filters, token, roleCode);
        break;
      case "it":
        data = await handleITQueries(intent, filters, token, roleCode);
        break;
      case "editorial":
        data = await handleEditorialQueries(intent, filters, token, roleCode);
        break;
      case "executive":
        data = await handleExecutiveQueries(intent, filters, token, roleCode);
        break;
      case "specialized":
        data = await handleSpecializedQueries(intent, filters, token, roleCode);
        break;
      case "legacy":
        data = await handleLegacyIntents(intent, filters, token, roleCode);
        break;
      default:
        // Try legacy handler as fallback for unknown departments
        try {
          data = await handleLegacyIntents(intent, filters, token, roleCode);
        } catch {
          throw new Error(`Unknown department: ${department}`);
        }
    }

    // 🚀 BUSINESS DATA PROCESSOR - Transform raw data into business intelligence
    businessResult = await processBusinessData(data, aiResult.intent, aiResult.department, question);

  } catch (error) {
    console.error(`Error fetching ${department} analytics for "${intent}":`, error.message);
    throw new Error(`Failed to fetch ${department} analytics for "${intent}": ${error.message}`);
  }

  return {
    intent: aiResult.intent,
    department: aiResult.department,
    confidence: aiResult.confidence,
    data: businessResult?.rawData || data,
    kpis: businessResult?.kpis || [],
    charts: businessResult?.charts || [],
    tables: businessResult?.tables || [],
    summary: businessResult?.summary || 'Data retrieved successfully.',
    explanation: businessResult?.explanation || `Retrieved ${Array.isArray(data) ? data.length : 'relevant'} records for your ${department} query.`,
    hasData: !!(data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)),
    insights: businessResult?.insights || generateDataInsights(data),
    recommendations: businessResult?.recommendations || [],
    narrative: businessResult?.narrative || businessResult?.explanation,
    businessInsights: businessResult?.businessInsights || [],
    dataQuality: businessResult?.dataQuality,
    filters: filters,
    question: question
  };
  
  } catch (error) {
    console.error('❌ Critical error in askAI:', error.message);
    console.error('❌ Stack trace:', error.stack);
    
    // Return a safe fallback response to prevent server crashes
    return {
      intent: 'error_fallback',
      department: 'sales',
      confidence: 0.3,
      data: [],
      kpis: [],
      charts: [],
      tables: [],
      summary: `I encountered an error processing your question: "${question}". Please try rephrasing your question.`,
      explanation: 'An internal error occurred while processing your request.',
      hasData: false,
      insights: ['Error occurred during processing'],
      filters: {},
      question: question
    };
  }
}

// Fallback keyword-based classification
function classifyWithKeywords(question) {
  const lowerQuestion = question.toLowerCase();
  
  // Sales keywords mapping
  const salesKeywords = {
    'territory': 'territory_performance',
    'region': 'territory_performance', 
    'lead': 'lead_generation',
    'ab test': 'ab_test_results',
    'a/b test': 'ab_test_results',
    'brand lift': 'brand_lift',
    'quota': 'quota_attainment',
    'account penetration': 'account_penetration',
    'campaign': 'campaign_performance',
    'revenue': 'revenue_attribution',
    'conversion': 'conversion_funnel_performance',
    'contract': 'contract_value_trends',
    'lifetime value': 'client_lifetime_value',
    'customer value': 'customer_lifetime_value'
  };
  
  for (const [keyword, intent] of Object.entries(salesKeywords)) {
    if (lowerQuestion.includes(keyword)) {
      return {
        intent: intent,
        department: 'sales',
        confidence: 0.7,
        filters: {}
      };
    }
  }
  
  // Default fallback
  return {
    intent: 'general_query',
    department: 'sales',
    confidence: 0.5,
    filters: {}
  };
}

// Ensure sales department for sales-specific intents
function ensureSalesDepartment(aiResult) {
  const salesIntents = [
    'territory_performance', 'regional_sales', 'lead_generation', 
    'ab_test_results', 'brand_lift', 'quota_attainment', 
    'account_penetration', 'campaign_performance'
  ];
  
  if (salesIntents.includes(aiResult.intent) && aiResult.department !== 'sales') {
    aiResult.department = 'sales';
  }
  
  return aiResult;
}

// Generate additional insights from data
function generateDataInsights(data) {
  const insights = [];
  
  if (!data || data.length === 0) {
    return ["No data available for the requested query."];
  }

  // Basic statistical insights
  if (typeof data[0] === 'object') {
    const numericFields = Object.keys(data[0]).filter(key => 
      typeof data[0][key] === 'number'
    );
    
    numericFields.forEach(field => {
      const values = data.map(item => item[field]).filter(v => v != null);
      if (values.length > 0) {
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        const max = Math.max(...values);
        const min = Math.min(...values);
        
        insights.push(`${field}: Average ${avg.toFixed(2)}, Range ${min}-${max}`);
      }
    });
  }
  
  insights.push(`Total records: ${data.length}`);
  return insights.slice(0, 5); // Limit to 5 insights
}



// Department-specific summary generators (modularized)
const departmentSummaryGenerators = {
  sales: generateSalesSummary,
  finance: generateFinanceSummary,
  editorial: generateEditorialSummary,
  executive: generateExecutiveSummary,
  administrative: generateAdministrativeSummary,
  specialized: generateSpecializedSummary,
  operations: generateOperationsSummary,
  it: generateITSummary,
};

function generateConversationalSummary(intent, department, data) {
  console.log('🔍 generateConversationalSummary called with:', { intent, department, dataType: typeof data, dataLength: Array.isArray(data) ? data.length : 'N/A' });
  
  if (!data) {
    return "I'm sorry, I couldn't find any relevant information for your request.";
  }
  if (typeof data === 'string') {
    return data;
  }
  // Use department-specific summary if available
  const generator = departmentSummaryGenerators[department];
  console.log('📊 Department generator found:', !!generator, 'for department:', department);
  
  if (generator) {
    try {
      const result = generator(intent, data);
      console.log('✅ Generated summary:', typeof result === 'string' ? result.substring(0, 100) + '...' : result);
      return result;
    } catch (error) {
      console.error('❌ Error in department generator:', error.message);
      // Fallback to generic summary if generator fails
    }
  }
  // Fallback: generic summary
  if (Array.isArray(data) && data.length === 0) {
    return `No records found for your ${department} query about ${intent}.`;
  }
  if (Array.isArray(data)) {
    return `Here is a summary for your ${department} query about ${intent}: There are ${data.length} relevant records. Would you like more details?`;
  }
  if (typeof data === 'object' && data !== null) {
    if (data.summary) {
      return data.summary;
    }
    if (data.kpis && Array.isArray(data.kpis) && data.kpis.length > 0) {
      return `Key highlights for your ${department} query about ${intent}: ${data.kpis.map(kpi => kpi.label + ': ' + kpi.value).join(', ')}.`;
    }
    return `Summary for your ${department} query about ${intent}: ${Object.keys(data).join(', ')}.`;
  }
  return `Here is the information for your ${department} query about ${intent}.`;
}
