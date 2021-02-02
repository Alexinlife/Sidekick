const express = require('express');
const nodemailer = require('nodemailer');
const pool = require('../db');
var router = express.Router();

// Nodemailer config
const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
    auth: {
        user: 'notifications.sidekick@gmail.com',
        pass: 'QrtnnmZRVF#z!yj@^lHlxCjiZYRIIVWF7Mhr0k7S2GlLnIqi&h',
    },
    secure: true,
});

/**
 * Compose un message avant de l'envoyer via Nodemailer
 * @param {*} attention La personne devant recevoir le message
 * @param {*} subject Le sujet du message
 * @param {*} text Le texte contenu dans le message
 */
function sendMail(attention, subject, text) {
    // Composition du message
    const mailData = {
        from: "notifications.sidekick@gmail.com",  // sender address
        to: attention,   // list of receivers
        subject: subject,
        text: text,
    };
    // Envoi du message
    transporter.sendMail(mailData, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });
}

// Créer une commande
router.post('/create', async (req, res) => {
    try {
        const { entreprise, nom, no_compte, telephone, courriel, po_client, vendeur, commentaire, attention } = req.body;
        // Champs obligatoires
        if (vendeur == null || attention == null) {
            res.status(400).json({ "erreur": "Données invalides", "code": 1 });
        }
        // Entreprise et nom vides
        if (entreprise == null && nom == null) {
            res.status(400).json({ "erreur": "Données invalides", "code": 2 });
        }
        // Entreprise, telephone, et courriel vides
        if (entreprise == null && telephone == null && courriel == null) {
            res.status(400).json({ "erreur": "Données invalides", "code": 3 });
        }
        // Validation type champs, s'il y a lieu
        if ((entreprise && typeof entreprise != "string") || (nom && typeof nom != "string") || (no_compte && typeof no_compte != "number") ||
            (telephone && typeof telephone != "string") || (courriel && typeof courriel != "string") || (po_client && typeof po_client != "string") ||
            (vendeur && typeof vendeur != "string") || (commentaire && typeof commentaire != "string") || (attention && typeof attention != "string")) {
            res.status(400).json({ "erreur": "Données invalides", "code": 4 });
        }
        // Validation longueur champs
        if ((entreprise && entreprise.length > 64) || (nom && nom.length > 64) || (no_compte && ((no_compte.toString().length > 9) || no_compte < 0 || !(Number.isInteger(no_compte)) ||
            no_compte > Number.MAX_SAFE_INTEGER)) || (telephone && telephone.length > 32) || (courriel && courriel.length > 255) || (po_client && po_client.length > 64) ||
            (vendeur && vendeur.length > 4) || (commentaire && commentaire.length > 512) || (attention && attention.length > 255)) {
            res.status(400).json({ "erreur": "Données invalides", "code": 5 });
        }
        /**
         * Validation adresse courriel valide
         * @see https://www.w3resource.com/javascript/form/email-validation.php
         */
        if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(courriel))) {
            res.status(400).json({ "erreur": "Données invalides", "code": 5 });
        }
        // TODO: Utiliser cette librairie pour une validation plus clean
        // Requête
        else {
            const nouvCommande = await pool.query(
                "INSERT INTO commandes (entreprise, nom, no_compte, telephone, courriel, po_client, vendeur, commentaire, attention) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
                [entreprise, nom, no_compte, telephone, courriel, po_client, vendeur, commentaire, attention]
            );
            // Succès
            res.json(nouvCommande.rows);
            sendMail(attention, "Nouvelle commande", "Une nouvelle commande vous est assignée dans l\'application Sidekick.");
            console.log("Success POST.");
        }
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
        // Champs obligatoires
        if (vendeur == null || attention == null) {
            res.status(400).json({ "erreur": "Données invalides", "code": 1 });
        }
        // Entreprise et nom vides
        if (entreprise == null && nom == null) {
            res.status(400).json({ "erreur": "Données invalides", "code": 2 });
        }
        // Entreprise, telephone, et courriel vides
        if (entreprise == null && telephone == null && courriel == null) {
            res.status(400).json({ "erreur": "Données invalides", "code": 3 });
        }
        // Validation type champs, s'il y a lieu
        if ((entreprise && typeof entreprise != "string") || (nom && typeof nom != "string") || (no_compte && typeof no_compte != "number") ||
            (telephone && typeof telephone != "string") || (courriel && typeof courriel != "string") || (po_client && typeof po_client != "string") ||
            (vendeur && typeof vendeur != "string") || (commentaire && typeof commentaire != "string") || (attention && typeof attention != "string")) {
            res.status(400).json({ "erreur": "Données invalides", "code": 4 });
        }
        // Validation longueur champs
        if ((entreprise && entreprise.length > 64) || (nom && nom.length > 64) || (no_compte && ((no_compte.toString().length > 9) || no_compte < 0 || !(Number.isInteger(no_compte)) ||
            no_compte > Number.MAX_SAFE_INTEGER)) || (telephone && telephone.length > 32) || (courriel && courriel.length > 255) || (po_client && po_client.length > 64) ||
            (vendeur && vendeur.length > 4) || (commentaire && commentaire.length > 512) || (attention && attention.length > 255)) {
            res.status(400).json({ "erreur": "Données invalides", "code": 5 });
        }
        /**
         * Validation adresse courriel valide
         * @see https://www.w3resource.com/javascript/form/email-validation.php
         */
        if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(courriel))) {
            res.status(400).json({ "erreur": "Données invalides", "code": 5 });
        }
        // Requête
        else {
            const modCommande = await pool.query(
                "UPDATE commandes SET entreprise = $1, nom = $2, no_compte = $3, telephone = $4, courriel = $5, po_client = $6, vendeur = $7, commentaire = $8, attention = $9, date_modification = CURRENT_TIMESTAMP WHERE id = $10 RETURNING *",
                [entreprise, nom, no_compte, telephone, courriel, po_client, vendeur, commentaire, attention, id]
            );
            // Succès
            const modEtat = await pool.query(
                "INSERT INTO etats (texte, commande_id) VALUES ('modifiée', $1)",
                [modCommande.rows[0].id]
            );
            res.json(modCommande.rows);
            sendMail(attention, "Modification d'une commande", "Une commande qui vous est assignée dans l\'application Sidekick a été modifiée.");
            console.log("Success PUT.");
        }
    } catch (error) {
        console.log(error.message);
    }
});

// Supprimer une commande
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        //  Requêtes
        const supprCommande = await pool.query("DELETE FROM commandes WHERE id = $1 RETURNING *", [id]);
        // Succès
        res.json(supprCommande.rows);
        console.log("Success DELETE.");
        sendMail(supprCommande.rows[0].attention, "Suppression d'une commande", "Une commande qui vous était assignée dans l\'application Sidekick a été supprimée.");
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;