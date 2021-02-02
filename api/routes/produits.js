const express = require('express');
const pool = require('../db');
var router = express.Router();
const Joi = require('joi');

// Validation Joi
const schema = Joi.object({
    code: Joi.string()
        .max(32),

    description: Joi.string()
        .max(255),

    qte_demandee: Joi.number()
        .integer()
        .min(1)
        .required(),

    prix: Joi.number()
        .precision(4)
        .min(0.0050)
        .positive(),

    commande_id: Joi.number()
        .integer()
        .positive()
        .required()
})
    .or('code', 'description')

/**
 * Valide les paramètres entrés avec Joi
 * @param {*} code Le code du produit à valider
 * @param {*} description La decription du produit à valider
 * @param {*} qte_demandee La quantité demandée du produit à valider
 * @param {*} prix Le prix du produit à valider
 * @param {*} commande_id L'identifiant de la commande à valider
 */
async function validateProduit(code, description, qte_demandee, prix, commande_id) {
    try {
        const validation = await schema.validateAsync({
            code: code,
            description: description,
            qte_demandee: qte_demandee,
            prix: prix,
            commande_id: commande_id
        });
        console.log(validation);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

// Créer un produit
router.post('/create/:commande_id', async (req, res) => {

    try {
        const { commande_id } = req.params;
        const { code, description, qte_demandee, prix } = req.body;
        // Requête
        if (await validateProduit(code, description, qte_demandee, prix, commande_id)) {
            const nouvProduit = await pool.query("INSERT INTO produits (code, description, qte_demandee, qte_recueillie, prix, commande_id) VALUES ($1, $2, $3, 0, $4, $5) RETURNING *",
                [code, description, qte_demandee, prix, commande_id]);
            // Succès
            res.json(nouvProduit.rows);
            console.log("Success POST.");
        } else {
            res.status(400).json({ "erreur": "Données invalides" });
        }
    } catch (error) {
        console.log(error.message);
    }
});

// Afficher tous les produits d'une commande
router.get('/:commande_id', async (req, res) => {
    try {
        const { commande_id } = req.params;
        // Requête
        const produits = await pool.query("SELECT code, description, qte_demandee, qte_recueillie, prix FROM produits WHERE commande_id = $1",
            [commande_id]);
        // Succès
        res.json(produits.rows);
        console.log("Success GET by Order_ID.");
    } catch (error) {
        console.log(error.message);
    }
});

// Modifier un produit
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { code, description, qte_demandee, prix } = req.body;
        // Requête
        if (await validateProduit(code, description, qte_demandee, prix, commande_id)) {
            const modProduit = await pool.query("UPDATE produits SET code = $1, description = $2, qte_demandee = $3, prix = $4 WHERE id = $5 RETURNING *",
                [code, description, qte_demandee, prix, id]);
            // Succès
            res.json(modProduit.rows);
            console.log("Succes PUT.");
        } else {
            res.status(400).json({ "erreur": "Données invalides" });
        }
    } catch (error) {
        console.log(error.message);
    }
});

// Supprimer un produit
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Requête
        const supprProduit = await pool.query("DELETE FROM produits WHERE id = $1 RETURNING *", [id]);
        // Succès
        res.json(supprProduit.rows);
        console.log("Success DELETE.");
    } catch (error) {
        console.log(error.message);
    }
});

// Supprimer tous les produits d'une commande
router.delete('/:commande_id', async (req, res) => {
    try {
        const { commande_id } = req.params;
        // Requête
        const supprProduits = await pool.query("DELETE FROM produits WHERE commande_id = $1 RETURNING *", [commande_id]);
        // Succès
        res.json(supprProduits.rows);
        console.log("Success DELETE.");
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;