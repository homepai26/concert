const pool = require('./config/database.js');
var result = null;

const add_concert_info = async(conn, concert_name, concert_artist, concert_venue, concert_timeshow) => {
    if (concert_name && concert_artist && concert_venue && concert_timeshow) {
	[result] = await conn.execute('INSERT INTO concert_info(concert_name, concert_artist, concert_venue, concert_timeshow) VALUES (?,?,?,?)',
				      [concert_name, concert_artist, concert_venue, concert_timeshow]);
    }
    return result;
};

const add_concert_seat = async(conn, concert_id, seat_type_id, seat_start, seat_end, seat_available) => {
    if (concert_id && seat_type_id && seat_start && seat_end && seat_available) {
	[result] = await conn.execute('INSERT INTO concert_seat VALUES (?,?,?,?,?)',
				      [concert_id, seat_type_id, seat_start, seat_end, seat_available]);
    }
    return result;
};

const add_thai_customer = async(conn, name, birthdate, email, id, password) => {
    if (name && birthdate && email && id && password) {
	[result] = await conn.execute('INSERT INTO customer(name, birthdate, email, id, password) VALUES (?,?,?,?,?)',
				      [name, birthdate, email, id, password]);
    }
    return result;
};

const add_foreign_customer = async(conn, name, birthdate, email, passport, password) => {
    if (name && birthdate && email && passport && password) {
	[result] = await conn.execute('INSERT INTO customer(name, birthdate, email, passport, password) VALUES (?,?,?,?,?)',
				      [name, birthdate, email, passport, password]);
    }
    return result;
};

const add_reserved_seat = async(conn, concert_id, seat_no, customer_id) => {
    if (concert_id && seat_no && customer_id) {
	[result] = await conn.execute('INSERT INTO reserved_seat VALUES (?,?,?)',
				      [concert_id, seat_no, customer_id]);
    }
    return result;
};

const add_seat_type = async(conn, type, price) => {
    if (type && price) {
	[result] = await conn.execute('INSERT INTO seat_type(type, price) VALUES (?,?)',
				      [type, price]);
    }
    return result;
};

const add_ticket = async(conn, concert_name, name, venue, seat, timeshow, purchase_datetime) => {
    if (concert_name && name && venue && seat && timeshow && purchase_datetime) {
	[result] = await conn.execute('INSERT INTO ticket(concert_name, name, venue, seat, timeshow, purchase_datetime) VALUES (?,?,?,?,?,?)',
				      [concert_name, name, venue, seat, timeshow, purchase_datetime]);
    }
    return result;
};

const view_concert_info = async(conn) => {
    [row, field] = await conn.execute('SELECT * FROM concert_info');
    return row;
};

const view_concert_seat = async(conn, id) => {
    [row, field] = await conn.execute('SELECT cs.concert_id, cs.seat_type_id, st.type, cs.seat_start, cs.seat_end,' +
				      'cs.seat_available, st.price FROM concert_seat cs LEFT JOIN seat_type st ' +
				      'ON cs.seat_type_id = st.seat_type_id WHERE cs.concert_id = ?', [id]);
    return row;
};

const view_reserved_seat = async(conn, id) => {
    [row, field] = await conn.execute('SELECT rs.concert_id, rs.seat_no, rs.customer_id, c.name FROM ' +
				      'reserved_seat rs JOIN customer c ON rs.customer_id = c.customer_id ' +
				      'WHERE rs.concert_id = ?', [id]);
    return row;
};

module.exports.add_concert_info = add_concert_info;
module.exports.add_concert_seat = add_concert_seat;
module.exports.add_thai_customer = add_thai_customer;
module.exports.add_foreign_customer = add_foreign_customer;
module.exports.add_reserved_seat = add_reserved_seat;
module.exports.add_seat_type = add_seat_type;
module.exports.add_ticket = add_ticket;
module.exports.view_concert_info = view_concert_info;
module.exports.view_concert_seat = view_concert_seat;
module.exports.view_reserved_seat = view_reserved_seat;
