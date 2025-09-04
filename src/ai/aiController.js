// aiController.js
import { askAI } from "./aiServices.js"; // <-- use the correct filename and function

export const askAIHandler = async (req, res) => {
  const { question } = req.body;
  const user = req.user; // User info from JWT token (set by Jwt.verifyToken middleware)
  
  try {
    const result = await askAI(question, user);
    res.json({ success: true, ...result });
  } catch (err) {
    // Check if it's an access control error
    if (err.message.includes('Access Denied')) {
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