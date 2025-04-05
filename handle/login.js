var jwt = require('jsonwebtoken');

const gen_customer_token = (customer_id) => {
    var token = jwt.sign({ customer_if: customer_id }, 't6+JsrlMOWqsgmKQs80yPApoKkIXlqjk4M+Pl6z5A+c=', { expiresIn: '7d' });
    return token;
};

const get_value = (token) => {
    jwt.verify(token, 'wrong-secret', function(err, decoded) {
	if (err) throw err;
	return decoded;
    });
};

module.exports.gen_customer_token = gen_customer_token;
module.exports.get_value = get_value;
