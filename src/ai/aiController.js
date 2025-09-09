// aiController.js
import { askAI } from "./aiServices.js"; // <-- use the correct filename and function

export const askAIHandler = async (req, res) => {
  const { question } = req.body;
  const roleCode = req.headers["x-role-code"]; // Role code from header
  
  // Extract the raw JWT token from Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  try {
    const result = await askAI(question, roleCode, token);
    res.json({ success: true, ...result });
  } catch (err) {
    // Check if it's an access control error
    if (err.message.includes('Access Denied') || err.message.includes('Unauthorized access')) {
      res.status(403).json({ 
        success: false, 
        message: err.message,
        type: 'access_denied'
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: err.message,
        type: 'service_error'
      });
    }
  }
};