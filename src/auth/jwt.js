import jwt from "jsonwebtoken";

class Jwt {
  static verifyToken(req, res, next) {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token missing" });
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err)
        return res.status(403).json({ error: "Invalid or expired token" });
      req.user = user;
      next();
    });
  }

  static generateToken(email, userInfo = {}) {
    const payload = { 
      email,
      role: userInfo.role,
      department: userInfo.department,
      name: userInfo.name,
      position: userInfo.position,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      role_code: userInfo.role_code,
      role_name: userInfo.role_name
    };
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "8h" });
  }
}

export default Jwt;
