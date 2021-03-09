const express = require("express");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require('path');
const helmet = require('helmet');

const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

const app = express();

// Réponse pour assurer que tout fonctionne correctement,pout le fichier server.js

// Connexion à la BDD
mongoose.connect('mongodb+srv://tristantmt:tristantmt@cluster1.vxdzd.mongodb.net/<dbname>?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Accéde à notre API depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Ajoute les headers mentionnés aux requêtes envoyées vers notre API
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Envoyer des requêtes avec les méthodes mentionnées
  next();
});

app.use(bodyParser.json());
app.use(helmet());


// ROUTES DES API
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

app.use((req, res) => {
  res.json({ message: 'Votre requête a bien été reçue !' }); 
});

module.exports = app;