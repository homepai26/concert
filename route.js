const express = require('express');
const router = express.Router();
const pool = require('./config/database');
const sql = require('./sql');
const encrypt = require('./encrypt');
const login = require('./handle/login');
const datetime = require('./handle/datetime');

var conn;

const get_conn = async() => {
    conn = await pool.getConnection();
};

get_conn();

router.post('/concert', async(req, res) => {
    try {
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
});

router.get('/concert', async(req, res) => {
    try {
	result = await sql.view_concert_info(conn);
	res.json(result);
    } catch (error) {
	res.send(error);
    }
});

router.post('/register', async(req, res) => {
    try {
	console.log(req.body);
	if (req.body.id.length) {
	    let hash_passwd = await encrypt.hash_password(req.body.password);
	    result = await sql.add_thai_customer(conn, req.body.name, req.body.birthdate, req.body.email,
						 req.body.id, hash_passwd);
	    console.log("add_thai_customer");
	} else if (req.body.passport.length) {
	    let hash_passwd = await encrypt.hash_password(req.body.password);
	    result = await sql.add_foreign_customer(conn, req.body.name, req.body.birthdate, req.body.email,
						    req.body.passport, hash_passwd);
	}
	res.json(result);
    } catch(error) {
	res.send(error);
    }
});

router.post('/login', async(req, res) => {
    try {
	var token;
	let {email, password} = req.body;
	if (!email || !password) {
	    res.send('No email or password');
	}

	let [[row], field] = await conn.execute('SELECT customer_id, name, password FROM customer WHERE email = ?', [email]);
	let is_valid_password = await encrypt.check_password(password, row.password);
	if (is_valid_password) {
	    token = login.gen_customer_token(row.customer_id, row.name);
	    res.cookie('token', token);
	    res.cookie('name', row.name);
	    res.json({"token": token, "name": row.name});
	} else {
	    res.send("Wrong password");
	}
    } catch (error) {
	res.send(error);
    }
});

router.post('/payment', async(req, res) => {
    try {
	let { customer_id } = login.get_value(req.cookies.token);
	console.log(`customer_id ${customer_id} sent payment request`);
	let result = await sql.add_payment(conn, customer_id, req.body.concert_id, req.body.seat_no, req.body.datetime);
	res.json(result);
    } catch(error) {
	res.send(error);
    }
});

router.post('/reserved_seat', async(req, res) => {
    try {
	let { customer_id } = login.get_value(req.cookies.token);
	console.log(`reserved seat customer ${customer_id}`);
	conn.execute('START TRANSACTION');
	let result1 = await sql.add_reserved_seat(conn, req.body.concert_id, req.body.seat_no, customer_id);
	console.log(`reserved seat with result ${result1}`);
	console.log(result1);
	let [[{seat_type_id}], field] = await conn.execute('SELECT seat_type_id FROM concert_seat ' +
							   'WHERE seat_start <= ? AND ? <= seat_end',
							   [req.body.seat_no, req.body.seat_no]);
	console.log(`getting seat_type_id: ${seat_type_id} with ${req.body.seat_no}`);
	let result2 = await conn.execute('UPDATE concert_seat SET seat_available = ' +
					 'seat_available - 1 WHERE seat_type_id = ? ' +
					 'AND seat_available > 0', [seat_type_id]);
	console.log(`decrese seat_available with using ${seat_type_id} with result ${result2}`);
	console.log(result2);
	let [[concert_info_row]] = await conn.execute('SELECT ci.concert_name, c.name, ci.concert_venue, rs.seat_no, ' +
						    'ci.concert_timeshow FROM reserved_seat rs JOIN concert_info ci ' +
						    'ON rs.concert_id = ci.concert_id JOIN customer c ON rs.customer_id ' +
						      '= c.customer_id WHERE rs.seat_no = ?', [req.body.seat_no]);
	console.log(`geting concert_info_row: ${concert_info_row} using ${seat_type_id}`);
	console.log(concert_info_row);
	let result3 = await sql.add_ticket(conn, concert_info_row.concert_name, concert_info_row.name,
					   concert_info_row.concert_venue, concert_info_row.seat_no,
					   datetime.get_gnu_datetime(concert_info_row.concert_timeshow),
					   datetime.get_gnu_local_datetime());
	console.log(`adding ticket using ${concert_info_row} and convert ${datetime.get_gnu_datetime(concert_info_row.concert_timeshow)}, ${datetime.get_gnu_local_datetime()}`);
	await conn.execute('COMMIT');
	res.json({result1, result2, result3});
    } catch(error) {
	await conn.execute('ROLLBACK');
	res.send(error);
    }
});

router.get('/concert_seat/:id', async(req, res) => {
    try {
	result = await sql.view_concert_seat(conn, req.params.id);
	res.json(result);
    } catch (error) {
	res.send(error);
    }
});

router.get('/reserved_seat/:id', async(req, res) => {
    try {
	result = await sql.view_reserved_seat(conn, req.params.id);
	res.json(result);
    } catch (error) {
	res.send(error);
    }
});

router.get('/ticket', async(req, res) => {
    try {
	let {_, name} = login.get_value(req.cookies.token);
	[row, field] = await conn.execute('SELECT * FROM ticket WHERE name = ?', [name]);;
	res.json(row);
    } catch (error) {
	res.send(error);
    }
});

module.exports = router;

