import React from 'react'
import '../css/Style.css';
import axios from 'axios';
import NavBar from './rfc/NavBar';
import { Formik, Form, FieldArray, useField, Field } from 'formik';
import * as Yup from 'yup';
// Composants Material-UI
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { MenuItem } from '@material-ui/core';
// Dialog
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

/**
 * @author Alex Lajeunesse
 * @class CreationCommande
 * @description Gère la page de création et de modification de commandes (affichage, requêtes à l'API, redirection et formulaires)
 */
export default class CreationCommande extends React.Component {

    /**
     * @author Alex Lajeunesse
     * @constructor de CreationCommande
     * @param {*} props Les propriétés React
     */
    constructor(props) {
        super();
        this.id = props.match.params.id;
        console.log(this.id);

        // handle popup
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClickClose = this.handleClickClose.bind(this);

        // Localisation en français
        Yup.setLocale({
            mixed: {
                // eslint-disable-next-line
                default: 'Champ ${path} invalide',
                // eslint-disable-next-line
                required: 'Le champ ${path} est obligatoire',
            },
            string: {
                // eslint-disable-next-line
                max: 'Le champ ${path} doit contenir un maximum de ${max} caractères',
                // eslint-disable-next-line
                email: 'L\'adresse courriel doit être valide',
            },
            number: {
                // eslint-disable-next-line
                integer: 'Le champ ${path} doit contenir un nombre entier',
                // eslint-disable-next-line
                positive: 'Le champ ${path} doit contenir un nombre positif',
                // eslint-disable-next-line
                min: 'Le champ ${path} doit avoir un nombre supérieur à ${min}',
                // eslint-disable-next-line
                max: 'Le champ ${path} doit avoir un nombre inférieur à ${max}',
            },
        });

        /**
         * @description Schéma de validation Yup
         * @see https://krzysztofzuraw.com/blog/2020/yup-validation-two-fields pour test()
         */
        this.schema = Yup.object({
            /* DÉBUT VALIDATION EN-TÊTE COMMANDE */
            commande: Yup.object({
                entreprise: Yup.string()
                    .max(64)
                    .test(
                        'ouInclusifEntrNom', // test name
                        'Au moins l\'un des champs entreprise et nom doit être rempli', // validation message to the user
                        // it has to be function definition to use 'this'
                        function (entreprise) {
                            const { nom } = this.parent;
                            if (entreprise || nom) {
                                return true; // lorsqu'il y a au moins un champs de rempli
                            }
                            return false;
                        }
                    )
                    .test(
                        'ouInclusifEntrTelCourriel', // test name
                        'Le client n\'a présentement aucune information de contact', // validation message to the user
                        // it has to be function definition to use 'this'
                        function (entreprise) {
                            const { telephone, courriel } = this.parent;
                            if (entreprise || telephone || courriel) {
                                return true; // lorsqu'il y a au moins un champs de rempli
                            }
                            return false;
                        }
                    ),

                nom: Yup.string()
                    .max(64)
                    .test(
                        'ouInclusifEntrNom', // test name
                        'Au moins l\'un des champs entreprise et nom doit être rempli', // validation message to the user
                        // it has to be function definition to use 'this'
                        function (nom) {
                            const { entreprise } = this.parent;
                            if (entreprise || nom) {
                                return true; // lorsqu'il y a au moins un champs de rempli
                            }
                            return false;
                        }
                    ),

                no_compte: Yup.number()
                    .max(169999999)
                    // eslint-disable-next-line
                    .typeError('Le champs ${path} doit contenir un nombre'),

                telephone: Yup.string()
                    .max(32)
                    .test(
                        'ouInclusifEntrTelCourriel', // test name
                        'Le client n\'a présentement aucune information de contact', // validation message to the user
                        // it has to be function definition to use 'this'
                        function (telephone) {
                            const { entreprise, courriel } = this.parent;
                            if (entreprise || telephone || courriel) {
                                return true; // lorsqu'il y a au moins un champs de rempli
                            }
                            return false;
                        }
                    ),

                courriel: Yup.string()
                    .email()
                    .max(255)
                    .test(
                        'ouInclusifEntrTelCourriel', // test name
                        'Le client n\'a présentement aucune information de contact', // validation message to the user
                        // it has to be function definition to use 'this'
                        function (courriel) {
                            const { entreprise, telephone } = this.parent;
                            if (entreprise || telephone || courriel) {
                                return true; // lorsqu'il y a au moins un champs de rempli
                            }
                            return false;
                        }
                    ),

                po_client: Yup.string()
                    .max(64),

                vendeur: Yup.string()
                    .max(4)
                    .required(),

                commentaire: Yup.string()
                    .max(512),

                attention: Yup.string()
                    .email()
                    .max(255)
                    .required(),
            }),
            /* FIN VALIDATION EN-TÊTE COMMANDE */

            // Validation pour chaque produit
            produits: Yup.array().of(
                Yup.object({
                    code: Yup.string()
                        .max(32)
                        .test(
                            'ouInclusifCodeDesc', // test name
                            'Au moins l\'un des champs code et description doit être rempli', // validation message to the user
                            // it has to be function definition to use 'this'
                            function (code) {
                                const { description } = this.parent;
                                if (code || description) {
                                    return true; // lorsqu'il y a au moins un champs de rempli
                                }
                                return false;
                            }
                        ),

                    description: Yup.string()
                        .max(255)
                        .test(
                            'ouInclusifCodeDesc', // test name
                            'Au moins l\'un des champs code et description doit être rempli', // validation message to the user
                            // it has to be function definition to use 'this'
                            function (description) {
                                const { code } = this.parent;
                                if (code || description) {
                                    return true; // lorsqu'il y a au moins un champs de rempli
                                }
                                return false;
                            }
                        ),

                    qte_demandee: Yup.number()
                        .integer()
                        .min(1)
                        .required()
                        // eslint-disable-next-line
                        .typeError('Le champs ${path} doit contenir un nombre'),

                    prix: Yup.number()
                        .min(0.0050)
                        .positive()
                        // eslint-disable-next-line
                        .typeError('Le champs ${path} doit contenir un nombre'),
                })
            )
        });
    }

