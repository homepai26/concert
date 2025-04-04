const express = require('express');
const router = express.Router();
const pool = require('./config/database');
const sql = require('./sql');

router.post('/api/add_concert', async(req, res) => {
    var obj_arr = [];
    var count = 0;
    await pool.execute('START TRANSACTION');
    let result1 = await sql.add_concert_info(req.body.concert_name, req.body.concert_artist,
					 req.body.concert_venue, req.body.concert_timeshow);
    obj_arr[count] = result1; 
    count++;
    
    req.body.seats.forEach(async(value) => {
	let result2 = await sql.add_seat_type(value.type, value.price);
	let result3 = await sql.add_concert_seat(result1.insertId, result2.insertId, value.seat_start, value.seat_end, value.seat_available);
	obj_arr[count] = result2;
	obj_arr[count + 1] = result3;
	count += 2;
    });

    if (obj_arr) {
	pool.execute('COMMIT');
	console.log("commit");
	res.json(obj_arr);
    } else {
	pool.execute('ROLLBACK');
	console.log("rollback");
	res.json(obj_arr);
    }
});

router.get('/api/concert', async(req, res) => {
    result = await sql.view_concert();
    res.json(result);
});

module.exports = router;

