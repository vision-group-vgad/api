
import express from "express";
import Jwt from "../auth/jwt.js";
import { askAIHandler, askAIChatHandler } from "./aiController.js";

const router = express.Router();

// Register the /chat endpoint for chat-like summary responses
router.post("/chat", Jwt.verifyToken, askAIChatHandler);

/**
 * @swagger
 * /api/v1/ai/chat:
 *   post:
 *     summary: Ask a question and get a conversational summary (chat-like response)
 *     description: |
 *       This endpoint provides a chat-like, conversational summary in response to a natural language question.
 *       It returns only a direct summary and a follow-up prompt, without detailed analytics, KPIs, or charts unless requested.
 *       
 *       **Use Case:**
 *       - For chat UIs and conversational analytics where users want a quick, human-friendly summary.
 *       - Users can ask follow-up questions or request more details to expand the analytics.
 *       
 *       **Security Features:**
 *       - JWT-based authentication required
 *       - Department and position-based authorization
 *       - Automatic data filtering for sensitive information
 *       - Comprehensive access logging
 *     tags: [AI Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *             properties:
 *               question:
 *                 type: string
 *                 description: Natural language question for a chat-like summary
 *                 example: "Summarize our sales performance this month."
 *     responses:
 *       200:
 *         description: Conversational summary and follow-up prompt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 summary:
 *                   type: string
 *                   example: "Sales this month increased by 12% compared to last month."
 *                 followUp:
 *                   type: string
 *                   example: "Would you like to see more details, charts, or a full report?"
 *                 intent:
 *                   type: string
 *                   example: "sales_performance"
 *                 department:
 *                   type: string
 *                   example: "sales"
 *                 confidence:
 *                   type: number
 *                   example: 0.93
 *                 filters:
 *                   type: object
 *                   example: { "month": "September" }
 *                 question:
 *                   type: string
 *                   example: "Summarize our sales performance this month."
 *       400:
 *         description: Invalid request or low confidence in query understanding
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "I'm not confident I understood your question correctly. Please rephrase it or be more specific. (Confidence: 45%)"
 *                 type:
 *                   type: string
 *                   example: "low_confidence"
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token missing"
 *       403:
 *         description: Access Denied - User doesn't have permission to access requested data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Access Denied: No access permission for this data."
 *                 type:
 *                   type: string
 *                   example: "access_denied"
 *       500:
 *         description: Server error or AI service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "DeepSeek AI API rate limit exceeded. Please try again later."
 *                 type:
 *                   type: string
 *                   example: "service_error"
 */



