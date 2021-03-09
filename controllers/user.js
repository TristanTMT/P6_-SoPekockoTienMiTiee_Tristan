// npm install --save bcrypt et importer
const bcrypt = require('bcrypt');
// npm install --save jsonwebtoken et importer
const jwt = require('jsonwebtoken');
// Importer le Schéma des données utilisateurs 
const User = require('../models/User');
// Importer le module crypto pour has l'email
const cryptojs = require('crypto-js/hmac-md5');

// Infrastructure nécessaire à nos routes d'authentification

// Créer un utilisateur et l'enregistrer dans la BDD, en renvoyant une réponse de réussite en cas de succès, et des erreurs avec le code d'erreur en cas d'échec
exports.signup = (req, res, next) => {
  // crypter l'adresse mail avec crypto
  const hashEmail = cryptojs(req.body.email, "SecretKeyForSoPekockoUsers").toString();
    bcrypt.hash(req.body.password, 10) //Hash, crypt un MDP
      .then(hash => {
        const user = new User({
          email: hashEmail,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

  exports.login = (req, res, next) => {
    // crypter l'adresse mail avec crypto
    const hashEmail = cryptojs(req.body.email, "SecretKeyForSoPekockoUsers").toString();
    User.findOne({ email: hashEmail }) /* findOne() fonction asychrone Trouver un seul utilisateur dans la BDD */
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password) /* fonction asynchrone compare() donc encore then().catch() de bcrypt qui compare le MDP de la requête avec le hash */
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET', /* encode notre token */
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };