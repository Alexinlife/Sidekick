import React from 'react';
import '../css/Style.css';
import logo from '../logoSidekick.png';
// Composants Material-UI
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
// Icônes
import ListIcon from '@material-ui/icons/FormatListBulleted';
import AddIcon from '@material-ui/icons/Add';
import BellIcon from '@material-ui/icons/Notifications';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  nav: {
    background: "#686868",
  },
  listButton: {
    marginRight: theme.spacing(2),
  },
  addButton: {
    marginRight: theme.spacing(2),
  },
  bellButton: {
    marginLeft: theme.spacing(2),
  },
  logo: {
    flexGrow: 1,
    paddingRight: theme.spacing(4),
  },
}));

export default function NavBar() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar className={classes.nav} position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.listButton} color="inherit" aria-label="menu">
            <ListIcon />
          </IconButton>
          <IconButton edge="start" className={classes.addButton} color="inherit" aria-label="menu">
            <AddIcon />
          </IconButton>
          <img className={classes.logo} src={logo} alt="React" />
          <IconButton edge="end" className={classes.bellButton} color="inherit" aria-label="notifications">
            <BellIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}