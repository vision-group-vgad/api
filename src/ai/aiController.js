// aiController.js
import { askAI } from "./aiServices.js"; // <-- use the correct filename and function

export const askAIHandler = async (req, res, returnData = false) => {
  const { question } = req.body;
  const roleCode = req.headers["x-role-code"]; // Role code from header
  
  // Extract the raw JWT token from Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  try {
    const result = await askAI(question, roleCode, token);
    const responseData = { success: true, ...result };
    
    // If returnData is true, return the data instead of sending response (for report generation)
    if (returnData) {
      return responseData;
    }
    
    res.json(responseData);
  } catch (err) {
    const errorResponse = {
      success: false,
      message: err.message,
      type: err.message.includes('Access Denied') || err.message.includes('Unauthorized access') 
        ? 'access_denied' 
        : 'service_error'
    };
    
    // If returnData is true, return the error instead of sending response
    if (returnData) {
      return errorResponse;
    }
    
    // Check if it's an access control error
    if (err.message.includes('Access Denied') || err.message.includes('Unauthorized access')) {
      res.status(403).json(errorResponse);
    } else {
      res.status(500).json(errorResponse);
    }
  }
};