const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'concert',
    password: '1234',
    database: 'concert_booking',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise(); 