/**
 * @swagger
 * /api/v1/ai/query:
 *   post:
 *     summary: Ask a question in natural language and get analytics results using DeepSeek AI
 *     description: |
 *       This endpoint uses DeepSeek AI to interpret natural language questions and return relevant 
 *       analytics data from across all Vision Group departments. The system includes comprehensive
 *       role-based access control (RBAC) that ensures users only see data appropriate to their 
 *       department and position level.
 *       
 *       **Supported Departments:**
 *       - Editorial: Content performance, readership trends, journalist productivity
 *       - Finance: Revenue analysis, budget variance, ROI analysis  
 *       - Sales: Campaign performance, client lifetime value, territory performance
 *       - Operations: Production yield, delivery timelines, resource utilization
 *       - IT: Server health, storage utilization, cyber security posture
 *       - Administrative: Meeting analytics, task completion rates, visitor patterns
 *       - Executive: Company-wide KPIs, strategic initiatives, market share
 *       
 *       **Access Control:**
 *       - Users can access their own department data (full access)
 *       - Cross-department access based on role and business needs
 *       - Executives have full access to all departments
 *       - Managers get enhanced cross-department access
 *       - Sensitive data automatically filtered based on permissions
 *       - All access attempts are logged for audit purposes
 *       
 *       **Security Features:**
 *       - JWT-based authentication required
 *       - Department and position-based authorization
 *       - Automatic data filtering for sensitive information
 *       - Comprehensive access logging
 *     tags: [AI Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *             properties:
 *               question:
 *                 type: string
 *                 description: Natural language question about business analytics
 *                 examples:
 *                   - "What's our revenue performance this quarter?"
 *                   - "Show me server health metrics for last week"
 *                   - "How many articles were published by editorial team?"
 *                   - "What's the storage utilization across all servers?"
 *                   - "Give me sales conversion funnel data"
 *                   - "Show me financial close metrics"
 *                   - "What's our content engagement rate?"
 *                   - "How's our production yield this month?"
 *     responses:
 *       200:
 *         description: AI analytics result with data and insights
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 explanation:
 *                   type: string
 *                   example: "I'll analyze your server health metrics for the last week"
 *                 intent:
 *                   type: string
 *                   example: "server_health"
 *                 department:
 *                   type: string
 *                   example: "it"
 *                 visualization_type:
 *                   type: string
 *                   enum: [line, bar, pie, table, kpi_card, heatmap]
 *                   example: "table"
 *                 confidence:
 *                   type: number
 *                   minimum: 0
 *                   maximum: 1
 *                   example: 0.95
 *                 accessLevel:
 *                   type: string
 *                   enum: [full, enhanced, limited, standard, none]
 *                   example: "full"
 *                   description: "User's access level to the requested data"
 *                 userLevel:
 *                   type: number
 *                   example: 7
 *                   description: "User's position level (1-10, higher = more access)"
 *                 data:
 *                   type: array
 *                   description: Analytics data based on the query (filtered by access permissions)
 *                   items:
 *                     type: object
 *                 additionalInsights:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Found 25 records", "Access Level: full", "Average response time: 150ms"]
 *                   description: AI-generated insights about the data and access info
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-03T10:30:00.000Z"
 *                 user:
 *                   type: object
 *                   description: Information about the requesting user
 *                   properties:
 *                     department:
 *                       type: string
 *                       example: "finance"
 *                     position:
 *                       type: string
 *                       example: "financial controller"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *       400:
 *         description: Invalid request or low confidence in query understanding
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "I'm not confident I understood your question correctly. Please rephrase it or be more specific. (Confidence: 45%)"
 *                 type:
 *                   type: string
 *                   example: "low_confidence"
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token missing"
 *       403:
 *         description: Access Denied - User doesn't have permission to access requested data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Access Denied: No access permission for editorial user to access finance data. Contact your manager or finance department for access"
 *                 type:
 *                   type: string
 *                   example: "access_denied"
 *       500:
 *         description: Server error or AI service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "DeepSeek AI API rate limit exceeded. Please try again later."
 *                 type:
 *                   type: string
 *                   example: "service_error"
 */
router.post("/query", Jwt.verifyToken, askAIHandler);

