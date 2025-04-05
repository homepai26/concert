const bcrypt = require('bcrypt');
const saltRounds = 10;

const hash_password = function(password) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
	if (err) throw err;
	bcrypt.hash(password, salt, function(err, hash_password) {
            if (err) throw err;
	    return hash_password;
	});
    });
};

const check_password = function(password, hash_password) {
    bcrypt.compare(password, hash_password, function(err, result) {
	if (err) throw err;
	return result;
    });
};

module.exports.hash_password = hash_password;
module.exports.check_password = check_password;
