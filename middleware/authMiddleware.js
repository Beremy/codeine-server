const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// Vérification si admin
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

// Vérification si user connecté, et récupération de son id
const userAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).send("Un token est requis pour l'authentification.");
  }

  const parts = authHeader.split(" ");
  if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
    const token = parts[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.error("JWT Verification Error:", error);
      return res.status(401).json({ error: "Token invalide ou expiré" });
    }
  } else {
    return res.status(401).json({ error: "Token mal formaté" });
  }
};

// Les 2 middleware combinés
const adminOrUserMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).send("Un token est requis pour l'authentification.");
  }

  const parts = authHeader.split(" ");
  if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
    const token = parts[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      if (decoded.moderator) {
        return next();
      }

      const userIdFromToken = decoded.id;
      const userIdFromParams = req.params.id;

      if (userIdFromToken === userIdFromParams) {
        return next();
      } else {
        return res
          .status(403)
          .json({
            error:
              "Accès refusé. Vous n'êtes pas autorisé à accéder aux informations d'un autre utilisateur.",
          });
      }
    } catch (error) {
      console.error("JWT Verification Error:", error);
      return res.status(401).json({ error: "Token invalide ou expiré" });
    }
  } else {
    return res.status(401).json({ error: "Token mal formaté" });
  }
};

module.exports = {
  adminAuthMiddleware,
  userAuthMiddleware,
  adminOrUserMiddleware,
};