/**
 * @swagger
 * /api/v1/ai/access-info:
 *   get:
 *     summary: Get user's access permissions and available analytics
 *     description: |
 *       Returns information about what analytics and departments the current user 
 *       can access based on their role and department.
 *     tags: [AI Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's access information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     department:
 *                       type: string
 *                       example: "finance"
 *                     position:
 *                       type: string
 *                       example: "financial controller"
 *                     accessLevel:
 *                       type: number
 *                       example: 7
 *                 accessPermissions:
 *                   type: object
 *                   properties:
 *                     allowedDepartments:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["finance", "executive"]
 *                     crossDepartmentAccess:
 *                       type: object
 *                       example: {"sales": ["revenue_metrics"], "operations": ["cost_metrics"]}
 *                     restrictions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["editorial.personal_data", "it.security_details"]
 *                 suggestedQuestions:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["What's our revenue performance?", "Show me budget variance", "How are sales performing?"]
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 */
router.get("/access-info", Jwt.verifyToken, (req, res) => {
  try {
    const user = req.user;
    
    // Get department access rules
    const DEPARTMENT_ACCESS_MATRIX = {
      "executive": {
        allowedDepartments: ["finance", "editorial", "sales", "operations", "it", "administrative", "executive"],
        restrictions: [],
        suggestedQuestions: [
          "What's our overall company performance?",
          "Show me executive KPIs",
          "What's our market share?",
          "How are all departments performing?"
        ]
      },
      "finance": {
        allowedDepartments: ["finance", "executive"],
        crossDepartmentAccess: {
          "sales": ["revenue_metrics", "financial_performance"],
          "operations": ["cost_metrics", "budget_performance"]
        },
        restrictions: ["editorial.personal_data", "sales.client_personal_data"],
        suggestedQuestions: [
          "What's our revenue performance this quarter?",
          "Show me budget variance reports",
          "What are our financial close metrics?",
          "How's our cash flow looking?"
        ]
      },
      "editorial": {
        allowedDepartments: ["editorial", "administrative"],
        crossDepartmentAccess: {
          "sales": ["content_performance_metrics"],
          "administrative": ["content_workflow_metrics"]
        },
        restrictions: ["finance.detailed_financials", "it.security_details"],
        suggestedQuestions: [
          "How's our content performance?",
          "What's our article publication rate?",
          "Show me readership trends",
          "What's our content engagement rate?"
        ]
      },
      "sales": {
        allowedDepartments: ["sales", "administrative"],
        crossDepartmentAccess: {
          "editorial": ["published_content_metrics"],
          "finance": ["revenue_targets"]
        },
        restrictions: ["finance.detailed_financials", "editorial.unpublished_content"],
        suggestedQuestions: [
          "What's our sales performance?",
          "Show me conversion funnel data",
          "How are our campaigns performing?",
          "What's our client lifetime value?"
        ]
      },
      "it": {
        allowedDepartments: ["it", "administrative", "operations"],
        crossDepartmentAccess: {
          "finance": ["system_costs"],
          "operations": ["system_performance"]
        },
        restrictions: ["finance.financial_details", "editorial.content_details"],
        suggestedQuestions: [
          "What's our server health status?",
          "Show me storage utilization",
          "How's our system performance?",
          "What are our infrastructure costs?"
        ]
      }
    };
    
    const userDept = user.department?.toLowerCase() || "administrative";
    const accessInfo = DEPARTMENT_ACCESS_MATRIX[userDept] || DEPARTMENT_ACCESS_MATRIX["administrative"];
    
    res.json({
      success: true,
      user: {
        department: user.department,
        position: user.position,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email
      },
      accessPermissions: {
        allowedDepartments: accessInfo.allowedDepartments,
        crossDepartmentAccess: accessInfo.crossDepartmentAccess || {},
        restrictions: accessInfo.restrictions || []
      },
      suggestedQuestions: accessInfo.suggestedQuestions || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/v1/ai/health:
 *   get:
 *     summary: Check AI service health and configuration
 *     description: Returns the health status of the AI service and configuration information
 *     tags: [AI Analytics]
 *     responses:
 *       200:
 *         description: AI service health information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                 aiProvider:
 *                   type: string
 *                   example: "DeepSeek"
 *                 model:
 *                   type: string
 *                   example: "deepseek-chat"
 *                 features:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Natural Language Processing", "Role-Based Access Control", "Multi-Department Analytics"]
 *                 supportedDepartments:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["finance", "editorial", "sales", "operations", "it", "administrative", "executive"]
 *       500:
 *         description: AI service unavailable
 */
router.get("/health", (req, res) => {
  try {
    const isConfigured = process.env.DEEPSEEK_API_KEY ? true : false;
    
    res.json({
      success: true,
      status: isConfigured ? "configured" : "needs_configuration",
      aiProvider: "DeepSeek",
      model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
      apiUrl: process.env.DEEPSEEK_API_URL || "https://api.deepseek.com/v1/chat/completions",
      features: [
        "Natural Language Processing",
        "Role-Based Access Control", 
        "Multi-Department Analytics",
        "Data Filtering",
        "Access Logging",
        "Cross-Department Permissions"
      ],
      supportedDepartments: [
        "finance",
        "editorial", 
        "sales",
        "operations",
        "it",
        "administrative",
        "executive"
      ],
      accessControlEnabled: true,
      dataFilteringEnabled: true,
      configuration: {
        deepseekConfigured: isConfigured,
        databaseConfigured: process.env.DATABASE_URL ? true : false,
        cmsApiConfigured: process.env.CMC_API_BASE_URL ? true : false
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "AI service health check failed",
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/v1/ai/report/generate:
 *   post:
 *     summary: Generate PDF report from AI query results
 *     description: |
 *       Generates a professionally formatted PDF report from AI analytics results. 
 *       The report includes KPIs, data tables, executive summaries, and insights 
 *       in a print-ready format suitable for presentations and documentation.
 *       
 *       **Report Features:**
 *       - Executive summary with business insights
 *       - KPI cards with visual indicators
 *       - Data tables with formatted values
 *       - Professional branding and layout
 *       - Print-optimized formatting
 *     tags: [AI Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *             properties:
 *               question:
 *                 type: string
 *                 description: Natural language question for analytics
 *                 example: "What's our sales performance this quarter?"
 *               reportOptions:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: Custom report title
 *                     example: "Q3 Sales Performance Report"
 *                   companyName:
 *                     type: string
 *                     description: Company name for branding
 *                     example: "Vision Group Uganda"
 *                   format:
 *                     type: string
 *                     enum: [A4, Letter]
 *                     description: PDF page format
 *                     default: A4
 *     responses:
 *       200:
 *         description: PDF report generated successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *         headers:
 *           Content-Disposition:
 *             description: Filename for download
 *             schema:
 *               type: string
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       500:
 *         description: Server error during report generation
 */
router.post("/report/generate", Jwt.verifyToken, async (req, res) => {
  try {
    const { question, reportOptions = {} } = req.body;
    
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Question is required and must be a non-empty string",
        type: "validation_error"
      });
    }

    // First get the AI analytics data
    const aiResponse = await askAIHandler(req, res, true); // Pass true to return data instead of sending response
    
    if (!aiResponse.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate analytics data for report",
        type: "ai_error",
        details: aiResponse.message
      });
    }

    // Import report generator
    const { default: reportGenerator } = await import('./reportGenerator.js');
    
    // Generate PDF report
    const pdfBuffer = await reportGenerator.generatePDFReport(aiResponse, reportOptions);
    
    // Set response headers for PDF download
    const timestamp = new Date().toISOString().slice(0, 10);
    const department = aiResponse.department || 'analytics';
    const filename = `${department}-report-${timestamp}.pdf`;
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    res.send(pdfBuffer);

  } catch (error) {
    console.error("Report generation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate PDF report",
      type: "report_generation_error",
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/v1/ai/report/preview:
 *   post:
 *     summary: Preview report HTML before generating PDF
 *     description: |
 *       Returns the HTML content that would be used to generate a PDF report.
 *       Useful for previewing report layout and content before generating the final PDF.
 *     tags: [AI Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *             properties:
 *               question:
 *                 type: string
 *                 description: Natural language question for analytics
 *               reportOptions:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: Custom report title
 *                   companyName:
 *                     type: string
 *                     description: Company name for branding
 *     responses:
 *       200:
 *         description: HTML preview generated successfully
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Server error during preview generation
 */
router.post("/report/preview", Jwt.verifyToken, async (req, res) => {
  try {
    const { question, reportOptions = {} } = req.body;
    
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Question is required and must be a non-empty string"
      });
    }

    // Get AI analytics data
    const aiResponse = await askAIHandler(req, res, true);
    
    if (!aiResponse.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate analytics data for preview"
      });
    }

    // Import report generator
    const { default: reportGenerator } = await import('./reportGenerator.js');
    
    // Generate HTML content
    const htmlContent = reportGenerator.generateHTMLReport(aiResponse, reportOptions);
    
    res.set('Content-Type', 'text/html');
    res.send(htmlContent);

  } catch (error) {
    console.error("Report preview error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate report preview",
      details: error.message
    });
  }
});

export default router;