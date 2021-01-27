const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "forsidekick",
    host: "localhost",
    port: "5432",
    database: "sidekick"
});

module.exports = pool;