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

    // Constructeur
    constructor(props) {
        super();
        this.id = props.match.params.id;
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClickClose = this.handleClickClose.bind(this);
    }

    componentDidMount() {
        this.getCommande();
        this.getProduits();
        this.getEtats();
    }

    state = {
        commande: [],
        produits: [],
        etats: [],
        open: false,
    }

    // Lorsque l'utilisateur clique sur l'icône de modification
    handleEdit(event) {
        event.preventDefault();
        console.log("1");
    }

    // Lorsque l'utilisateur clique sur "Oui" dans l'Alert de suppression
    async handleDelete(event) {
        event.preventDefault();
        try {
            const response = await axios.delete(`http://localhost:5000/api/commandes/${this.id}`);
            console.log(response);
            this.setState({
                open: false
            });
            window.location.replace("/");
        } catch (error) {
            console.error(error);
        }
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
    };

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
                produits: response.data
            });
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
            console.log(response);
            // La réponse de l'API est enregistré dans le state
            this.setState({
                etats: response.data
            });
        } catch (error) {
            console.error(error);
        }
    }

    render() {
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
                            <DialogTitle id="alert-dialog-title">{"Supprimer la commande ?"}</DialogTitle>
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
                    <TableContainer component={Paper}>
                        <Table className="table" aria-label="simple table">
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
                    {this.state.commande.map((row) => (
                        row.commentaire ? <Paper key={row.id}>
                            <h3 className="comments-title">commentaire</h3>
                            <div className="comments-text">{row.commentaire}</div>
                        </Paper> : ""
                    ))}
                    <h1>Produits</h1>
                    <TableContainer component={Paper}>
                        <Table className="table" aria-label="simple table">
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
                    <TableContainer component={Paper}>
                        <Table className="table" aria-label="simple table">
                            <TableBody>
                                {this.state.etats.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell align="center">{row.texte} le {row.date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Paper className="paper-button">
                        <div>
                            <Button className="form-button"><b>Marquer comme lue</b></Button>
                            <Button className="form-button"><b>Terminer la commande</b></Button>
                        </div>
                    </Paper>
                </div>
            </div>
        )
    }
}
