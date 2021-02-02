const express = require('express');
const pool = require('../db');
var router = express.Router();
const Joi = require('joi');

// Validation Joi
// TODO: Adapter pour état, exemple seulement
const schema = Joi.object({
    code: Joi.string()
        .allow("")
        .max(32),

    description: Joi.string()
        .allow("")
        .max(255),

    qte_demandee: Joi.number()
        .integer()
        .min(1)
        .required(),

    prix: Joi.number()
        .precision(4)
        .min(0.0050)
        .positive(),

    identifiant: Joi.number()
        .integer()
        .positive()
        .required()
})
    .or('code', 'description');

// Créer un état
router.post('/create/:commande_id', async (req, res) => {
    try {
        const { commande_id } = req.params;
        const { texte } = req.body;
        // Requête
        const nouvProduit = await pool.query("INSERT INTO etats (texte, commande_id) VALUES ($1, $2) RETURNING *",
            [texte, commande_id]);
        // Succès
        res.json(nouvProduit.rows);
        console.log("Success POST.");
    } catch (error) {
        console.log(error.message);
    }
});

// Afficher l'état le plus récent d'une commande
router.get('/last/:commande_id', async (req, res) => {
    try {
        const { commande_id } = req.params;
        // Requête
        const etat = await pool.query("SELECT texte, date FROM etats WHERE commande_id = $1 ORDER BY date DESC LIMIT 1",
            [commande_id]);
        // Succès
        res.json(etat.rows);
        console.log("Success GET by Order_ID.");
    } catch (error) {
        console.log(error.message);
    }
});

// Afficher l'historique d'état d'une commande
router.get('/:commande_id', async (req, res) => {
    try {
        const { commande_id } = req.params;
        // Requête
        const etats = await pool.query("SELECT texte, date FROM etats WHERE commande_id = $1",
            [commande_id]);
        // Succès
        res.json(etats.rows);
        console.log("Success GET by Order_ID.");
    } catch (error) {
        console.log(error.message);
    }
});

// Afficher tous les états
router.get('/', async (req, res) => {
    try {
        // Requête
        const etats = await pool.query("SELECT * FROM etats ORDER BY date DESC");
        // Succès
        res.json(etats.rows);
        console.log("Success GET by Order_ID.");
    } catch (error) {
        console.log(error.message);
    }
});

// Supprimer tous les états d'une commande
router.delete('/:commande_id', async (req, res) => {
    try {
        const { commande_id } = req.params;
        // Requête
        const supprEtats = await pool.query("DELETE FROM etats WHERE commande_id = $1 RETURNING *", [commande_id]);
        // Succès
        res.json(supprEtats.rows);
        console.log("Success DELETE.");
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;