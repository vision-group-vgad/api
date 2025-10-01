// Base narrative generator for business intelligence
// Transforms raw data into compelling business stories

/**
 * Base class for generating business narratives
 * Each department should extend this to create specific narratives
 */
export class BaseNarrative {
  constructor(department) {
    this.department = department;
  }

  /**
   * Generate a complete business narrative
   * @param {string} intent - The business intent/query type
   * @param {any} rawData - Raw data from API
   * @param {Object} context - Additional context (filters, timeframe, etc.)
   * @returns {Object} Structured narrative with summary, insights, and recommendations
   */
  generateNarrative(intent, rawData, context = {}) {
    try {
      const summary = this.generateSummary(intent, rawData, context);
      const insights = this.generateInsights(intent, rawData, context);
      const recommendations = this.generateRecommendations(intent, rawData, context);
      const metrics = this.extractKeyMetrics(rawData);
      
      return {
        summary,
        insights,
        recommendations,
        metrics,
        narrative: this.combineIntoStory(summary, insights, recommendations),
        department: this.department,
        intent,
        dataQuality: this.assessDataQuality(rawData)
      };
    } catch (error) {
      console.error(`Narrative generation error for ${this.department}:`, error);
      return this.getFallbackNarrative(intent, rawData);
    }
  }

  /**
   * Generate executive summary of the data
   */
  generateSummary(intent, rawData) {
    if (!rawData || (Array.isArray(rawData) && rawData.length === 0)) {
      return "No data available for analysis.";
    }

    const dataArray = this.normalizeDataArray(rawData);
    const count = dataArray.length;
    
    return `Analysis of ${count} ${this.department} records for ${intent.replace(/_/g, ' ')}.`;
  }

  /**
   * Generate business insights from the data
   */
  generateInsights(intent, rawData) {
    const insights = [];
    const dataArray = this.normalizeDataArray(rawData);
    
    if (dataArray.length === 0) {
      insights.push("Insufficient data to generate meaningful insights.");
      return insights;
    }

    // Data volume insights
    if (dataArray.length > 100) {
      insights.push("✅ **Strong Data Foundation**: Large dataset provides reliable insights for strategic decisions.");
    } else if (dataArray.length > 20) {
      insights.push("📊 **Moderate Data Sample**: Sufficient data for tactical analysis.");
    } else {
      insights.push("⚠️ **Limited Data**: Small sample size may affect insight reliability.");
    }

    // Performance insights based on data patterns
    const numericFields = this.getNumericFields(dataArray[0] || {});
    if (numericFields.length > 0) {
      const performanceField = this.selectPrimaryMetric(numericFields, intent);
      if (performanceField) {
        const performance = this.analyzePerformance(dataArray, performanceField);
        insights.push(performance);
      }
    }

    return insights;
  }

  /**
   * Generate actionable recommendations
   */
  generateRecommendations(intent, rawData) {
    const recommendations = [];
    const dataArray = this.normalizeDataArray(rawData);
    
    if (dataArray.length === 0) {
      recommendations.push("🔍 **Immediate Action**: Investigate data collection processes to ensure adequate information flow.");
      return recommendations;
    }

    // Universal recommendations based on data quality
    if (dataArray.length < 10) {
      recommendations.push("📈 **Data Enhancement**: Increase data collection frequency to improve analysis accuracy.");
    }

    // Performance-based recommendations
    const avgPerformance = this.calculateAveragePerformance(dataArray);
    if (avgPerformance > 0.8) {
      recommendations.push("🎯 **Maintain Excellence**: Current performance is strong. Focus on sustaining these results.");
    } else if (avgPerformance > 0.6) {
      recommendations.push("⚡ **Optimization Opportunity**: Good foundation with room for improvement. Identify top performers to replicate success.");
    } else {
      recommendations.push("🚨 **Urgent Attention**: Performance indicators suggest immediate intervention required.");
    }

    return recommendations;
  }

  /**
   * Extract key performance metrics
   */
  extractKeyMetrics(rawData) {
    const dataArray = this.normalizeDataArray(rawData);
    const metrics = {
      totalRecords: dataArray.length,
      dataQuality: this.assessDataQuality(rawData),
      completeness: this.calculateCompleteness(dataArray)
    };

    // Calculate basic statistics for numeric fields
    if (dataArray.length > 0) {
      const numericFields = this.getNumericFields(dataArray[0]);
      numericFields.forEach(field => {
        const values = dataArray.map(item => parseFloat(item[field]) || 0).filter(v => v > 0);
        if (values.length > 0) {
          metrics[field] = {
            average: values.reduce((a, b) => a + b, 0) / values.length,
            max: Math.max(...values),
            min: Math.min(...values),
            total: values.reduce((a, b) => a + b, 0)
          };
        }
      });
    }

    return metrics;
  }

