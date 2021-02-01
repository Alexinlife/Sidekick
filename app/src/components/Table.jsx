import React, { useState } from 'react';
import '../css/Style.css';
import axios from 'axios';
// Composants Material-UI
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    background: "#A8A9AC"
  },
});

async function getCommandes() {try {
    const response = await axios.get('http://localhost:5000/api/commandes/');
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export default function Commandes() {
  const [commandes, setCommandes] = useState([]);
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Numéro de commande</TableCell>
            <TableCell align="center">Entreprise</TableCell>
            <TableCell align="center">Nom</TableCell>
            <TableCell align="center">PO du client</TableCell>
            <TableCell align="center">Vendeur</TableCell>
            <TableCell align="center">Date de modification</TableCell>
            <TableCell align="center">Date de création</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {commandes.map((row) => (
            <TableRow key={row.id}>
              <TableCell align="center">{row.id}</TableCell>
              <TableCell align="center">{row.entreprise}</TableCell>
              <TableCell align="center">{row.nom}</TableCell>
              <TableCell align="center">{row.po}</TableCell>
              <TableCell align="center">{row.vendeur}</TableCell>
              <TableCell align="center">{row.modification}</TableCell>
              <TableCell align="center">{row.creation}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// TODO: Essayer dans une rcc