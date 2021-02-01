import React from 'react'
import '../css/Style.css';
import NavBar from './rfc/NavBar';


export default class Commande extends React.Component {
    render() {
        return (
            <div>
                <header>
                    <NavBar />
                </header>
            </div>
        )
    }
}
