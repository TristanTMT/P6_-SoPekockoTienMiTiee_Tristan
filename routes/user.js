const express = require('express'); // importation Express
const router = express.Router(); // création d'un router user

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;

// Enregistrer le routeur dans l'applaication : app.js