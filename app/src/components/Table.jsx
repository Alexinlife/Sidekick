import React from 'react';
import '../css/Style.css';
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

function createData(id, entreprise, nom, po, vendeur, modification, creation) {
  return { id, entreprise, nom, po, vendeur, modification, creation };
}

const rows = [
  createData(1, "Cascades", "Moi", "5432", "AL", 'Jamais', 'Ajourd\'hui'),
  createData(2, "Pièces d'auto Victo", "Moi", "4000RPM", "AL", 'Jamais', 'Ajourd\'hui'),
  createData(3, "Jimssy", "Moi", "toto", "AL", 'Jamais', 'Ajourd\'hui'),
];

export default function BasicTable() {
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
          {rows.map((row) => (
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