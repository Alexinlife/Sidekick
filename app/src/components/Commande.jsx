import React from 'react'
import '../css/Style.css';
import NavBar from './rfc/NavBar';


export default class Commande extends React.Component {

    constructor(props) {
        super();
        this.id = props.match.params.id;
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
