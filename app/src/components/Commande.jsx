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
// Material-UI Icons
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
// react-router-dom
import { Link } from 'react-router-dom';


export default class Commande extends React.Component {

    constructor(props) {
        super();
        this.id = props.match.params.id;
    }

    componentDidMount() {
        this.getCommande();
        this.getProduits();
    }

    state = {
        commande: [],
        produits: []
    }

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

    async getProduits() {
        try {
            const response = await axios.get(`http://localhost:5000/api/produits/${this.id}`);
            console.log(response);
            // La réponse de l'API est enregistré dans le state
            this.setState({
                commande: response.data
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
                                        <TableCell>
                                            <IconButton edge="start" className="tab-icons" color="inherit" aria-label="menu" onClick={this.handleOrderEdit}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton edge="start" className="tab-icons" color="inherit" aria-label="menu" onClick={this.handleOrderDelete}>
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
                        <Paper>
                            <h3 className="comments-title">Commentaires</h3>
                            <div className="comments-text">{row.description || "test is always great to be and whatever to do"}</div>
                        </Paper>
                    ))}
                    <h1>Produits</h1>
                    <TableContainer component={Paper}>
                        <Table className="table" aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center"></TableCell>
                                    <TableCell align="center">Quantité demandée</TableCell>
                                    <TableCell align="center">Quantité recueillie</TableCell>
                                    <TableCell align="center">Code</TableCell>
                                    <TableCell align="center">Description</TableCell>
                                    <TableCell align="center">Prix</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.commande.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>
                                            <IconButton edge="start" className="tab-icons" color="inherit" aria-label="menu" onClick={this.handleProductEdit}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton edge="start" className="tab-icons" color="inherit" aria-label="menu" onClick={this.handleProductDelete}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align="center">{row.quantite_demandee || "-"}</TableCell>
                                        <TableCell align="center">{row.quantite_recueillie || 0}</TableCell>
                                        <TableCell align="center">{row.code || "-"}</TableCell>
                                        <TableCell align="center">{row.description || "-"}</TableCell>
                                        <TableCell align="center">{row.prix || "-"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        )
    }
}
