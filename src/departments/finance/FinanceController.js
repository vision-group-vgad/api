// Finance Controller for CMC API Integration
// Last updated: 2025-07-08 - Working version with real CMC data
// Deployment verification timestamp: July 8, 2025 11:06 AM

// finance/FinanceController.js
// Controller for Financial data endpoints

import FinanceService from './FinanceService.js';

// Controller to get financial close metrics with filtering
export const getFinancialCloseMetrics = async (req, res) => {
  try {
    // Extract filter parameters from query string
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      accountNo: req.query.accountNo,
      documentType: req.query.documentType,
      granularity: req.query.granularity || 'monthly', // daily, weekly, monthly, quarterly, yearly
      limit: req.query.limit || 1000
    };

    console.log('📊 Financial Close Metrics request with filters:', filters);

    const data = await FinanceService.getFinancialCloseMetrics(filters);
    res.status(200).json({ 
      success: true, 
      data,
      filters: filters,
      summary: {
        totalPeriods: data.length,
        granularity: filters.granularity,
        dateRange: filters.startDate && filters.endDate ? 
          `${filters.startDate} to ${filters.endDate}` : 'All available data'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching financial close metrics:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch financial close metrics',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Controller to get audit trail analysis
export const getAuditTrailAnalysis = async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      documentType: req.query.documentType,
      accountNo: req.query.accountNo,
      limit: req.query.limit || 5000
    };

    const data = await FinanceService.getAuditTrailAnalysis(filters);
    res.status(200).json({ 
      success: true, 
      data,
      filters: filters,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching audit trail analysis:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch audit trail analysis',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Controller to get reporting accuracy metrics
export const getReportingAccuracy = async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      accountNo: req.query.accountNo,
      limit: req.query.limit || 10000
    };

    const data = await FinanceService.getReportingAccuracy(filters);
    res.status(200).json({ 
      success: true, 
      data,
      filters: filters,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching reporting accuracy:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch reporting accuracy',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Controller to get raw financial data for custom analysis
export const getFinancialData = async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      accountNo: req.query.accountNo,
      documentType: req.query.documentType,
      limit: req.query.limit || 1000
    };

    const data = await FinanceService.getFinancialData(filters);
    res.status(200).json({ 
      success: true, 
      data,
      totalRecords: data.length,
      filters: filters,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching financial data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch financial data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Controller to get chart data for line/bar charts
export const getFinancialChartData = async (req, res) => {
  try {
    const chartType = req.query.chartType || 'line'; // line, bar, pie
    const metric = req.query.metric || 'amount'; // amount, transactions, balance
    
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      accountNo: req.query.accountNo,
      limit: req.query.limit || 1000
    };

    // Get the appropriate data based on chart type and metric
    let data;
    switch (metric) {
      case 'closeMetrics':
        data = await FinanceService.getFinancialCloseMetrics(filters);
        break;
      case 'auditTrail':
        data = await FinanceService.getAuditTrailAnalysis(filters);
        break;
      case 'accuracy':
        data = await FinanceService.getReportingAccuracy(filters);
        break;
      default:
        data = await FinanceService.getFinancialCloseMetrics(filters);
    }

    // Format data for different chart types
    const chartData = formatDataForCharts(data, chartType, metric);

    res.status(200).json({ 
      success: true, 
      data: chartData,
      chartType,
      metric,
      filters: filters,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch chart data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Controller to get G/L Account names for dropdown filters
export const getGLAccountNames = async (req, res) => {
  try {
    const data = await FinanceService.getGLAccountNames();
    res.status(200).json({ 
      success: true, 
      data,
      totalAccounts: data.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching G/L account names:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch G/L account names',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Controller to get document types for dropdown filters
export const getDocumentTypes = async (req, res) => {
  try {
    const data = await FinanceService.getDocumentTypes();
    res.status(200).json({ 
      success: true, 
      data,
      totalTypes: data.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching document types:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch document types',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function to format data for different chart types
function formatDataForCharts(data, chartType, metric) {
  switch (chartType) {
    case 'line':
      return formatForLineChart(data, metric);
    case 'bar':
      return formatForBarChart(data, metric);
    case 'pie':
      return formatForPieChart(data, metric);
    default:
      return data;
  }
}

function formatForLineChart(data, metric) {
  if (metric === 'closeMetrics' && Array.isArray(data)) {
    return {
      labels: data.map(item => item.month),
      datasets: [
        {
          label: 'Total Amount',
          data: data.map(item => item.totalAmount),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)'
        },
        {
          label: 'Balance Accuracy %',
          data: data.map(item => item.balanceAccuracy),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)'
        }
      ]
    };
  }
  return data;
}

function formatForBarChart(data, metric) {
  if (metric === 'auditTrail' && data.documentTypeDistribution) {
    return {
      labels: data.documentTypeDistribution.map(item => item.documentType),
      datasets: [{
        label: 'Document Count',
        data: data.documentTypeDistribution.map(item => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 205, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)'
        ]
      }]
    };
  }
  return data;
}

function formatForPieChart(data, metric) {
  if (metric === 'accuracy' && data.errorsByType) {
    return {
      labels: data.errorsByType.map(item => item.errorType),
      datasets: [{
        data: data.errorsByType.map(item => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)'
        ]
      }]
    };
  }
  return data;
}
