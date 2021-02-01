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
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
// react-router-dom
import { Link } from 'react-router-dom';

class Commandes extends React.Component {
  constructor(props) {
    super();
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.getCommandes();
  }

  state = {
    commandes: []
  }

  async getCommandes() {
    try {
      const response = await axios.get('http://localhost:5000/api/commandes/');
      console.log(response);
      // La réponse de l'API est enregistré dans le state
      this.setState({
        commandes: response.data
      });
    } catch (error) {
      console.error(error);
    }
  }

  handleEdit(event) {
    event.preventDefault();
    console.log("2");
  }

  handleDelete(event) {
    event.preventDefault();
    console.log("3");
  }

  render() {
    return (
      <div>
        <header>
          <NavBar />
        </header>
        <div className="content">
          <h1>Bienvenue !</h1>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.commandes.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Link to={`/commandes/${row.id}`}>
                        <IconButton edge="start" className="tab-icons" color="inherit" aria-label="menu">
                          <AssignmentIcon />
                        </IconButton>
                      </Link>
                      <IconButton edge="start" className="tab-icons" color="inherit" aria-label="menu" onClick={this.handleEdit}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="start" className="tab-icons" color="inherit" aria-label="menu" onClick={this.handleDelete}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">{row.id}</TableCell>
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
        </div>
      </div>
    );
  }
}

export default Commandes;
