import { BaseNarrative } from './baseNarrative.js';
import generateSalesSummary from '../summary/salesSummary.js';

/**
 * Sales-specific narrative generator
 * Leverages existing salesSummary.js logic and enhances with insights and recommendations
 */
export class SalesNarrative extends BaseNarrative {
  constructor() {
    super('sales');
  }

  generateSummary(intent, rawData) {
    const dataArray = this.normalizeDataArray(rawData);
    
    if (dataArray.length === 0) {
      return "No sales data available for the requested analysis.";
    }

    // Use the existing sales summary generator which already has all the business logic
    try {
      const existingSummary = generateSalesSummary(intent, rawData);
      
      // If the existing summary is already business-friendly, return it
      if (this.isBusinessFriendly(existingSummary)) {
        return existingSummary;
      }
      
      // Otherwise, enhance it with business context
      return this.enhanceSummary(existingSummary, intent);
      
    } catch (error) {
      console.error('Error using existing sales summary:', error.message);
      return `Sales analysis completed: ${dataArray.length} records analyzed for ${intent.replace(/_/g, ' ')}.`;
    }
  }

  generateInsights(intent, rawData) {
    const insights = [];
    const dataArray = this.normalizeDataArray(rawData);
    
    if (dataArray.length === 0) {
      insights.push("⚠️ **Data Gap**: No sales data available. This could indicate system issues or timing problems.");
      return insights;
    }

    // Add base data quality insights
    insights.push(...super.generateInsights(intent, rawData));

    // Add sales-specific insights based on intent patterns
    if (intent.includes('campaign') || intent.includes('roi')) {
      insights.push(...this.generateCampaignInsights(dataArray));
    } else if (intent.includes('revenue') || intent.includes('attribution')) {
      insights.push(...this.generateRevenueInsights(dataArray));
    } else if (intent.includes('conversion') || intent.includes('funnel')) {
      insights.push(...this.generateConversionInsights(dataArray));
    } else if (intent.includes('quota') || intent.includes('target')) {
      insights.push(...this.generateQuotaInsights(dataArray));
    } else if (intent.includes('territory') || intent.includes('region')) {
      insights.push(...this.generateTerritoryInsights(dataArray));
    } else if (intent.includes('account') || intent.includes('client') || intent.includes('customer')) {
      insights.push(...this.generateAccountInsights(dataArray));
    } else {
      insights.push(...this.generateGeneralSalesInsights(dataArray));
    }

    return insights;
  }

  generateRecommendations(intent, rawData) {
    const recommendations = [];
    const dataArray = this.normalizeDataArray(rawData);
    
    if (dataArray.length === 0) {
      recommendations.push("🔍 **Immediate Action**: Investigate sales data pipeline and ensure CRM integration is functioning.");
      return recommendations;
    }

    // Add base recommendations
    recommendations.push(...super.generateRecommendations(intent, rawData));

    // Add sales-specific recommendations based on intent patterns
    if (intent.includes('campaign') || intent.includes('roi')) {
      recommendations.push(...this.generateCampaignRecommendations(dataArray));
    } else if (intent.includes('quota') || intent.includes('target')) {
      recommendations.push(...this.generateQuotaRecommendations(dataArray));
    } else if (intent.includes('territory') || intent.includes('region')) {
      recommendations.push(...this.generateTerritoryRecommendations());
    } else if (intent.includes('account') || intent.includes('client')) {
      recommendations.push(...this.generateAccountRecommendations(dataArray));
    }

    return recommendations;
  }

  // Helper methods
  isBusinessFriendly(summary) {
    // Check if summary already contains business-friendly language
    const businessIndicators = ['strong', 'excellent', 'outstanding', 'performing', 'beats', 'exceeds', 'concern', 'alert', 'opportunity'];
    return businessIndicators.some(indicator => summary.toLowerCase().includes(indicator));
  }

  enhanceSummary(existingSummary, intent) {
    // Add business context to technical summaries
    if (intent.includes('roi') && existingSummary.includes('%')) {
      const roiMatch = existingSummary.match(/(\d+\.?\d*)%/);
      if (roiMatch) {
        const roi = parseFloat(roiMatch[1]);
        if (roi > 150) return `🚀 **Exceptional Performance**: ${existingSummary} This outstanding ROI means you're earning significant returns on every marketing dollar invested.`;
        if (roi > 100) return `✅ **Strong Performance**: ${existingSummary} Your campaigns are profitable and generating solid returns.`;
        if (roi > 50) return `⚠️ **Moderate Performance**: ${existingSummary} While positive, there's room for optimization.`;
        return `🚨 **Needs Attention**: ${existingSummary} Immediate optimization required to improve returns.`;
      }
    }
    
    // Default enhancement
    return `📊 **Sales Analysis**: ${existingSummary}`;
  }

