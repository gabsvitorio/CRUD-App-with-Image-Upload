const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);
    },
});

var upload = multer({
    storage: storage,
}).single('imagem');

router.post('/add', upload, (req, res) => {
    const user = new User({
        nome: req.body.nome,
        email: req.body.email,
        telefone: req.body.telefone,
        imagem: req.file.filename,
    });
    user.save((err) => {
        if(err){
            res.json({message: err.message, type: 'danger'});
        }else{
            req.session.message = {
                type: 'success',
                message: 'Usuário adicionado com sucesso!'
            };
            res.redirect("/");
        }
    })
});

router.get('/', (req, res) => {
    User.find().exec((err, users) => {
        if(err){
            res.json({ message: err.message });
        }else{
            res.render('index', {
                title: 'Página Inicial',
                users: users,
            })
        }
    })
});

router.get('/add', (req, res) => {
    res.render('add_users', { title: 'Add Users' });
});

module.exports = router;