import React from 'react';
import '../css/Style.css';
import NavBar from './rfc/NavBar';
import TabCommandes from './rfc/TabCommandes';

class Commandes extends React.Component {

  render() {
    return (
      <div>
        <header>
          <NavBar />
        </header>
        <div className="content">
          <h1>Bienvenue !</h1>
          <TabCommandes />
        </div>
      </div>
    );
  }
}

export default Commandes;
