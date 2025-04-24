import jwt from "jsonwebtoken";

class checkMiddleware {
  static authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401); 

    console.log("Token received:", token);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403); 

      console.log("Decoded user:", user);
      
      req.user = user; 
            next();
    });
  };

  // static checkClientAndAdmin(req, res, next) {
  //   console.log("User in checkClientAndAdmin:", req.user); // Log the user
  //   if (req.user && (req.user.role === "user" || req.user.role === "admin")) {
  //     return next();
  //   }
  //   return res.status(403).json({
  //     status: "fail",
  //     message: "You do not have permission to perform this action",
  //   });
  // }

  static checkAdminRole(req, res, next) {
    if (req.user && req.user.role === "admin") {
      return next();
    }
    return res.status(403).json({
      status: "fail",
      message: "You do not have permission to perform this action",
    });
  }
}

export default checkMiddleware;
