const express = require('express');
const pool = require('../db');
var router = express.Router();

// Créer un état
router.post('/create', async (req, res) => {
    try {
        const { commande_id, texte } = req.body
        const nouvCommande = await pool.query(
            'INSERT INTO commandes (commande_id, texte, date) VALUES ($1, $2)',
            [commande_id, texte]
            );

    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;