const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // extraye le token du header Authorization de la requête entrante. Contient également le mot-clé Bearer . La fonction split récupére tout après l'espace dans le header
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};

/** middleware qui protégera les routes sélectionnées 
 * et vérifie que l'utilisateur est authentifié avant d'autoriser l'envoi de ses requêtes. **/