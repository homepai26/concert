var jwt = require('jsonwebtoken');
const secert_key = 't6+JsrlMOWqsgmKQs80yPApoKkIXlqjk4M+Pl6z5A+c=';

const gen_customer_token = (customer_id, name) => {
    var token = jwt.sign({ "customer_id": customer_id, "name": name }, secert_key, { expiresIn: '7d' });
    return token;
};

const get_value = (token) => {
    var value;
    jwt.verify(token, secert_key, function(err, decoded) {
	if (err) throw err;
	value =  decoded;
    });
    return value;
};

module.exports.gen_customer_token = gen_customer_token;
module.exports.get_value = get_value;
