import React from 'react';
import '../css/Style.css';
import NavBar from './NavBar';
import Tableau from './Tableau';

class Commandes extends React.Component {

  render() {
    return (
      <div>
        <header>
          <NavBar />
        </header>
        <div className="content">
          <h1>Bienvenue !</h1>
          <Tableau />
        </div>
      </div>
    );
  }
}

export default Commandes;
