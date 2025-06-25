import jwt from "jsonwebtoken";

class Jwt {
  static SECRET_KEY = process.env.SECRET_KEY || "your_secret_key_here";

  static verifyToken(req, res, next) {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, Jwt.SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  }

  static generateToken(email) {
    const payload = { email };
    return jwt.sign(payload, Jwt.SECRET_KEY, { expiresIn: "8h" });
  }
}

export default Jwt;
