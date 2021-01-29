import React from 'react';
import '../css/Style.css';
import NavBar from './NavBar';

class Commandes extends React.Component {

  render() {
    return (
      <div>
        <header>
          <NavBar />
        </header>
        <div className="content">
          <h1>Hey</h1>
        </div>
      </div>
    );
  }
}

export default Commandes;
