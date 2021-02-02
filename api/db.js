const Pool = require('pg').Pool;

// Instanciation de la bd
// TODO: Créer un user postgres
const pool = new Pool({
    user: "postgres",
    password: "forsidekick",
    host: "localhost",
    port: "5432",
    database: "sidekick"
});

module.exports = pool;