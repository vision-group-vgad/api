// aiController.js
import { askAI } from "./aiServices.js"; // <-- use the correct filename and function

export const askAIHandler = async (req, res, returnData = false) => {
  const { question } = req.body;
  const roleCode = req.headers["x-role-code"];
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!returnData) {
    res.setHeader('Content-Type', 'application/json');
  }

  try {
    const result = await askAI(question, roleCode, token);
    const responseData = {
      success: true,
      explanation: result.explanation || '',
      intent: result.intent || '',
      department: result.department || '',
      visualization_type: result.visualization_type || null,
      confidence: typeof result.confidence === 'number' ? result.confidence : 1,
      accessLevel: result.accessLevel || null,
      userLevel: typeof result.userLevel === 'number' ? result.userLevel : null,
      data: Array.isArray(result.data) ? result.data : (result.data ? [result.data] : []),
      additionalInsights: Array.isArray(result.insights) ? result.insights : [],
      timestamp: result.timestamp || new Date().toISOString(),
      user: result.user || null,
      kpis: Array.isArray(result.kpis) ? result.kpis : [],
      charts: Array.isArray(result.charts) ? result.charts : [],
      tables: Array.isArray(result.tables) ? result.tables : [],
      summary: result.summary || '',
      hasData: typeof result.hasData === 'boolean' ? result.hasData : null,
      filters: result.filters || {},
      question: result.question || ''
    };

    if (returnData) {
      //return responseData;
      res.json(responseData);
    } else {
      res.json(responseData);
    }
  } catch (err) {
    const errorResponse = {
      success: false,
      explanation: '',
      intent: '',
      department: '',
      visualization_type: null,
      confidence: 0,
      accessLevel: null,
      userLevel: null,
      data: [],
      additionalInsights: [],
      timestamp: new Date().toISOString(),
      user: null,
      message: err.message,
      type: err.message.includes('Access Denied') || err.message.includes('Unauthorized access') 
        ? 'access_denied' 
        : 'service_error'
    };
    if (returnData) {
      //return errorResponse;
      res.status(500).json(errorResponse);
    } else if (err.message.includes('Access Denied') || err.message.includes('Unauthorized access')) {
      res.status(403).json(errorResponse);
    } else {
      res.status(500).json(errorResponse);
    }
  }
};