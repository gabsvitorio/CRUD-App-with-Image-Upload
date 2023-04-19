require('dotenv').config();
const express = require('express');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 4000;

app.get('/', (req, res) =>{
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});