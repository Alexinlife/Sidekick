import React from 'react'
import '../css/Style.css';
import axios from 'axios';
import NavBar from './rfc/NavBar';
// Composants Material-UI
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
// Dialog
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// Material-UI Icons
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

/**
 * @author Alex Lajeunesse
 * @class Commande
 * @description Gère la page de commande individuelle (affichage, requêtes à l'API, redirection et suppression)
 */
export default class Commande extends React.Component {

    /**
     * @author Alex Lajeunesse
     * @constructor de Commande
     * @param {*} props Les propriétés React
     */
    constructor(props) {
        super();
        this.id = props.match.params.id;

        // handle boutons icône
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        // handle popup
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClickClose = this.handleClickClose.bind(this);

        // handle boutons de marquage
        this.handleMarkAsRead = this.handleMarkAsRead.bind(this);
        this.handleMarkAsDone = this.handleMarkAsDone.bind(this);
    }

    /**
     * @author Alex Lajeunesse
     * @function componentDidMount
     * @description Exécuté lorsque le composant est appelé
     */
    componentDidMount() {
        this.getCommande();
        this.getProduits();
        this.getEtats();
    }

    // Lorsque ses valeurs sont changées avec setState, un nouveau rendu est appelé
    state = {
        commande: [],
        produits: [],
        etats: [],
        open: false,
        read: false,
        done: false,
    }

    /**
     * @author Alex Lajeunesse
     * @function handleEdit
     * @description Gestion de l'icône de modification
     * @param {*} event Évènement React
     */
    handleEdit(event) {
        event.preventDefault();
        console.log("1");
    }

    /**
     * @author Alex Lajeunesse
     * @function handleDelete
     * @description Gestion de l'icône de modification
     * @param {*} event Évènement React
     */
    async handleDelete(event) {
        event.preventDefault();
        try {
            const response = await axios.delete(`http://localhost:5000/api/commandes/${this.id}`);
            // Succès
            console.log(response);
            // Fermeture du popup
            this.setState({
                open: false
            });
            // Redirection vers l'accueil
            window.location.replace("/");
            // Erreur
        } catch (error) {
            console.error(error);
        }
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
    };

