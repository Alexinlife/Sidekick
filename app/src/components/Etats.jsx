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

/**
 * @author Alex Lajeunesse
 * @class Etats
 * @description Page affichant la liste de tous les états
 */
export default class Etats extends React.Component {

    // Constructeur
    constructor(props) {
        super();
    }

    componentDidMount() {
        this.getEtats();
    }

    state = {
        etats: []
    }

    /**
     * @author Alex Lajeunesse
     * @function getEtats
     * @description Effectue une requête à l'api pour retrouver tous les états
     */
    async getEtats() {
        try {
            const response = await axios.get('http://localhost:5000/api/etats/');
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
                    <h1>États</h1>
                    <p className="etats-note"><b>Attention : </b>Cette page n'affiche pas si une commande a été supprimée. Assurez-vous aussi de vérifier vos courriels !</p>
                    <TableContainer className="etats" component={Paper}>
                        <Table className="table" aria-label="simple table">
                            <TableBody>
                                {this.state.etats.map((row) => (
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
