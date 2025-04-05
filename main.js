const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./route');
var cookieParser = require('cookie-parser');
// const sql = require('./sql');
// const encrypt = require('./encrypt');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', router);

app.listen(3000, () => {
    console.log('Now app is listen on port 3000');
});
