import puppeteer from 'puppeteer';

class ReportGenerator {
  constructor() {
    this.browser = null;
  }

  async initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
    return this.browser;
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Generate PDF report from AI query response data
   * @param {Object} reportData - The AI response data with KPIs, tables, summary, etc.
   * @param {Object} options - Report generation options
   * @returns {Buffer} PDF buffer
   */
  async generatePDFReport(reportData, options = {}) {
    const browser = await this.initBrowser();
    const page = await browser.newPage();

    try {
      // Generate HTML content for the report
      const htmlContent = this.generateHTMLReport(reportData, options);
      
      // Set content and generate PDF
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        },
        ...options.pdfOptions
      });

      return pdfBuffer;
    } finally {
      await page.close();
    }
  }

  /**
   * Generate HTML content for the report
   * @param {Object} data - The AI response data
   * @param {Object} options - Generation options
   * @returns {string} HTML content
   */
  generateHTMLReport(data, options = {}) {
    const { 
      question, 
      department, 
      intent, 
      confidence, 
      kpis = [], 
      tables = [], 
      summary = '', 
      explanation = '',
      data: rawData,
      timestamp = new Date().toISOString()
    } = data;

    const reportTitle = options.title || `${department?.toUpperCase() || 'Business'} Analytics Report`;
    const companyName = options.companyName || 'Vision Group';
    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${reportTitle}</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background: #fff;
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px 40px;
                text-align: center;
                margin-bottom: 30px;
            }
            
            .header h1 {
                font-size: 28px;
                margin-bottom: 10px;
                font-weight: 300;
            }
            
            .header .company {
                font-size: 16px;
                opacity: 0.9;
                margin-bottom: 15px;
            }
            
            .header .meta {
                font-size: 14px;
                opacity: 0.8;
            }
            
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 40px;
            }
            
            .query-section {
                background: #f8f9fc;
                padding: 25px;
                border-radius: 10px;
                margin-bottom: 30px;
                border-left: 5px solid #667eea;
            }
            
            .query-section h2 {
                color: #667eea;
                margin-bottom: 15px;
                font-size: 20px;
            }
            
            .query-meta {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-top: 15px;
            }
            
            .meta-item {
                background: white;
                padding: 12px 16px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .meta-label {
                font-size: 12px;
                color: #666;
                text-transform: uppercase;
                font-weight: 600;
                margin-bottom: 4px;
            }
            
            .meta-value {
                font-size: 16px;
                font-weight: 600;
                color: #333;
            }
            
            .kpis-section {
                margin-bottom: 30px;
            }
            
            .kpis-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 20px;
                margin-top: 20px;
            }
            
            .kpi-card {
                background: white;
                border-radius: 12px;
                padding: 25px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                border-top: 4px solid #667eea;
                transition: transform 0.2s;
            }
            
            .kpi-header {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
            }
            
            .kpi-icon {
                font-size: 24px;
                margin-right: 12px;
            }
            
            .kpi-title {
                font-size: 14px;
                color: #666;
                font-weight: 600;
                text-transform: uppercase;
            }
            
            .kpi-value {
                font-size: 32px;
                font-weight: 700;
                color: #333;
                margin-bottom: 8px;
            }
            
            .kpi-trend {
                font-size: 14px;
                font-weight: 600;
                padding: 4px 8px;
                border-radius: 4px;
                background: #e8f5e8;
                color: #2d7d2d;
                display: inline-block;
            }
            
            .section-title {
                font-size: 24px;
                color: #333;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 2px solid #667eea;
                font-weight: 300;
            }
            
            .summary-section {
                background: #fff;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                margin-bottom: 30px;
            }
            
            .summary-content {
                font-size: 16px;
                line-height: 1.8;
            }
            
            .summary-content h2 {
                color: #667eea;
                margin-top: 25px;
                margin-bottom: 15px;
                font-size: 20px;
            }
            
            .summary-content h3 {
                color: #333;
                margin-top: 20px;
                margin-bottom: 10px;
                font-size: 18px;
            }
            
            .summary-content ul {
                margin-left: 20px;
                margin-bottom: 15px;
            }
            
            .summary-content li {
                margin-bottom: 8px;
            }
            
            .table-section {
                margin-bottom: 30px;
            }
            
            .data-table {
                width: 100%;
                border-collapse: collapse;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                margin-top: 20px;
            }
            
            .data-table th {
                background: #667eea;
                color: white;
                padding: 15px 12px;
                text-align: left;
                font-weight: 600;
                font-size: 14px;
                text-transform: uppercase;
            }
            
            .data-table td {
                padding: 12px;
                border-bottom: 1px solid #eee;
                font-size: 14px;
            }
            
            .data-table tbody tr:hover {
                background: #f8f9fc;
            }
            
            .data-table tbody tr:last-child td {
                border-bottom: none;
            }
            
            .explanation-section {
                background: #f0f4ff;
                padding: 25px;
                border-radius: 12px;
                border-left: 5px solid #4f46e5;
                margin-bottom: 30px;
            }
            
            .explanation-content {
                font-size: 15px;
                line-height: 1.7;
            }
            
            .footer {
                text-align: center;
                padding: 30px;
                color: #666;
                font-size: 14px;
                border-top: 1px solid #eee;
                margin-top: 50px;
            }
            
            @media print {
                .kpi-card {
                    break-inside: avoid;
                }
                
                .table-section {
                    break-inside: avoid;
                }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="company">${companyName}</div>
            <h1>${reportTitle}</h1>
            <div class="meta">Generated on ${new Date(timestamp).toLocaleDateString()} at ${new Date(timestamp).toLocaleTimeString()}</div>
        </div>

        <div class="container">
            <div class="query-section">
                <h2>📊 Query Analysis</h2>
                <p><strong>Question:</strong> "${question || 'N/A'}"</p>
                
                <div class="query-meta">
                    <div class="meta-item">
                        <div class="meta-label">Department</div>
                        <div class="meta-value">${department?.toUpperCase() || 'N/A'}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Intent</div>
                        <div class="meta-value">${intent || 'N/A'}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Confidence</div>
                        <div class="meta-value">${confidence ? (confidence * 100).toFixed(0) + '%' : 'N/A'}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Data Records</div>
                        <div class="meta-value">${rawData ? (Array.isArray(rawData) ? rawData.length : '1') : '0'}</div>
                    </div>
                </div>
            </div>

            ${kpis.length > 0 ? `
            <div class="kpis-section">
                <h2 class="section-title">📈 Key Performance Indicators</h2>
                <div class="kpis-grid">
                    ${kpis.map(kpi => `
                    <div class="kpi-card">
                        <div class="kpi-header">
                            <span class="kpi-icon">${kpi.icon || '📊'}</span>
                            <span class="kpi-title">${kpi.title || kpi.name || 'Metric'}</span>
                        </div>
                        <div class="kpi-value">
                            ${this.formatKPIValue(kpi.value, kpi.format)}
                        </div>
                        ${kpi.trend ? `<span class="kpi-trend">${kpi.trend}</span>` : ''}
                    </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            ${summary ? `
            <div class="summary-section">
                <h2 class="section-title">📋 Executive Summary</h2>
                <div class="summary-content">
                    ${this.markdownToHTML(summary)}
                </div>
            </div>
            ` : ''}

            ${tables.length > 0 ? `
            <div class="table-section">
                <h2 class="section-title">📊 Data Tables</h2>
                ${tables.map(table => `
                <h3>${table.title || 'Data Table'}</h3>
                <table class="data-table">
                    <thead>
                        <tr>
                            ${table.columns?.map(col => `<th>${col.title || col.key}</th>`).join('') || ''}
                        </tr>
                    </thead>
                    <tbody>
                        ${table.data?.slice(0, 50).map(row => `
                        <tr>
                            ${table.columns?.map(col => `
                            <td>${this.formatTableValue(row[col.key], col.type)}</td>
                            `).join('') || ''}
                        </tr>
                        `).join('') || ''}
                    </tbody>
                </table>
                ${table.data?.length > 50 ? `<p><em>Showing first 50 of ${table.data.length} records</em></p>` : ''}
                `).join('')}
            </div>
            ` : ''}

            ${explanation ? `
            <div class="explanation-section">
                <h2 class="section-title">💡 Insights & Recommendations</h2>
                <div class="explanation-content">
                    ${this.markdownToHTML(explanation)}
                </div>
            </div>
            ` : ''}
        </div>

        <div class="footer">
            <p>This report was automatically generated by ${companyName} Business Intelligence System</p>
            <p>For questions or support, contact your system administrator</p>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Format KPI value based on type
   */
  formatKPIValue(value, format) {
    if (value === null || value === undefined) return 'N/A';
    
    switch (format) {
      case 'currency':
        return `UGX ${Number(value).toLocaleString()}`;
      case 'percentage':
        return `${value}%`;
      case 'number':
        return Number(value).toLocaleString();
      default:
        return value;
    }
  }

  /**
   * Format table values based on type
   */
  formatTableValue(value, type) {
    if (value === null || value === undefined) return '';
    
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    
    switch (type) {
      case 'number':
        return Number(value).toLocaleString();
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'currency':
        return `UGX ${Number(value).toLocaleString()}`;
      default:
        return String(value);
    }
  }

  /**
   * Simple markdown to HTML converter
   */
  markdownToHTML(markdown) {
    return markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/\n/gim, '<br>')
      .replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');
  }
}

// Export singleton instance
const reportGenerator = new ReportGenerator();

export default reportGenerator;