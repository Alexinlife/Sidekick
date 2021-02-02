import '../../css/App.css';
// Routes avec react-router-dom
import { Route, Redirect, Switch } from 'react-router-dom';
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
        <Route path="/commandes/:id" component={Commande} />
        <Route path="/commandes" component={Commandes} />
        <Route path="/creation" component={CreationCommande} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/404" component={NotFound} />
        <Redirect path="/" exact to={"/commandes"} />
        <Redirect to={"/404"} />
      </Switch>
    </div>
  );
}

export default App;
