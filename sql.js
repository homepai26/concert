const pool = require('./config/database.js');

const add_concert_info = async(concert_name, concert_artist, concert_venue, concert_timeshow) => {
    if (concert_name && concert_artist && concert_venue && concert_timeshow) {
	try {
	    [result] = await pool.execute('INSERT INTO concert_info(concert_name, concert_artist, concert_venue, concert_timeshow) VALUES (?,?,?,?)',
					  [concert_name, concert_artist, concert_venue, concert_timeshow]);
	} catch (error) {
	    console.log(error);
	}
    }
};

const add_concert_seat = async(concert_id, seat_type_id, seat_start, seat_end, seat_available) => {
    if (concert_id && seat_type_id && seat_start && seat_end && seat_available) {
	try {
	    [result] = await pool.execute('INSERT INTO concert_seat VALUES (?,?,?,?,?)',
					  [concert_id, seat_type_id, seat_start, seat_end, seat_available]);
	} catch (error) {
	    console.log(error);
	}
    }
};

const add_thai_customer = async(name, birthdate, email, id) => {
    if (name && birthdate && email && id) {
	try {
	    [result] = await pool.execute('INSERT INTO customer(name, birthdate, email, id) VALUES (?,?,?,?)',
					  [name, birthdate, email, id]);
	} catch (error) {
	    console.log(error);
	}
    }
};

const add_foreign_customer = async(name, birthdate, email, passport) => {
    if (name && birthdate && email && id) {
	try {
	    [result] = await pool.execute('INSERT INTO customer(name, birthdate, email, passport) VALUES (?,?,?,?)',
					  [name, birthdate, email, passport]);
	} catch (error) {
	    console.log(error);
	}
    }
};

const add_reserved_seat = async(concert_id, seat_no, customer_id) => {
    if (concert_id && seat_no && customer_id) {
	try {
	    [result] = await pool.execute('INSERT INTO reserved_seat VALUES (?,?,?)',
					  [concert_id, seat_no, customer_id]);
	} catch (error) {
	    console.log(error);
	}
    }
};

const add_seat_type = async(type, price) => {
    if (type && price) {
	try {
	    [result] = await pool.execute('INSERT INTO seat_type(type, price) VALUES (?,?)',
					  [type, price]);
	} catch (error) {
	    console.log(error);
	}
    }
};

const add_ticket = async(concert_name, name, venue, seat, timeshow, purchase_datetime) => {
    if (concert_name && name && venue && seat && timeshow && purchase_datetime) {
	try {
	    [result] = await pool.execute('INSERT INTO ticket(concert_name, name, venue, seat, timeshow, purchase_datetime) VALUES (?,?,?,?,?,?)',
					  [concert_name, name, venue, seat, timeshow, purchase_datetime]);
	} catch (error) {
	    console.log(error);
	}
    }
};

module.exports.add_concert_info = add_concert_info;
module.exports.add_concert_seat = add_concert_seat;
module.exports.add_thai_customer = add_thai_customer;
module.exports.add_foreign_customer = add_foreign_customer;
module.exports.add_reserved_seat = add_reserved_seat;
module.exports.add_seat_type = add_seat_type;
module.exports.add_ticket = add_ticket;
