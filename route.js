const express = require('express');
const router = express.Router();
const pool = require('./config/database');
const sql = require('./sql');
const encrypt = require('./encrypt');
const login = require('./handle/login');

router.post('/api/concert', async(req, res) => {
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
	result = await sql.view_concert_info(conn);
	res.json(result);
    } catch (error) {
	res.send(error);
    }

    conn.release();
});

router.post('/api/register', async(req, res) => {
    try {
	var conn = await pool.getConnection();
	console.log(req.body);
	if (req.body.id) {
	    let hash_passwd = await encrypt.hash_password(req.body.password);
	    result = await sql.add_thai_customer(conn, req.body.name, req.body.birthdate, req.body.email,
						 req.body.id, hash_passwd);
	    console.log("add_thai_customer");
	} else if (req.body.passport) {
	    let hash_passwd = await encrypt.hash_password(req.body.password);
	    result = await sql.add_foreign_customer(conn, req.body.name, req.body.birthdate, req.body.email,
						    req.body.passport, hash_passwd);
	}
	res.json(result);
    } catch(error) {
	res.send(error);
    }

    conn.release();
});

router.put('/api/login', async(req, res) => {
    var token;
    try {
	var {email, password} = req.body;
	if (!email || !password) {
	    res.send('No email or password');
	}

	var conn = await pool.getConnection();
	let [[row], field] = await conn.execute('SELECT customer_id, password FROM customer WHERE email = ?', [email]);
	if (await encrypt.check_password(password, row.password)) {
	    token = login.gen_customer_token(row.customer_id);
	    res.json(token);
	}
    } catch (error) {
	res.send(error);
    }
});

router.post('/api/reserved_seat', async(req, res) => {
    try {
	var conn = await pool.getConnection();
	var customer_id = login.get_value(req.body.token);
	result = await sql.add_reserved_seat(conn, req.body.concert_id, req.body.seat_no, customer_id);
	res.json(result);
    } catch(error) {
	res.send(error);
    }

    conn.release();
});

router.get('/api/concert_seat/:id', async(req, res) => {
    try {
	var conn = await pool.getConnection();
	result = await sql.view_concert_seat(conn, req.params.id);
	res.json(result);
    } catch (error) {
	res.send(error);
    }
});

router.get('/api/reserved_seat/:id', async(req, res) => {
    try {
	var conn = await pool.getConnection();
	result = await sql.view_reserved_seat(conn, req.params.id);
	res.json(result);
    } catch (error) {
	res.send(error);
    }
});

module.exports = router;

