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

  static generateToken(email) {
    const payload = { email };
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "8h" });
  }
}

export default Jwt;
