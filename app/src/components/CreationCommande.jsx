import React from 'react'
import '../css/Style.css';
import NavBar from './NavBar';

export default class CreationCommande extends React.Component {
    // TODO: Formik pour les formulaires : https://www.npmjs.com/package/formik
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
