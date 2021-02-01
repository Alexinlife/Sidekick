import React from 'react'
import '../css/Style.css';
import NavBar from './rfc/NavBar';

export default function NotFound() {
    return (
        <div>
            <header>
                <NavBar />
            </header>
            <body>
                <h1 className="nf">404 Not Found</h1>
                <p className="nf-desc">La page Sidekick que vous avez demandé est incorrecte.</p>
            </body>
        </div>
    )
}
