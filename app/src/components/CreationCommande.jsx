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

        // Schéma de validation Yup
        this.schema = Yup.object({
            entreprise: Yup.string()
                .max(64)
                /**
                 * @see https://krzysztofzuraw.com/blog/2020/yup-validation-two-fields
                 */
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
                /**
                 * @see https://krzysztofzuraw.com/blog/2020/yup-validation-two-fields
                 */
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
                /**
                 * @see https://krzysztofzuraw.com/blog/2020/yup-validation-two-fields
                 */
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
                /**
                 * @see https://krzysztofzuraw.com/blog/2020/yup-validation-two-fields
                 */
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

            produits: Yup.array().of(
                Yup.object({
                    code: Yup.string()
                        .max(32)
                        /**
                         * @see https://krzysztofzuraw.com/blog/2020/yup-validation-two-fields
                         */
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
                        /**
                         * @see https://krzysztofzuraw.com/blog/2020/yup-validation-two-fields
                         */
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

    // Exécuté lorsque le composant est appelé
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
            console.log(response);
            // La réponse de l'API est enregistré dans le state
            this.setState({
                commande: response.data
            });
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
            console.log(response);
            // La réponse de l'API est enregistré dans le state
            this.setState({
                produits: response.data,
                editing: true,
            });
        } catch (error) {
            console.error(error);
        }
    }

    state = {
        open: false,
        editing: false,
        commande: [],
        produits: [],
    }

    // Lorsque l'utilisateur clique sur l'icône de suppression
    handleClickOpen() {
        this.setState({
            open: true
        });
    };

    // Lorsque l'utilisateur ferme l'Alert de suppression
    handleClickClose() {
        this.setState({
            open: false
        });
        window.location.replace("/");
    };

    /**
     * @author Alex Lajeunesse
     * @function render
     * @description Affiche l'interface.
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

        return (
            <div>
                <header>
                    <NavBar />
                </header>
                <div className="content">
                    <div>
                        <Dialog
                            open={this.state.open}
                            onClose={this.handleClickClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description">
                            <DialogTitle id="alert-dialog-title">{"Commande créée avec succès !"}</DialogTitle>
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
                                        descrption: data.produits[p].descrption,
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
                        {({ values, isSubmitting, handleChange, handleBlur, handleSubmit }) => (
                            <Form>
                                <Paper>
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
                                                                <Button className="form-delete-button" disabled={isSubmitting} onClick={() => remove(index)}><b>X</b></Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                <Button className="form-button" disabled={isSubmitting}
                                                    onClick={() => push({ code: '', descrption: '', qte_demandee: '', prix: undefined })}
                                                ><b>Ajouter un produit</b></Button>
                                            </div>
                                        )}
                                    </FieldArray>
                                </Paper>
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