    /**
     * @author Alex Lajeunesse
     * @function componentDidMount
     * @description Exécuté lorsque le composant est appelé
     */
    componentDidMount() {
        this.getCommande();
        this.getProduits();
    }

    /**
    * @author Alex Lajeunesse
    * @function getCommande
    * @description Effectue une requête à l'api pour retrouver la commande appropriée
    */
    async getCommande() {
        try {
            const response = await axios.get(`http://localhost:5000/api/commandes/${this.id}`);
            // Succès
            console.log(response);
            // La réponse de l'API est enregistré dans le state
            this.setState({
                commande: response.data
            });
            // Erreur
        } catch (error) {
            console.error(error);
        }
    }

    /**
    * @author Alex Lajeunesse
    * @function getProduits
    * @description Effectue une requête à l'api pour retrouver tous les produits de la commande
    */
    async getProduits() {
        try {
            const response = await axios.get(`http://localhost:5000/api/produits/${this.id}`);
            // Succès
            console.log(response);
            // La réponse de l'API est enregistré dans le state
            this.setState({
                produits: response.data,
                editing: true,
            });
            // Erreur
        } catch (error) {
            console.error(error);
        }
    }

    // Lorsque ses valeurs sont changées avec setState, un nouveau rendu est appelé
    state = {
        open: false,
        editing: false,
        commande: [],
        produits: [],
    }

    /**
     * @description Ouverture du popup
     * @see https://material-ui.com/components/dialogs/#confirmation-dialogs
     */
    handleClickOpen() {
        this.setState({
            open: true
        });
    };

    /**
     * @description Fermeture du popup
     * @see https://material-ui.com/components/dialogs/#confirmation-dialogs
     */
    handleClickClose() {
        this.setState({
            open: false
        });
        // Redirection vers l'accueil
        window.location.replace("/");
    };

