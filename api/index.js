const { response } = require('express');
const express = require('express');
const app = express();
const pool = require('./db');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello world');
});

app.get('/api/commandes', (req, res) => {

});

app.listen(5000, () => console.log('Listening on port 5000.'));