  /**
   * Combine all elements into a cohesive story
   */
  combineIntoStory(summary, insights, recommendations) {
    let story = `**📊 ${this.department.toUpperCase()} ANALYSIS**\n\n`;
    story += `${summary}\n\n`;
    
    if (insights.length > 0) {
      story += `**🔍 KEY INSIGHTS:**\n`;
      insights.forEach(insight => story += `• ${insight}\n`);
      story += `\n`;
    }
    
    if (recommendations.length > 0) {
      story += `**💡 RECOMMENDED ACTIONS:**\n`;
      recommendations.forEach(rec => story += `• ${rec}\n`);
    }
    
    return story;
  }

  // Helper methods
  normalizeDataArray(rawData) {
    if (!rawData) return [];
    if (Array.isArray(rawData)) return rawData;
    if (rawData.data && Array.isArray(rawData.data)) return rawData.data;
    if (rawData.deals && Array.isArray(rawData.deals)) return rawData.deals;
    if (rawData.results && Array.isArray(rawData.results)) return rawData.results;
    return [rawData];
  }

  getNumericFields(sampleObject) {
    if (!sampleObject || typeof sampleObject !== 'object') return [];
    return Object.keys(sampleObject).filter(key => 
      typeof sampleObject[key] === 'number' && 
      !isNaN(sampleObject[key]) &&
      sampleObject[key] !== null
    );
  }

  selectPrimaryMetric(numericFields, intent) {
    // Intent-based metric selection
    const metricMap = {
      revenue: ['revenue', 'amount', 'value', 'deal_value'],
      conversion: ['conversion_rate', 'rate', 'percentage'],
      performance: ['score', 'rating', 'efficiency'],
      cost: ['cost', 'expense', 'budget', 'spend']
    };

    for (const [category, metrics] of Object.entries(metricMap)) {
      if (intent.toLowerCase().includes(category)) {
        const found = metrics.find(metric => numericFields.includes(metric));
        if (found) return found;
      }
    }

    // Fallback to first numeric field
    return numericFields[0];
  }

  analyzePerformance(dataArray, field) {
    const values = dataArray.map(item => parseFloat(item[field]) || 0).filter(v => v > 0);
    if (values.length === 0) return "No performance data available.";

    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    const variance = values.length > 1 ? 
      values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length : 0;
    
    if (variance < avg * 0.1) {
      return `📈 **Consistent Performance**: ${field} shows stable results (avg: ${avg.toFixed(2)}).`;
    } else {
      return `📊 **Variable Performance**: ${field} ranges from ${min.toFixed(2)} to ${max.toFixed(2)} (avg: ${avg.toFixed(2)}). High variance suggests optimization opportunities.`;
    }
  }

  calculateAveragePerformance(dataArray) {
    // Simple heuristic: assume higher numbers = better performance
    const numericFields = this.getNumericFields(dataArray[0] || {});
    if (numericFields.length === 0) return 0.5; // neutral

    let totalScore = 0;
    let fieldCount = 0;

    numericFields.forEach(field => {
      const values = dataArray.map(item => parseFloat(item[field]) || 0).filter(v => v > 0);
      if (values.length > 0) {
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        // Normalize to 0-1 scale (this is simplified - real implementation would be field-specific)
        const normalized = Math.min(1, avg / 100); // assuming 100 is "good"
        totalScore += normalized;
        fieldCount++;
      }
    });

    return fieldCount > 0 ? totalScore / fieldCount : 0.5;
  }

  assessDataQuality(rawData) {
    const dataArray = this.normalizeDataArray(rawData);
    if (dataArray.length === 0) return 'poor';
    if (dataArray.length > 100) return 'excellent';
    if (dataArray.length > 50) return 'good';
    if (dataArray.length > 20) return 'fair';
    return 'limited';
  }

  calculateCompleteness(dataArray) {
    if (dataArray.length === 0) return 0;
    
    const sampleRecord = dataArray[0];
    if (!sampleRecord) return 0;
    
    const totalFields = Object.keys(sampleRecord).length;
    const nonNullFields = Object.values(sampleRecord).filter(val => 
      val !== null && val !== undefined && val !== ''
    ).length;
    
    return totalFields > 0 ? (nonNullFields / totalFields) * 100 : 0;
  }

  getFallbackNarrative(intent, rawData) {
    return {
      summary: `Analysis completed for ${intent.replace(/_/g, ' ')}.`,
      insights: ["Data analysis encountered technical issues."],
      recommendations: ["Review data collection and processing pipeline."],
      metrics: { totalRecords: Array.isArray(rawData) ? rawData.length : 0 },
      narrative: `**${this.department.toUpperCase()} ANALYSIS**\n\nTechnical analysis completed. Please review raw data for details.`,
      department: this.department,
      intent,
      dataQuality: 'unknown'
    };
  }
}