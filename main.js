const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./route');
const sql = require('./sql');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use('/', router);

app.listen(3000, () => {
    console.log('Now app is listen on port 3000');
});
