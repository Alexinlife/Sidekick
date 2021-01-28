const express = require('express');
const pool = require('../db');
var router = express.Router();

// Créer une commande
router.post('/create', async (req, res) => {
    try {
        const { entreprise, nom, no_compte, telephone, courriel, po_client, vendeur, commentaire, attention } = req.body;
        // Validation
        // Entreprise et nom vides
        if (entreprise == null && nom == null) {
            res.status(400);
            res.json({ "erreur": "Données invalides", "code": 1 });
        }
        if (entreprise == null && telephone == null) {
            res.status(400);
            res.json({ "erreur": "Données invalides", "code": 2 });
        }
        if (vendeur == null) {
            res.status(400);
            res.json({ "erreur": "Données invalides", "code": 3 });
        }
        // Requête
        const nouvCommande = await pool.query(
            "INSERT INTO commandes (entreprise, nom, no_compte, telephone, courriel, po_client, vendeur, commentaire, attention) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
            [entreprise, nom, no_compte, telephone, courriel, po_client, vendeur, commentaire, attention]
        );
        // Succès
        res.json(nouvCommande.rows);
        console.log("Success POST.");
    } catch (error) {
        console.log(error.message);
    }
});

// Afficher toutes les commandes
router.get('/', async (req, res) => {
    try {
        // Requête
        const commandes = await pool.query("SELECT * FROM commandes");
        // Succès
        res.json(commandes.rows);
        console.log("Success GET.");
    } catch (error) {
        console.log(error.message);
    }
});

// Afficher une seule commande selon l'id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Requête
        const commande = await pool.query("SELECT * FROM commandes WHERE id = $1", [id]);
        // Succès
        res.json(commande.rows);
        console.log("Success GET by ID.");
    } catch (error) {
        console.log(error.message);
    }
});

// Modifier une commande
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { entreprise, nom, no_compte, telephone, courriel, po_client, vendeur, commentaire, attention } = req.body;
        // Validation

        // Requête
        const modCommande = await pool.query(
            "UPDATE commandes SET entreprise = $1, nom = $2, no_compte = $3, telephone = $4, courriel = $5, po_client = $6, vendeur = $7, commentaire = $8, attention = $9 WHERE id = $10 RETURNING *",
            [entreprise, nom, no_compte, telephone, courriel, po_client, vendeur, commentaire, attention, id]
        );
        // Succès
        res.json(modCommande.rows);
        console.log("Success PUT.");
    } catch (error) {
        console.log(error.message);
    }
});

// Supprimer une commande
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Requête
        const supprCommande = await pool.query("DELETE FROM commandes WHERE id = $1 RETURNING *", [id]);
        // Succès
        res.json(supprCommande.rows);
        console.log("Success DELETE.");
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;