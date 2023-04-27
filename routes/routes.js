const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');
const fs = require('fs');

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

router.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    User.findById(id, (err, user) => {
        if(err){
            res.redirect('/');
        }else{
            if(user == null){
                res.redirect('/');
            }else{
                res.render('edit_users', {
                    title: "Editar Usuário",
                    user: user,
                });
            }
        }
    });
});

router.post('/update/:id', upload, (req, res) => {
    let id = req.params.id;
    let nova_imagem = '';

    if (res.file) {
        nova_imagem = req.file.filename;
        try{
            fs.unlinkSync("./uploads/" + req.body.imagem_anterior);
        } catch(err){
            console.log(err);
        }
    }else{
        nova_imagem = req.body.imagem_anterior;
    }

    User.findByIdAndUpdate(id, {
        nome: req.body.nome,
        email: req.body.email,
        telefone: req.body.telefone,
        imagem: nova_imagem,
    }, (err, result) => {
        if(err){
            res.json({ message: err.message, type: 'danger' });
        }else{
            req.session.message = {
                type: 'success',
                message: 'Usuário atualizado com sucesso!',
            };
            res.redirect('/');
        }
    })
});

module.exports = router;