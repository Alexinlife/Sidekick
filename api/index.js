const express = require('express');
const pool = require('./db');

// Fichiers de routes à part
var commandes = require('./routes/commandes');
var produits = require('./routes/produits');
var etats = require('./routes/etats');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Message de bienvenu à la racine
app.get('/', (req, res) => {
    res.send('Welcome to Sidekick API.');
});

// Liaison des URL avec les fichiers
app.use('/api/commandes', commandes);
app.use('/api/produits', produits);
app.use('/api/etats', etats);

app.listen(5000, () => console.log('Listening on port 5000.'));

module.exports = app;