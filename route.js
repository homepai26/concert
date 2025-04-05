const express = require('express');
const router = express.Router();
const pool = require('./config/database');
const sql = require('./sql');

router.post('/api/add_concert', async(req, res) => {
    try {
	var conn = await pool.getConnection();
	await conn.execute('START TRANSACTION');
	result1 = await sql.add_concert_info(conn, req.body.concert_name, req.body.concert_artist,
					     req.body.concert_venue, req.body.concert_timeshow);
	
	await req.body.seats.forEach(async(value) => {
	    result2 = await sql.add_seat_type(conn, value.type, value.price);
	    result3 = await sql.add_concert_seat(conn, result1.insertId, result2.insertId, value.seat_start, value.seat_end, value.seat_available);
	});
	
	await conn.execute('COMMIT');
	res.send("added successfully~");
	
    } catch (error) {
	await conn.execute('ROLLBACK');
	res.send(error);
    }

    conn.release();
});

router.get('/api/concert', async(req, res) => {
    try {
	var conn = await pool.getConnection();
	result = await sql.view_concert(conn);
	res.json(result);
    } catch (error) {
	res.send(error);
    }

    conn.release();
});

module.exports = router;

