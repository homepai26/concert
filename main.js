const express = require('express');
const cors = require('cors');
const router = require('./route');

const app = express();
app.use(cors());
app.use(router);

app.listen(3000, () => {
    console.log('Now app is listen on port 3000');
});
