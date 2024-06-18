const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// Admin
const adminAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).send("Un token est requis pour l'authentification.");
  }

  const parts = authHeader.split(" ");
  if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
    const token = parts[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      // Vérification si l'utilisateur est un modérateur
      if (decoded.moderator) {
        req.user = decoded;
        next();
      } else {
        return res
          .status(403)
          .json({ error: "Accès refusé. Réservé aux administrateurs." });
      }
    } catch (error) {
      console.error("JWT Verification Error:", error);
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  } else {
    return res.status(401).json({ error: "Token mal formaté" });
  }
};

// Utilisateur
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Accès refusé, token non fourni ou invalide" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user.id = 5;
    next();
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    return res.status(401).json({ error: "Token invalide" });
  }
};

module.exports = { adminAuthMiddleware, authMiddleware };