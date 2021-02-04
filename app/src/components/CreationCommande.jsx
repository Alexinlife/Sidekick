import React from 'react'
import '../css/Style.css';
import NavBar from './rfc/NavBar';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
// Composants Material-UI
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

/**
 * @author Alex Lajeunesse
 * @class CreationCommande
 * @description Gère la page de création et de modification de commandes (affichage, requêtes à l'API, redirection et formulaires)
 */
export default class CreationCommande extends React.Component {

    constructor(props) {
        super();

        // Localisation en français
        Yup.setLocale({
            mixed: {
                default: 'Champ ${path} invalide',
                required: 'Le champ ${path} est obligatoire'
            },
            string: {
                max: 'Le champ ${path} doit contenir un maximum de ${max} caractères',
                email: 'L\'adresse courriel doit être valide'
            },
            number: {
                max: 'Le champ ${path} doit avoir un nombre inférieur à ${max}'
            }
        });

        this.schema = Yup.object({
            entreprise: Yup.string()
                .max(64),

            nom: Yup.string()
                .max(64),

            no_compte: Yup.number()
                .max(169999999)
                .typeError('Le champs ${path} doit contenir un nombre'),

            telephone: Yup.string()
                .max(32),

            courriel: Yup.string()
                .email()
                .max(255),

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
                .required()
        });
    }

    /**
     * @author Alex Lajeunesse
     * @function render
     * @description Affiche l'interface.
     * @see https://www.youtube.com/watch?v=FD50LPJ6bjE
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
                    <Paper>
                        <Formik
                            validateOnChange
                            initialValues={{ entreprise: '', nom: '', no_compte: '', telephone: '', courriel: '', po_client: '', vendeur: '', commentaire: '', attention: '' }}
                            onSubmit={(data, { setSubmitting }) => {
                                setSubmitting(true);
                                console.log(data);
                                setSubmitting(false);
                            }}
                            validationSchema={this.schema}
                        >
                            {({ values, isSubmitting, handleChange, handleBlur, handleSubmit }) => (
                                <Form>
                                    <div>
                                        <MyTextField
                                            placeholder="Nom d'entreprise"
                                            name="entreprise"
                                            type="input"
                                            as={TextField}
                                        />
                                        <MyTextField
                                            placeholder="Numéro de compte"
                                            name="no_compte"
                                            type="input"
                                            as={TextField}
                                        />
                                        <MyTextField
                                            placeholder="Nom du client"
                                            name="nom"
                                            type="input"
                                            as={TextField}
                                        />
                                    </div>
                                    <div>
                                        <MyTextField
                                            placeholder="Téléphone"
                                            name="telephone"
                                            type="input"
                                            as={TextField}
                                        />
                                        <MyTextField
                                            placeholder="Courriel"
                                            name="courriel"
                                            type="input"
                                            as={TextField}
                                        />
                                        <MyTextField
                                            placeholder="PO du client"
                                            name="po_client"
                                            type="input"
                                            as={TextField}
                                        />
                                    </div>
                                    <div>
                                        <MyTextField
                                            placeholder="*Vendeur"
                                            name="vendeur"
                                            type="input"
                                            as={TextField}
                                        />
                                        <MyTextField
                                            placeholder="*Attention"
                                            name="attention"
                                            type="input"
                                            as={TextField}
                                        />
                                    </div>
                                    <div>
                                        <MyTextField
                                            placeholder="Commentaire"
                                            name="commentaire"
                                            type="input"
                                            as={TextField}
                                        />
                                    </div>
                                    <div>
                                        <Button className="form-item" disabled={isSubmitting} type="submit"><b>Enregistrer</b></Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Paper>
                </div>
            </div>
        )
    }
}
