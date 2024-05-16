const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'joyas',
    password: 'admin123',
    allowExitOnIdle: true
});

module.exports = {pool}