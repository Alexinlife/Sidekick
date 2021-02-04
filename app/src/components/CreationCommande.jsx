import React from 'react'
import '../css/Style.css';
import axios from 'axios';
import NavBar from './rfc/NavBar';
import CreationProduits from './rfc/CreationProduits';
import { Formik, Form, useField, Field } from 'formik';
import * as Yup from 'yup';
// Composants Material-UI
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { MenuItem } from '@material-ui/core';

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

        // Localisation en français
        Yup.setLocale({
            mixed: {
                // eslint-disable-next-line
                default: 'Champ ${path} invalide',
                // eslint-disable-next-line
                required: 'Le champ ${path} est obligatoire'
            },
            string: {
                // eslint-disable-next-line
                max: 'Le champ ${path} doit contenir un maximum de ${max} caractères',
                // eslint-disable-next-line
                email: 'L\'adresse courriel doit être valide'
            },
            number: {
                // eslint-disable-next-line
                max: 'Le champ ${path} doit avoir un nombre inférieur à ${max}'
            }
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

            // Présentement inutile avec le select mis en place
            attention: Yup.string()
                .email()
                .max(255)
                .required(),
        });
    }

    /**
     * @author Alex Lajeunesse
     * @function render
     * @description Affiche l'interface.
     * @see https://www.youtube.com/watch?v=FD50LPJ6bjE pour Formik et MyTextField
     * @see https://formik.org/docs/examples/field-arrays pour les produits
     */
    render() {
        const MyTextField = ({ placeholder, ...props }) => {
            const [field, meta] = useField(props);
            const error = meta.error && meta.touched ? meta.error : '';
            return (
                <TextField
                    className="form-item"
                    placeholder={placeholder}
                    {...field}
                    helperText={error}
                    error={!!error}
                />
            );
        }
        return (
            <div>
                <header>
                    <NavBar />
                </header>
                <div className="content">
                    <h1>Créer une commande</h1>
                    <Formik
                        validateOnChange
                        initialValues={{ entreprise: '', nom: '', no_compte: '', telephone: '', courriel: '', po_client: '', vendeur: '', commentaire: '', attention: '' }}
                        onSubmit={(data, { setSubmitting }) => {
                            // Désactive les boutons
                            setSubmitting(true);
                            console.log(data);
                            // Envoie des informations à l'API
                            axios.post('http://localhost:5000/api/commandes/create', {
                                entreprise: data.entreprise,
                                nom: data.nom,
                                no_compte: data.no_compte,
                                telephone: data.telephone,
                                courriel: data.courriel,
                                po_client: data.po_client,
                                vendeur: data.vendeur,
                                commentaire: data.commentaire,
                                attention: data.attention
                            })
                            // Réactive les boutons
                            setSubmitting(false);
                        }}
                        validationSchema={this.schema}
                    >
                        {({ values, isSubmitting, handleChange, handleBlur, handleSubmit }) => (
                            <Form>
                                <Paper>
                                    <div>
                                        <MyTextField
                                            placeholder="Nom d'entreprise"
                                            name="entreprise"
                                        />
                                        <MyTextField
                                            placeholder="Numéro de compte"
                                            name="no_compte"
                                        />
                                        <MyTextField
                                            placeholder="Nom du client"
                                            name="nom"
                                        />
                                    </div>
                                    <div>
                                        <MyTextField
                                            placeholder="Téléphone"
                                            name="telephone"
                                        />
                                        <MyTextField
                                            placeholder="Courriel"
                                            name="courriel"
                                        />
                                        <MyTextField
                                            placeholder="PO du client"
                                            name="po_client"
                                        />
                                    </div>
                                    <div>
                                        <MyTextField
                                            placeholder="*Vendeur"
                                            name="vendeur"
                                        />
                                        <FormControl className="form-item">
                                            <InputLabel htmlFor="attention">*Attention</InputLabel>
                                            <Field
                                                type="select"
                                                as={Select}
                                                name="attention"
                                            >
                                                <MenuItem value={'alexinlife.exe@gmail.com'}>Alex Lajeunesse</MenuItem>
                                            </Field>
                                        </FormControl>
                                    </div>
                                    <div>
                                        <MyTextField
                                            placeholder="Commentaire"
                                            name="commentaire"
                                        />
                                    </div>
                                    <div>
                                        <Button className="form-item" disabled={isSubmitting} type="submit"><b>Enregistrer</b></Button>
                                    </div>
                                </Paper>
                            </Form>
                        )}
                    </Formik>
                    <CreationProduits />
                </div>
            </div>
        )
    }
}
