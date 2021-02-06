import '../../css/App.css';
// Routes avec react-router-dom
import { Route, Redirect, Switch } from 'react-router-dom';
// Pages jsx
import Commandes from '../Commandes';
import Commande from '../Commande';
import CreationCommande from '../CreationCommande';
import Notifications from '../Etats';
import NotFound from '../NotFound';

/**
 * @author Alex Lajeunesse
 * @function App
 * @description S'occupe des routes vers les différentes pages avec rect-router-dom
 */
function App() {
  return (
    <div className="App">
      <Switch>
        {/* Détails d'une commande */}
        <Route path="/commandes/:id" component={Commande} />
        {/* Liste des commandes */}
        <Route path="/commandes" component={Commandes} />
        {/* Création d'une commande */}
        <Route path="/create" component={CreationCommande} />
        {/* Modification d'une commande */}
        <Route path="/edit/:id" component={CreationCommande} />
        {/* Liste des notifications */}
        <Route path="/etats" component={Notifications} />
        {/* 404 Not Found */}
        <Route path="/404" component={NotFound} />
        <Redirect path="/" exact to={"/commandes"} />
        <Redirect to={"/404"} />
      </Switch>
    </div>
  );
}

export default App;
