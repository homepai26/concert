const bcrypt = require('bcrypt');
var saltRounds = 10;

const hash_password = async(password) => {
    salt = await bcrypt.genSalt(saltRounds);
    hp = await bcrypt.hash(password, salt);
    return hp;
};

const check_password = async(password, hash_password) => {
    result = await bcrypt.compare(password, hash_password);
    return result;
};

module.exports.hash_password = hash_password;
module.exports.check_password = check_password;
