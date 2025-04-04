const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const pool = mysql.createPool({
    host: 'warit.pp.ua',
    user: 'concert_user',
    password: 'OPyyMk99f67Z',
    database: 'concert_booking',
    waitForConnections: true,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

const main = async() => {
    try {
	const [row, field] = await pool.execute('SELECT * FROM customer');
	app.get('/', (req, res) => {
	    res.send(row);
	});

	app.listen(3000);
    } catch (error) {
	if (error)
	    console.log(error);
    }
};

main();
