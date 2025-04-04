const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./route');
const sql = require('./sql');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(router);

sql.add_concert_info('Prayuth New Single', 'Prayuth Chan O\'Cha', 'Moon shadowing the world', '2025-01-01 15:00:00');

app.listen(3000, () => {
    console.log('Now app is listen on port 3000');
});
