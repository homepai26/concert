const express = require('express');
const router = express.Router();
const pool = require('./config/database.js');

const main = async() => {
    try {
	const [row, field] = await pool.execute('SELECT * FROM customer');
	router.get('/', (req, res) => {
	    res.send(row);
	});
    } catch (error) {
	if (error)
	    console.log(error);
    }
};

module.exports = router;

