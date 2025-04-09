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

const multer = require('multer');

const slip_storage = multer.diskStorage({
    destination: function (req, file, callback) {
	callback(null, './upload/'); // folder ที่เราต้องการเก็บไฟล์
    },
    filename: function (req, file, callback) {
	callback(null, file.originalname); //ให้ใช้ชื่อไฟล์ original เป็นชื่อหลังอัพโหลด
    },
});

const concert_storage = multer.diskStorage({
    destination: function (req, file, callback) {
	callback(null, './views/pic/'); // folder ที่เราต้องการเก็บไฟล์
    },
    filename: function (req, file, callback) {
	callback(null, `concert_${req.params.id}.png`); //ให้ใช้ชื่อไฟล์ original เป็นชื่อหลังอัพโหลด
    },
});

const concert_upload = multer({
    storage: concert_storage,
    fileFilter: (req, file, cb) => {
	if (req.body.secret_key !== "very secret") {
            return cb(new Error('wrong secret key'));
	} else if (file.mimetype != "image/png") {
	    return cb(new Error('wrong file type'));
	}
	cb(null, true);
    }
});


const slip_upload = multer({storage: slip_storage});

const concert_upload_pic = concert_upload.single('concert_pic');
router.post('/concert_pic/:id', async(req, res) => {
    concert_upload_pic(req, res, (error) => {
	if (error) {
	    if (error.message == 'wrong secret key') {
		return res.status(403).send({"status": "error", "message": error.message});
	    } else if (error.message == 'wrong file type') {
		return res.status(400).send({"status": "error", "message": error.message});
	    }
	}
	
	res.status(200).send({
	    "status": "ok",
	    "data": req.file
	});
    });
});

router.post('/concert', async(req, res) => {
    try {
	if (req.body.secret != 'very secret') {
	    return res.status(403).send({"status": "error", "message": "wrong secret key"});
	} else if (!req.body.concert_name) {
	    return res.status(400).send({"status": "error", "message": "missing concert name"});
	} else if (!req.body.concert_artist) {
	    return res.status(400).send({"status": "error", "message": "missing concert artist"});
	} else if (!req.body.concert_venue) {
	    return res.status(400).send({"status": "error", "message": "missing concert venue"});
	} else if (!req.body.concert_timeshow) {
	    return res.status(400).send({"status": "error", "message": "missing concert timeshow"});
	} else if (!req.body.seats) {
	    return res.status(400).send({"status": "error", "message": "missing seats"});
	}
	
	console.log(req.body.seats);
	await conn.execute('START TRANSACTION');
	let result1 = await sql.add_concert_info(conn, req.body.concert_name, req.body.concert_artist,
						 req.body.concert_venue, req.body.concert_timeshow);
	console.log(result1);
	await req.body.seats.forEach(async(value) => {
	    let result2 = await sql.add_seat_type(conn, value.type, value.price);
	    console.log(`result1.insertId: ${result1.insertId} result2.insertId: ${result2.insertId}`);
	    console.log(`seat_start: ${value.seat_start} seat_end: ${value.seat_end} seat_available: ${value.seat_available}`);
	    let result3 = await sql.add_concert_seat(conn, result1.insertId, result2.insertId, value.seat_start, value.seat_end, value.seat_available);
	    console.log(result2);
	    console.log(result3);
	});

	await conn.execute('COMMIT');
	res.status(200).send({"status": "ok", "message": "add concert successfully", "data": {"concert_id": result1.insertId}});
    } catch (error) {
	await conn.execute('ROLLBACK');
	res.status(500).send({"status": "error", "message": error.message});
    }
});

router.get('/concert', async(req, res) => {
    try {
	result = await sql.view_concert_info(conn);
	res.json(result);
    } catch (error) {
	res.status(500).send({"status": "error", "message": error.message});
    }
});

router.post('/register', async(req, res) => {
    try {
	let result;
	console.log(req.body);

	if (!req.body.name) {
	    return res.status(400).send({"status": "error", "message": "no name provide"});
	} else if (!req.body.birthdate) {
	    return res.status(400).send({"status": "error", "message": "no birthdate provide"});
	} else if (!req.body.email) {
	    return res.status(400).send({"status": "error", "message": "no email provide"});
	} else if (!req.body.password) {
	    return res.status(400).send({"status": "error", "message": "no password provide"});
	} else if (!req.body.id && !req.body.passport) {
	    return res.status(400).send({"status": "error", "message": "no id or passport provide"});
	}
	
	if (req.body.id) {
	    let hash_passwd = await encrypt.hash_password(req.body.password);
	    result = await sql.add_thai_customer(conn, req.body.name, req.body.birthdate, req.body.email,
						 req.body.id, hash_passwd);
	    console.log("add_thai_customer");
	} else if (req.body.passport) {
	    let hash_passwd = await encrypt.hash_password(req.body.password);
	    result = await sql.add_foreign_customer(conn, req.body.name, req.body.birthdate, req.body.email,
						    req.body.passport, hash_passwd);
	    console.log("add_foreign_customer");
	}
	res.status(200).send({"status": "ok", "message": "register successfully", data: {customer_id: result.insertId}});
    } catch(error) {
	res.status(500).send({"status": "error", "message": error.message});
    }
});

