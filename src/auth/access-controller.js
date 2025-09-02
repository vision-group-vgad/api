import { fetchRoles } from "../config/firebase/firebase-service.js";

class AccessController {
  static async assessRole(req, res, next) {
    try {
      const roleNameHeader = req.headers["x-role-name"];
      const roleCodeHeader = req.headers["x-role-code"];

      if (!roleNameHeader) {
        return res.status(400).json({ message: "Role header is missing" });
      }

      const roles = await fetchRoles();
      const matchingRole = roles.find(
        (role) => role.role_name === roleNameHeader
      );

      const expectedCode = matchingRole?.role_code || null;

      if (roleCodeHeader !== expectedCode) {
        return res
          .status(403)
          .json({ message: "Access denied: insufficient permissions" });
      }

      req.role = matchingRole;

      next();
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}

export default AccessController;
