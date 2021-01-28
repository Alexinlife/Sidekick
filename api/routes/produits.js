const express = require('express');
const pool = require('../db');
var router = express.Router();

// Créer un produit
router.post('/create', async (req, res) => {
    try {

    } catch (error) {
        console.log(error.message);
    }
});

// Afficher tous les produits d'une commande
router.get('/:commande_id', async (req, res) => {
    try {

    } catch (error) {
        console.log(error.message);
    }
});

// Modifier un produit
router.put('/:id', async (req, res) => {
    try {

    } catch (error) {
        console.log(error.message);
    }
});

// Supprimer un produit
router.delete('/:id', async (req, res) => {
    try {

    } catch (error) {
        console.log(error.message);
    }
})

module.exports = router;