router.post('/login', async(req, res) => {
    try {
	var token;
	let {email, password} = req.body;
	
	if (!email) {
	    return res.status(400).send({"status": "error", "message": "no email provide"});
	} else if (!password) {
	    return res.status(400).send({"status": "error", "message": "no password provide"});
	}
	let [[row], field] = await conn.execute('SELECT customer_id, name, password FROM customer WHERE email = ?', [email]);
	let is_valid_password = await encrypt.check_password(password, row.password);

	if (!is_valid_password) {
	    return res.status(403).send({"status": "error", "message": "password incorrent"});
	}
	
	token = login.gen_customer_token(row.customer_id, row.name);
	res.cookie('token', token);
	res.cookie('name', row.name);
	res.json({"token": token, "name": row.name});

    } catch (error) {
	return res.status(500).send({"status": "error", "message": error.message});
    }
});

router.post('/payment', async(req, res) => {
    try {
	if (!req.cookies.token) {
	    return res.status(403).send({"status": "error", "message": "no token to do any futher, have you login?"});
	} else if (!req.body.concert_id) {
	    return res.status(400).send({"status": "error", "message": "no concert id provide"});
	} else if (!req.body.seat_no) {
	    return res.status(400).send({"status": "error", "message": "no seat number provide"});
	} else if (!req.body.datetime) {
	    return res.status(400).send({"status": "error", "message": "no datetime provide"});
	}
	
	let { customer_id } = login.get_value(req.cookies.token);
	console.log(`customer_id ${customer_id} sent payment request`);
	let result = await sql.add_payment(conn, customer_id, req.body.concert_id, req.body.seat_no, req.body.datetime);
	res.status(200).send({"status": "ok", "message": "payment added successfully"});
    } catch(error) {
	res.status(500).send({"status": "error", "message": error.message});
    }
});

router.post('/reserved_seat', async(req, res) => {
    try {
	if (!req.cookies.token) {
	    return res.status(403).send({"status": "error", "message": "no token to do any futher, have you login?"});
	} else if (!req.body.concert_id) {
	    return res.status(400).send({"status": "error", "message": "no concert id provide"});
	} else if (!req.body.seat_no) {
	    return res.status(400).send({"status": "error", "message": "no seat number provide"});
	} 
	
	let { customer_id } = login.get_value(req.cookies.token);
	console.log(`reserved seat customer ${customer_id} and incoming data:`);
	console.log(req.body);
	
	conn.execute('START TRANSACTION');
	let result1 = await sql.add_reserved_seat(conn, req.body.concert_id, req.body.seat_no, customer_id);
	console.log(`reserved seat with result1:`);
	console.log(result1);
	let [[{seat_type_id}], field] = await conn.execute('SELECT seat_type_id FROM concert_seat ' +
							   'WHERE seat_start <= ? AND ? <= seat_end AND concert_id = ?',
							   [req.body.seat_no, req.body.seat_no, req.body.concert_id]);
	console.log(`getting seat_type_id: ${seat_type_id} with seat number ${req.body.seat_no}`);
	let result2 = await conn.execute('UPDATE concert_seat SET seat_available = ' +
					 'seat_available - 1 WHERE seat_type_id = ? ' +
					 'AND seat_available > 0', [seat_type_id]);
	console.log(`decrese seat_available with using ${seat_type_id} with result2:`);
	console.log(result2);
	let [[concert_info_row]] = await conn.execute('SELECT ci.concert_name, c.name, ci.concert_venue, rs.seat_no, ' +
						      'ci.concert_timeshow FROM reserved_seat rs JOIN concert_info ci ' +
						      'ON rs.concert_id = ci.concert_id JOIN customer c ON rs.customer_id ' +
						      '= c.customer_id JOIN concert_seat cs ON cs.concert_id = ci.concert_id ' +
						      'WHERE cs.seat_type_id = ? AND c.customer_id = ? AND rs.seat_no = ?'
						      , [seat_type_id, customer_id, req.body.seat_no]);
	console.log(`geting concert_info_row: using ${seat_type_id}`);
	console.log(concert_info_row);
	let result3 = await sql.add_ticket(conn, concert_info_row.concert_name, concert_info_row.name,
					   concert_info_row.concert_venue, concert_info_row.seat_no,
					   datetime.get_gnu_datetime(concert_info_row.concert_timeshow),
					   datetime.get_gnu_local_datetime());
	console.log(`adding ticket using ${concert_info_row} and convert ${datetime.get_gnu_datetime(concert_info_row.concert_timeshow)}, ${datetime.get_gnu_local_datetime()}`);
	await conn.execute('COMMIT');
	return res.status(200).send({"status": "ok", "message": "add reserved seat successfully", "data": {"ticket_id": result3.insertId}});
    } catch(error) {
	await conn.execute('ROLLBACK');
	return res.status(500).send({"status": "error", "message": error.message});
    }
});

router.get('/concert_seat/:id', async(req, res) => {
    try {
	result = await sql.view_concert_seat(conn, req.params.id);
	res.json(result);
    } catch (error) {
	return res.status(500).send({"status": "error", "message": error.message});
    }
});

router.get('/reserved_seat/:id', async(req, res) => {
    try {
	result = await sql.view_reserved_seat(conn, req.params.id);
	res.json(result);
    } catch (error) {
	return res.status(500).send({"status": "error", "message": error.message});
    }
});

router.get('/ticket', async(req, res) => {
    try {
	let {_, name} = login.get_value(req.cookies.token);
	[row, field] = await conn.execute('SELECT * FROM ticket WHERE name = ?', [name]);;
	res.json(row);
    } catch (error) {
	return res.status(500).send({"status": "error", "message": error.message});
    }
});

module.exports = router;

