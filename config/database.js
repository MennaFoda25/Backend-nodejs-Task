// config/db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres', // default user
  host: 'localhost',
  database: 'Backend-ttask', // name you created in pgAdmin
  password: 'yalla259..',  // the one you used during install
  port: 5432                       // default PostgreSQL port
});

module.exports = pool;
