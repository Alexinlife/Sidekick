import React from 'react';
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
import AssignmentIcon from '@material-ui/icons/Assignment';
// react-router-dom
import { Link } from 'react-router-dom';

/**
 * @author Alex Lajeunesse
 * @class Commandes
 * @description Gère la page des commandes (affichage, requêtes à l'API et redirection)
 */
class Commandes extends React.Component {

  // Constructeur
  constructor(props) {
    super();
  }

  componentDidMount() {
    this.getCommandes();
  }

  state = {
    commandes: [],
  }

  /**
   * @author Alex Lajeunesse
   * @function getCommandes
   * @description Effectue une requête à l'api pour retrouver toutes les commandes
   */
  async getCommandes() {
    try {
      const orderResponse = await axios.get('http://localhost:5000/api/commandes/');
      console.log(orderResponse);
      // La réponse de l'API est enregistré dans le state
      this.setState({
        commandes: orderResponse.data,
      });
    } catch (error) {
      console.error(error);
    }
  }

  // TODO: Réussir à afficher ses résultats dans le tableau
  /**
   * @author Alex Lajeunesse
   * @function getLastEtats
   * @description Effectue une requête à l'api pour retrouver les derniers états
   */
  async getLastEtat(commande_id) {
    try {
      const stateResponse = await axios.get(`http://localhost:5000/api/etats/last/${commande_id}`);
      // Succès
      console.log(stateResponse);
      return stateResponse.data[0].texte;
      // Erreur
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
          <h1>Liste des commandes</h1>
          <TableContainer component={Paper}>
            <Table className="table" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">Numéro de commande</TableCell>
                  <TableCell align="center">Entreprise</TableCell>
                  <TableCell align="center">Nom</TableCell>
                  <TableCell align="center">PO du client</TableCell>
                  <TableCell align="center">Vendeur</TableCell>
                  <TableCell align="center">Date de modification</TableCell>
                  <TableCell align="center">Date de création</TableCell>
                  <TableCell align="center">Dernier état</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.commandes.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell align="center">
                      <Link to={`/commandes/${row.id}`}>
                        <IconButton edge="start" className="tab-icons" color="inherit" aria-label="menu">
                          <AssignmentIcon />
                        </IconButton>
                      </Link>
                    </TableCell>
                    <TableCell align="center">{row.id}</TableCell>
                    <TableCell align="center">{row.entreprise || "-"}</TableCell>
                    <TableCell align="center">{row.nom}</TableCell>
                    <TableCell align="center">{row.po || "-"}</TableCell>
                    <TableCell align="center">{row.vendeur}</TableCell>
                    <TableCell align="center">{row.date_modification || "-"}</TableCell>
                    <TableCell align="center">{row.date_creation}</TableCell>
                    <TableCell align="center">{row.date_creation}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    );
  }
}

export default Commandes;
