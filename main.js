const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'concert_user',
  database: 'concert_booking',
  waitForConnections: true,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

const main = async() => {
    try {
	const [row, field] = pool.execute('SELECT * FROM users');
	app.get('/', (req, res) => {
	    res.send(JSON.stringify(field));
	});

	app.listen(3000);
    } catch (error) {
	if (error)
	    console.log(error);
    }
};

main();
