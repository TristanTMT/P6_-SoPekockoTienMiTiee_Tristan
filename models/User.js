const mongoose = require('mongoose');
// package de validation : npm install --save mongoose-unique-validator
const uniqueValidator = require('mongoose-unique-validator');

// unique: true, permet de ne pas s'inscrire plusieurs fois avec la même adresse mail
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

// Ajout du plugin dans le schèma pour assurer qu'aucun des 2 utilisateurs ne peut partager la même adresse e-mail.
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);