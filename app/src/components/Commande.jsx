import React from 'react'
import '../css/Style.css';
import axios from 'axios';
import NavBar from './rfc/NavBar';


export default class Commande extends React.Component {

    constructor(props) {
        super();
        this.id = props.match.params.id;
    }

    async getCommande() {
        try {
            const response = await axios.get(`http://localhost:5000/api/commandes/${this.id}`);
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
                    <h1>Détails de la commande no. {this.id}</h1>
                </div>
            </div>
        )
    }
}