    /**
     * @author Alex Lajeunesse
     * @function render
     * @description Affiche l'interface de la page et prépare le formulaire.
     * @see https://www.youtube.com/watch?v=FD50LPJ6bjE pour Formik et TextField
     * @see https://formik.org/docs/examples/field-arrays pour les produits
     */
    render() {
        // Champs de l'en-tête de la commande
        const OrderTextField = ({ placeholder, ...props }) => {
            const [field, meta] = useField(props);
            // Erreur si un champ a été touché et que la validation a échoué
            const error = meta.error && meta.touched ? meta.error : '';
            // Format de base pour OrderTextField
            return (
                <TextField
                    className="order-form-item"
                    placeholder={placeholder}
                    {...field}
                    helperText={error}
                    error={!!error}
                />
            );
        }
        // Champs des produits de la commande
        const ProductTextField = ({ placeholder, ...props }) => {
            const [field, meta] = useField(props);
            // Erreur si un champ a été touché et que la validation a échoué
            const error = meta.error && meta.touched ? meta.error : '';
            // Format de base pour OrderTextField
            return (
                <TextField
                    className="product-form-item"
                    placeholder={placeholder}
                    {...field}
                    helperText={error}
                    error={!!error}
                />
            );
        }

        // Valeurs initiales du formulaire
        var initialValues = undefined;

        if (this.state.editing) {
            initialValues = {
                commande: this.state.commande[0],
                produits: this.state.produits
            }
            console.log("initialValues :");
            console.log(initialValues);
            console.log("Mode édition");
        } else {
            // Les valeurs initiales lors de la création d'une commande
            initialValues = {
                // En-tête
                commande: {
                    entreprise: '',
                    nom: '',
                    no_compte: undefined,
                    telephone: '',
                    courriel: '',
                    po_client: '',
                    vendeur: '',
                    commentaire: '',
                    attention: '',
                },
                // Produits
                produits: [
                    {
                        code: '',
                        descrption: '',
                        qte_demandee: '',
                        prix: undefined,
                    },
                ],
            };
            console.log("initialValues :");
            console.log(initialValues);
            console.log("Mode création");
        }

        // Affichage de l'interface
        return (
            <div>
                {/* En-tête avec NavBar */}
                <header>
                    <NavBar />
                </header>
                {/* Corps de la page */}
                <div className="content">
                    {/* Popup de confirmation */}
                    <div>
                        <Dialog
                            open={this.state.open}
                            onClose={this.handleClickClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description">
                            {/* Titre */}
                            <DialogTitle id="alert-dialog-title">{"Commande créée avec succès !"}</DialogTitle>
                            {/* Corps */}
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    La commande a été créée avec succès ! Un courriel a été envoyé à la personne mentionnée.</DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleClickClose} color="primary">Ok</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <h1>Créer une commande</h1>
                    {/* Formulaire de création (en-tête) */}
                    <Formik
                        validateOnChange
                        initialValues={initialValues}
                        onSubmit={async (data, { setSubmitting, resetForm }) => {
                            // Désactive le bouton "Enregistrer"
                            setSubmitting(true);
                            console.log(data);
                            try {
                                // Enregistrement de la commande
                                const orderResponse = await axios.post('http://localhost:5000/api/commandes/create', {
                                    entreprise: data.commande.entreprise,
                                    nom: data.commande.nom,
                                    no_compte: data.commande.no_compte,
                                    telephone: data.commande.telephone,
                                    courriel: data.commande.courriel,
                                    po_client: data.commande.po_client,
                                    vendeur: data.commande.vendeur,
                                    commentaire: data.commande.commentaire,
                                    attention: data.commande.attention,
                                });
                                console.log(orderResponse);
                                // Préparation de l'URL d'envoi avec l'id de la commande
                                const productURL = 'http://localhost:5000/api/produits/create/' + orderResponse.data[0][0].id
                                var productResponse = [];
                                // Ajout de chaque produit à la commande via une requête POST
                                for (let p = 0; p < data.produits.length; p++) {
                                    productResponse[p] = await axios.post(productURL.toString(), {
                                        code: data.produits[p].code,
                                        description: data.produits[p].description,
                                        qte_demandee: data.produits[p].qte_demandee,
                                        prix: data.produits[p].prix,
                                    });
                                }
                                // Succès
                                console.log(productResponse);
                                // Ouvre le popup d'information
                                this.handleClickOpen();
                                // Erreur
                            } catch (error) {
                                console.log(error);
                            }
                            // Réactive le bouton "Enregistrer"
                            setSubmitting(false);
                        }}
                        // Schéma de validation utilisé
                        validationSchema={this.schema}
                    >
                        {/* Formulaire de création (interface) */}
                        {({ values, isSubmitting, handleChange, handleBlur, handleSubmit }) => (
                            <Form>
                                {/* En-tête de la commande */}
                                <Paper>
                                    {/* Première ligne */}
                                    <div>
                                        <OrderTextField
                                            placeholder="Nom d'entreprise"
                                            name="commande.entreprise"
                                        />
                                        <OrderTextField
                                            placeholder="Numéro de compte"
                                            name="commande.no_compte"
                                        />
                                        <OrderTextField
                                            placeholder="Nom du client"
                                            name="commande.nom"
                                        />
                                    </div>
                                    {/* Deuxième ligne */}
                                    <div>
                                        <OrderTextField
                                            placeholder="Téléphone"
                                            name="commande.telephone"
                                        />
                                        <OrderTextField
                                            placeholder="Courriel"
                                            name="commande.courriel"
                                        />
                                        <OrderTextField
                                            placeholder="PO du client"
                                            name="commande.po_client"
                                        />
                                    </div>
                                    {/* Troisième ligne */}
                                    <div>
                                        <OrderTextField
                                            placeholder="*Vendeur"
                                            name="commande.vendeur"
                                        />
                                        <OrderTextField
                                            placeholder="Commentaire"
                                            name="commande.commentaire"
                                        />
                                    </div>
                                    {/* Quatrième ligne */}
                                    <div>
                                        <FormControl className="order-form-item">
                                            <InputLabel htmlFor="attention">*Attention</InputLabel>
                                            <Field
                                                type="select"
                                                as={Select}
                                                name="commande.attention"
                                            >
                                                <MenuItem value={'alexinlife.exe@gmail.com'}>Alex Lajeunesse</MenuItem>
                                            </Field>
                                        </FormControl>
                                    </div>
                                </Paper>
                                <h1>Produits</h1>
                                {/* Produits de la commande */}
                                <Paper>
                                    <FieldArray name="produits">
                                        {({ insert, remove, push }) => (
                                            <div>
                                                {values.produits.length > 0 &&
                                                    values.produits.map((produit, index) => (
                                                        <div className="row" key={index}>
                                                            <div className="col">
                                                                <ProductTextField
                                                                    name={`produits.${index}.qte_demandee`}
                                                                    placeholder="*Quantité demandée"
                                                                    type="text"
                                                                />
                                                                <ProductTextField
                                                                    name={`produits.${index}.code`}
                                                                    placeholder="Code"
                                                                    type="text"
                                                                />
                                                                <ProductTextField
                                                                    name={`produits.${index}.description`}
                                                                    placeholder="Description"
                                                                    type="text"
                                                                />
                                                                <ProductTextField
                                                                    name={`produits.${index}.prix`}
                                                                    placeholder="Prix"
                                                                    type="text"
                                                                />
                                                                {/* Bouton de suppression de ligne */}
                                                                <Button className="form-delete-button" disabled={isSubmitting} onClick={() => remove(index)}><b>X</b></Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                {/* Bouton d'ajout de ligne */}
                                                <Button className="form-button" disabled={isSubmitting}
                                                    onClick={() => push({ code: '', descrption: '', qte_demandee: '', prix: undefined })}
                                                ><b>Ajouter un produit</b></Button>
                                            </div>
                                        )}
                                    </FieldArray>
                                </Paper>
                                {/* Section du bouton de sauvegarde */}
                                <Paper className="paper-button">
                                    <div>
                                        <Button className="form-button" disabled={isSubmitting} type="submit"><b>Enregistrer</b></Button>
                                    </div>
                                </Paper>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        )
    }
}