  // Simplified insight generators that focus on key patterns
  generateCampaignInsights(dataArray) {
    const insights = [];
    
    // Check for performance variance
    const performances = dataArray.map(item => parseFloat(item.roi) || parseFloat(item.revenue) || 0);
    const max = Math.max(...performances);
    const min = Math.min(...performances);
    
    if (max > min * 3) {
      insights.push(`📊 **Performance Variance**: Wide performance gap suggests opportunity to replicate top performer strategies.`);
    }
    
    // Check for channel diversity
    const channels = [...new Set(dataArray.map(item => item.channel || 'Unknown'))];
    if (channels.length > 3) {
      insights.push(`🎯 **Channel Diversity**: Multiple channels active - analyze which drive best ROI for budget reallocation.`);
    }
    
    return insights;
  }

  generateRevenueInsights(dataArray) {
    const insights = [];
    
    const totalRevenue = dataArray.reduce((sum, item) => sum + (parseFloat(item.revenue) || parseFloat(item.amount) || 0), 0);
    if (totalRevenue > 1000000) {
      insights.push(`💰 **Strong Revenue Base**: Substantial revenue volume provides foundation for scaling successful initiatives.`);
    }
    
    return insights;
  }

  generateConversionInsights(dataArray) {
    const insights = [];
    
    const avgConversion = dataArray.reduce((sum, item) => sum + (parseFloat(item.conversion_rate) || 0), 0) / dataArray.length;
    if (avgConversion > 25) {
      insights.push(`🎯 **High Conversion Rate**: Above-average conversion performance indicates strong product-market fit.`);
    } else if (avgConversion < 15) {
      insights.push(`⚡ **Conversion Opportunity**: Below-average rates suggest funnel optimization potential.`);
    }
    
    return insights;
  }

  generateQuotaInsights(dataArray) {
    const insights = [];
    
    const attainments = dataArray.map(rep => parseFloat(rep.attainment) || 0);
    const meetingQuota = attainments.filter(a => a >= 100).length;
    const percentage = (meetingQuota / attainments.length) * 100;
    
    if (percentage > 70) {
      insights.push(`🏆 **Team Success**: High quota attainment rate indicates effective sales processes and territory alignment.`);
    } else if (percentage < 50) {
      insights.push(`📈 **Performance Gap**: Low quota attainment suggests need for coaching, training, or territory review.`);
    }
    
    return insights;
  }

  generateTerritoryInsights(dataArray) {
    const insights = [];
    
    const revenues = dataArray.map(t => parseFloat(t.revenue) || parseFloat(t.sales) || 0);
    const avg = revenues.reduce((a, b) => a + b, 0) / revenues.length;
    const variance = revenues.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / revenues.length;
    
    if (variance > avg * avg) {
      insights.push(`🗺️ **Territory Imbalance**: Significant revenue variance between territories suggests rebalancing opportunities.`);
    }
    
    return insights;
  }

  generateAccountInsights(dataArray) {
    const insights = [];
    
    const healthScores = dataArray.map(acc => parseFloat(acc.health_score) || parseFloat(acc.nps) || 0);
    const avgHealth = healthScores.reduce((a, b) => a + b, 0) / healthScores.length;
    
    if (avgHealth > 7) {
      insights.push(`💚 **Strong Relationships**: High account health scores indicate excellent customer satisfaction and retention potential.`);
    } else if (avgHealth < 5) {
      insights.push(`🚨 **Relationship Risk**: Low health scores suggest immediate attention needed to prevent churn.`);
    }
    
    return insights;
  }

  generateGeneralSalesInsights(dataArray) {
    return [`📊 **Data Foundation**: ${dataArray.length} records provide ${dataArray.length > 50 ? 'comprehensive' : 'initial'} basis for sales analysis.`];
  }

  // Simplified recommendation generators
  generateCampaignRecommendations(dataArray) {
    const recommendations = [];
    
    const lowPerformers = dataArray.filter(c => (parseFloat(c.roi) || 0) < 50);
    if (lowPerformers.length > 0) {
      recommendations.push(`🔧 **Campaign Optimization**: Review and optimize ${lowPerformers.length} underperforming campaigns to improve ROI.`);
    }
    
    return recommendations;
  }

  generateQuotaRecommendations(dataArray) {
    const recommendations = [];
    
    const struggling = dataArray.filter(rep => (parseFloat(rep.attainment) || 0) < 80);
    if (struggling.length > 0) {
      recommendations.push(`🎓 **Sales Coaching**: Provide additional training and support for ${struggling.length} reps below 80% quota attainment.`);
    }
    
    return recommendations;
  }

  generateTerritoryRecommendations() {
    const recommendations = [];
    recommendations.push(`🗺️ **Territory Review**: Analyze top-performing territories to identify best practices for replication.`);
    return recommendations;
  }

  generateAccountRecommendations(dataArray) {
    const recommendations = [];
    
    const atRisk = dataArray.filter(acc => (parseFloat(acc.health_score) || parseFloat(acc.nps) || 0) < 5);
    if (atRisk.length > 0) {
      recommendations.push(`🎯 **Account Rescue**: Develop retention plans for ${atRisk.length} at-risk accounts to prevent churn.`);
    }
    
    return recommendations;
  }
}