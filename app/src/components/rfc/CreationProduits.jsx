import React from 'react';
import '../../css/Style.css';
import { Formik, Form, FieldArray, useField } from 'formik';
import * as Yup from 'yup';
// Composants Material-UI
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const initialValues = {
    produits: [
        {
            code: '',
            descrption: '',
            qte_demandee: '',
            prix: ''
        },
    ],
};

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
    },
    number: {
        // eslint-disable-next-line
        integer: 'Le champ ${path} doit contenir un nombre entier',
        // eslint-disable-next-line
        positive: 'Le champ ${path} doit contenir un nombre positif',
        // eslint-disable-next-line
        min: 'Le champ ${path} doit avoir un nombre supérieur à ${min}'
    }
});

// Schéma de validation Yup
const schema = Yup.object({
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
                .typeError('Le champs ${path} doit contenir un nombre')
        })
    )
});

const MyTextField = ({ placeholder, ...props }) => {
    const [field, meta] = useField(props);
    const error = meta.error && meta.touched ? meta.error : '';
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

/**
 * @author Alex Lajeunesse
 * @function CréerProduits
 * @description Gère la section d'ajout de produits (affichage, requêtes à l'API, redirection et formulaires)
 * @see https://formik.org/docs/examples/field-arrays
 */
export default function CreerProduits() {
    return (
        <div>
            <h1>Produits</h1>
            <Paper>
                <Formik
                    validateOnChange
                    initialValues={initialValues}
                    onSubmit={(data, { setSubmitting }) => {
                        setSubmitting(true);
                        console.log(data);
                        setSubmitting(false);
                    }}
                    validationSchema={schema}
                >
                    {({ values, isSubmitting, handleChange, handleBlur, handleSubmit }) => (
                        <Form>
                            <FieldArray name="produits">
                                {({ insert, remove, push }) => (
                                    <div>
                                        {values.produits.length > 0 &&
                                            values.produits.map((produit, index) => (
                                                <div className="row" key={index}>
                                                    <div className="col">
                                                        <MyTextField
                                                            name={`produits.${index}.qte_demandee`}
                                                            placeholder="Quantité demandée"
                                                            type="text"
                                                        />
                                                        <MyTextField
                                                            name={`produits.${index}.code`}
                                                            placeholder="Code"
                                                            type="text"
                                                        />
                                                        <MyTextField
                                                            name={`produits.${index}.description`}
                                                            placeholder="Description"
                                                            type="text"
                                                        />
                                                        <MyTextField
                                                            name={`produits.${index}.prix`}
                                                            placeholder="Prix"
                                                            type="text"
                                                        />
                                                        <Button className="form-button" disabled={isSubmitting} onClick={() => remove(index)}><b>X</b></Button>
                                                    </div>
                                                    <div className="col">
                                                    </div>
                                                </div>
                                            ))}
                                        <Button className="form-item" disabled={isSubmitting}
                                            onClick={() => push({ code: '', descrption: '', qte_demandee: '', prix: '' })}
                                        ><b>Ajouter un produit</b></Button>
                                    </div>
                                )}
                            </FieldArray>
                            <Button className="form-item" disabled={isSubmitting} type="submit"><b>Enregistrer</b></Button>
                            <p className="produits-note"><b>Attention : </b>Veuillez enregistrer l'en-tête de la commande avant d'enregistrer les produits.</p>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </div>
    );
}