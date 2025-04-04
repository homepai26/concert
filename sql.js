const pool = require('./config/database.js');
var result = null;

const add_concert_info = async(concert_name, concert_artist, concert_venue, concert_timeshow) => {
    if (concert_name && concert_artist && concert_venue && concert_timeshow) {
	[result] = await pool.execute('INSERT INTO concert_info(concert_name, concert_artist, concert_venue, concert_timeshow) VALUES (?,?,?,?)',
				      [concert_name, concert_artist, concert_venue, concert_timeshow]);
    }
    return result;
};

const add_concert_seat = async(concert_id, seat_type_id, seat_start, seat_end, seat_available) => {
    if (concert_id && seat_type_id && seat_start && seat_end && seat_available) {
	[result] = await pool.execute('INSERT INTO concert_seat VALUES (?,?,?,?,?)',
				      [concert_id, seat_type_id, seat_start, seat_end, seat_available]);
    }
    return result;
};

const add_thai_customer = async(name, birthdate, email, id) => {
    if (name && birthdate && email && id) {
	[result] = await pool.execute('INSERT INTO customer(name, birthdate, email, id) VALUES (?,?,?,?)',
				      [name, birthdate, email, id]);
    }
    return result;
};

const add_foreign_customer = async(name, birthdate, email, passport) => {
    if (name && birthdate && email && id) {
	[result] = await pool.execute('INSERT INTO customer(name, birthdate, email, passport) VALUES (?,?,?,?)',
				      [name, birthdate, email, passport]);
    }
    return result;
};

const add_reserved_seat = async(concert_id, seat_no, customer_id) => {
    if (concert_id && seat_no && customer_id) {
	[result] = await pool.execute('INSERT INTO reserved_seat VALUES (?,?,?)',
				      [concert_id, seat_no, customer_id]);
    }
    return result;
};

const add_seat_type = async(type, price) => {
    if (type && price) {
	[result] = await pool.execute('INSERT INTO seat_type(type, price) VALUES (?,?)',
				      [type, price]);
    }
    return result;
};

const add_ticket = async(concert_name, name, venue, seat, timeshow, purchase_datetime) => {
    if (concert_name && name && venue && seat && timeshow && purchase_datetime) {
	[result] = await pool.execute('INSERT INTO ticket(concert_name, name, venue, seat, timeshow, purchase_datetime) VALUES (?,?,?,?,?,?)',
				      [concert_name, name, venue, seat, timeshow, purchase_datetime]);
    }
    return result;
};

const view_concert = async() => {
    [row, field] = await pool.execute('SELECT * FROM concert_info');
    return row;
};

module.exports.add_concert_info = add_concert_info;
module.exports.add_concert_seat = add_concert_seat;
module.exports.add_thai_customer = add_thai_customer;
module.exports.add_foreign_customer = add_foreign_customer;
module.exports.add_reserved_seat = add_reserved_seat;
module.exports.add_seat_type = add_seat_type;
module.exports.add_ticket = add_ticket;
module.exports.view_concert = view_concert;
