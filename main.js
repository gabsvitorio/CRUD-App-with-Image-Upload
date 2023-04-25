require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 4000;

mongoose.set("strictQuery", false);

mongoose.connect(process.env.DB_URI)
      .then(() => {
        console.log("Conectado ao banco dados!");
      })
      .catch((err) => {
        console.log(`Erro ao conectar: ${err}`);
      });

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(
    session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
    })
);

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use(express.static("uploads"));

app.set('view engine', 'ejs');


app.use("", require('./routes/routes'));

app.listen(PORT, () => {
    console.log(`Servidor rodando! (http://localhost:${PORT})`);
});