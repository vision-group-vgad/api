import { fetchRoleByName } from "../config/firebase/firebase-role-service.js";

class AccessController {
  static authorizeRole(expectedRoleCode) {
    return async function (req, res, next) {
      try {
        const roleName = (req.headers["x-role-name"] || "").trim();
        const roleCode = (req.headers["x-role-code"] || "").trim();

        if (!roleName) {
          return res.status(400).json({ message: "Role name is required" });
        }

        const role = await fetchRoleByName(roleName);
        if (!role) {
          return res.status(404).json({ message: "Role not found" });
        }

        if (roleCode !== role.role_code) {
          return res.status(403).json({ message: "Invalid role code" });
        }

        if (expectedRoleCode !== roleCode) {
          return res
            .status(403)
            .json({ message: "Access denied to this data" });
        }

        req.role = role;
        next();
      } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
      }
    };
  }
  //   static assessRole(expectedRoleName) {
  //   return async function (req, res, next) {
  //     try {
  //       const roleCode = req.headers["x-role-code"];

  //       const role = await fetchRoleByName(expectedRoleName);
  //       if (!role) return res.status(404).json({ message: "Role not found" });

  //       if (role.role_code !== roleCode) {
  //         return res.status(403).json({ message: "Access denied" });
  //       }

  //       req.role = role;
  //       next();
  //     } catch (error) {
  //       res.status(500).json({ message: "Server error", error: error.message });
  //     }
  //   };
  // }
}

export default AccessController;