    /**
     * @author Alex Lajeunesse
     * @function handleMarkAsRead
     * @description Gestion du bouton "Marquer comme lu"
     */
    async handleMarkAsRead() {
        // Ajouter un état "Lue" lié à la commande
        try {
            const response = await axios.post(`http://localhost:5000/api/etats/create/${this.id}`, {
                texte: "lue",
            });
            // Succès
            console.log(response);
            window.location.replace("/");
            // Erreur
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * @author Alex Lajeunesse
     * @function handleMarkAsDone
     * @description Gestion du bouton "Marquer comme complétée"
     */
    async handleMarkAsDone() {
        // Ajouter un état "Lue" lié à la commande
        try {
            const response = await axios.post(`http://localhost:5000/api/etats/create/${this.id}`, {
                texte: "complétée",
            });
            // Succès
            console.log(response);
            window.location.replace("/");
            // Erreur
        } catch (error) {
            console.error(error);
        }
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
                produits: response.data
            });
            // Erreur
        } catch (error) {
            console.error(error);
        }
    }

    /**
    * @author Alex Lajeunesse
    * @function getEtats
    * @description Effectue une requête à l'api pour retrouver tous les états de la commande
    */
    async getEtats() {
        try {
            const response = await axios.get(`http://localhost:5000/api/etats/${this.id}`);
            // Succès
            console.log(response);
            response.data.forEach(etat => {
                // Désactiver "Marquer comme lue" si lue
                if (etat.texte === "lue") {
                    this.setState({
                        read: true,
                    });
                }
                // Désactiver "Marquer comme terminée" si terminée
                if (etat.texte === "complétée") {
                    this.setState({
                        done: true,
                    });
                }
            });
            // La réponse de l'API est enregistré dans le state
            this.setState({
                etats: response.data
            });
            // Erreur
        } catch (error) {
            console.error(error);
        }
    }

    render() {
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
                            <DialogTitle id="alert-dialog-title">{"Supprimer la commande ?"}</DialogTitle>
                            {/* Corps */}
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Souhaitez-vous vraiment supprimer la commande défintivement ? Ceci inclut tous les produits et les états associés.</DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleClickClose} color="primary">Annuler</Button>
                                <Button onClick={this.handleDelete} color="primary" autoFocus>Oui</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <h1>Détails de la commande no. {this.id}</h1>
                    {/* Tableau de l'en-tête de commande */}
                    <TableContainer component={Paper}>
                        <Table className="table" aria-label="simple table">
                            {/* En-tête du tableau */}
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center"></TableCell>
                                    <TableCell align="center">Entreprise</TableCell>
                                    <TableCell align="center">Nom</TableCell>
                                    <TableCell align="center">PO du client</TableCell>
                                    <TableCell align="center">Vendeur</TableCell>
                                    <TableCell align="center">Date de modification</TableCell>
                                    <TableCell align="center">Date de création</TableCell>
                                </TableRow>
                            </TableHead>
                            {/* Corps du tableau (ligne) */}
                            <TableBody>
                                {this.state.commande.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell align="center">
                                            <IconButton edge="start" className="tab-icons" color="inherit" aria-label="menu" onClick={this.handleEdit}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton edge="start" className="tab-icons" color="inherit" aria-label="menu" onClick={this.handleClickOpen}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align="center">{row.entreprise || "-"}</TableCell>
                                        <TableCell align="center">{row.nom}</TableCell>
                                        <TableCell align="center">{row.po || "-"}</TableCell>
                                        <TableCell align="center">{row.vendeur}</TableCell>
                                        <TableCell align="center">{row.date_modification || "-"}</TableCell>
                                        <TableCell align="center">{row.date_creation}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* Section commentaire */}
                    {this.state.commande.map((row) => (
                        row.commentaire ? <Paper key={row.id}>
                            <h3 className="comments-title">commentaire</h3>
                            <div className="comments-text">{row.commentaire}</div>
                        </Paper> : ""
                    ))}
                    <h1>Produits</h1>
                    {/* Tableau des produits de la commande */}
                    <TableContainer component={Paper}>
                        <Table className="table" aria-label="simple table">
                            {/* En-tête du tableau */}
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Quantité demandée</TableCell>
                                    <TableCell align="center">Quantité recueillie</TableCell>
                                    <TableCell align="center"></TableCell>
                                    <TableCell align="center">Code</TableCell>
                                    <TableCell align="center">Description</TableCell>
                                    <TableCell align="center">Prix</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* Lignes de produits dans le tableau */}
                                {this.state.produits.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell align="center">{row.qte_demandee}</TableCell>
                                        <TableCell align="center">{row.qte_recueillie || 0}</TableCell>
                                        <TableCell align="center"></TableCell>
                                        <TableCell align="center">{row.code || "-"}</TableCell>
                                        <TableCell align="center">{row.description || "-"}</TableCell>
                                        <TableCell align="center">{row.prix ? row.prix + "$" : "-"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <h1>Liste des états</h1>
                    {/* Tableau des états de la commande */}
                    <TableContainer component={Paper}>
                        <Table className="table" aria-label="simple table">
                            <TableBody>
                                {/* Lignes du tableau */}
                                {this.state.etats.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell align="center">{row.texte} le {row.date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* Section des boutons de marquage */}
                    <Paper className="paper-button">
                        <div>
                            <Button className="form-button" disabled={this.state.read || this.state.done} onClick={this.handleMarkAsRead}><b>Marquer comme lue</b></Button>
                            <Button className="form-button" disabled={this.state.done} onClick={this.handleMarkAsDone}><b>Terminer la commande</b></Button>
                        </div>
                    </Paper>
                </div>
            </div >
        )
    }
}
