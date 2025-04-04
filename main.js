const express = require('express');
const pool = require('config/database.js');

const app = express();

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
