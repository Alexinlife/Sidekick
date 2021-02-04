const express = require('express');
const Joi = require('joi');
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
 * @author Alex Lajeunesse
 * @function sendMail
 * @description Compose un message avant de l'envoyer via Nodemailer
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

// Validation Joi pour les champs
const schema = Joi.object({
    entreprise: Joi.string()
        .allow("")
        .max(64),

    nom: Joi.string()
        .allow("")
        .max(64),

    no_compte: Joi.string()
        .allow("")
        .max(9)
        .pattern(/^\d+$/),

    telephone: Joi.string()
        .allow("")
        .max(32),

    courriel: Joi.string()
        .allow("")
        .email()
        .max(255),

    po_client: Joi.string()
        .allow("")
        .max(64),

    vendeur: Joi.string()
        .max(4)
        .required(),

    commentaire: Joi.string()
        .allow("")
        .max(512),

    attention: Joi.string()
        .email()
        .max(255)
        .required()
})
    .or('entreprise', 'nom')
    .or('entreprise', 'telephone', 'courriel');

// Validation Joi pour l'identifiant
const schemaForId = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .required()
});

/**
 * @author Alex Lajeunesse
 * @function validateCommande
 * @description Valide les paramètres entrés avec Joi
 * @param {*} entreprise Le nom de l'entreprise à valider
 * @param {*} nom Le nom du client à valider
 * @param {*} no_compte Le numéro du compte à valider
 * @param {*} telephone Le téléphone du client à valider
 * @param {*} courriel L'adresse courriel du client à valider
 * @param {*} po_client Le numéro de commande du client à valider
 * @param {*} vendeur Les initiales du vendeur à valider
 * @param {*} commentaire Le commentaire de la commande à valider
 * @param {*} attention Le courriel auquel envoyer la notification à valider
 */
async function validateCommande(entreprise, nom, no_compte, telephone, courriel, po_client, vendeur, commentaire, attention) {
    try {
        const validation = await schema.validateAsync({
            entreprise: entreprise,
            nom: nom,
            no_compte: no_compte,
            telephone: telephone,
            courriel: courriel,
            po_client: po_client,
            vendeur: vendeur,
            commentaire: commentaire,
            attention: attention
        });
        // Succès
        console.log(validation);
        return true;
        // Erreur
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * @author Alex Lajeunesse
 * @function validateId
 * @description Valide l'identifiant avec Joi
 * @param {*} id L'identifiant à valider
 */
async function validateId(id) {
    try {
        const validation = await schemaForId.validateAsync({
            id: id
        });
        // Succès
        console.log(validation);
        return true;
        // Erreur
    } catch (error) {
        console.log(error);
        return false;
    }
}

// Créer une commande
router.post('/create', async (req, res) => {
    try {
        const { entreprise, nom, no_compte, telephone, courriel, po_client, vendeur, commentaire, attention } = req.body;
        // Requête
        if (await validateCommande(entreprise, nom, no_compte, telephone, courriel, po_client, vendeur, commentaire, attention)) {
            const nouvCommande = await pool.query(
                "INSERT INTO commandes (entreprise, nom, no_compte, telephone, courriel, po_client, vendeur, commentaire, attention) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
                [entreprise, nom, no_compte, telephone, courriel, po_client, vendeur, commentaire, attention]
            );
            // Succès
            const nouvEtat = await pool.query(
                "INSERT INTO etats (texte, commande_id) VALUES ('nouvelle', $1)",
                [nouvCommande.rows[0].id]
            );
            res.json([nouvCommande.rows, nouvEtat.rows]);
            sendMail(attention, "Nouvelle commande", "Une nouvelle commande vous est assignée dans l\'application Sidekick.");
            console.log("Success POST.");
            // Ereur
        } else {
            res.status(400).json({ "erreur": "Données invalides" });
        }
    } catch (error) {
        console.log(error.message);
    }
});

// Afficher toutes les commandes
router.get('/', async (req, res) => {
    try {
        // Requête
        const commandes = await pool.query("SELECT * FROM commandes ORDER BY date_creation DESC");
        // Succès
        res.json(commandes.rows);
        console.log("Success GET.");
        // Erreur
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
        // Erreur
    } catch (error) {
        console.log(error.message);
    }
});

// Modifier une commande
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { entreprise, nom, no_compte, telephone, courriel, po_client, vendeur, commentaire, attention } = req.body;
        // Requête
        if (await validateCommande(entreprise, nom, no_compte, telephone, courriel, po_client, vendeur, commentaire, attention) && await validateId(id)) {
            const modCommande = await pool.query(
                "UPDATE commandes SET entreprise = $1, nom = $2, no_compte = $3, telephone = $4, courriel = $5, po_client = $6, vendeur = $7, commentaire = $8, attention = $9, date_modification = CURRENT_TIMESTAMP WHERE id = $10 RETURNING *",
                [entreprise, nom, no_compte, telephone, courriel, po_client, vendeur, commentaire, attention, id]
            );
            // Succès
            const modEtat = await pool.query(
                "INSERT INTO etats (texte, commande_id) VALUES ('modifiée', $1)",
                [modCommande.rows[0].id]
            );
            res.json([modCommande.rows, modEtat.rows]);
            sendMail(attention, "Modification d'une commande", "Une commande qui vous est assignée dans l\'application Sidekick a été modifiée.");
            console.log("Success PUT.");
            // Ereur
        } else {
            res.status(400).json({ "erreur": "Données invalides" });
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
        // Erreur
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;