import React from 'react'
import '../css/Style.css';
import NavBar from './rfc/NavBar';
// react-router-dom
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div>
            <header>
                <NavBar />
            </header>
            <div className="content">
                <h1 className="nf">404 Not Found</h1>
                <p className="nf-desc">La page Sidekick que vous avez demandé est incorrecte.</p>
                <Link to="/">Retourner à l'accueil</Link>
            </div>
        </div>
    )
}
