const express = require('express');
const pool = require('../db');
var router = express.Router();

// Créer un état
router.post('/create', async (req, res) => {
    try {

    } catch (error) {
        console.log(error.message);
    }
});

// Afficher l'état le plus récent d'une commande
router.get('/:commande_id', async (req, res) => {
    try {

    } catch (error) {
        console.log(error.message);
    }
});

// Afficher l'historique d'état d'une commande
router.get('/:commande_id', async (req, res) => {
    try {

    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;