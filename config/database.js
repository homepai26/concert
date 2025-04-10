const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'warit.pp.ua',
    user: 'concert_user',
    //password will change before public, so don't worry
    password: 'OPyyMk99f67Z',
    database: 'concert_booking',
    waitForConnections: true,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

module.exports = pool;
