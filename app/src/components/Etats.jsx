import React from 'react'
import '../css/Style.css';
import axios from 'axios';
import NavBar from './rfc/NavBar';
// Composants Material-UI
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export default class Etats extends React.Component {
    constructor(props) {
        super();
    }

    componentDidMount() {
        this.getEtats();
    }

    state = {
        commandes: []
    }

    async getEtats() {
        try {
            const response = await axios.get('http://localhost:5000/api/etats/');
            console.log(response);
            // La réponse de l'API est enregistré dans le state
            this.setState({
                commandes: response.data
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
                    <h1>Liste des états</h1>
                    <TableContainer className="etats" component={Paper}>
                        <Table className="table" aria-label="simple table">
                            <TableBody>
                                {this.state.commandes.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell align="center">Commande no. {row.commande_id} : {row.texte} ({row.date})</TableCell>
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
