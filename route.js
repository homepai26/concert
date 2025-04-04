const express = require('express');
const router = express.Router();
const pool = require('./config/database');
const sql = require('./sql');

router.post('/api/add_concert', async(req, res) => {
    try {
	await pool.execute('START TRANSACTION');
	result1 = await sql.add_concert_info(req.body.concert_name, req.body.concert_artist,
					     req.body.concert_venue, req.body.concert_timeshow);
	
	await req.body.seats.forEach(async(value) => {
	    result2 = await sql.add_seat_type(value.type, value.price);
	    result3 = await sql.add_concert_seat(result1.insertId, result2.insertId, value.seat_start, value.seat_end, value.seat_available);
	});
	await pool.execute('COMMIT');
	res.send("added successfully~");
    } catch (error) {
	await pool.execute('ROLLBACK');
	res.send(error);
    }
});

router.get('/api/concert', async(req, res) => {
    try {
	result = await sql.view_concert();
	res.json(result);
    } catch (error) {
	console.log(error);
    }
});

module.exports = router;

