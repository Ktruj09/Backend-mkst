'use strict'

const { Router } = require('express');

//controlador user
const {
    Homeget,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile
} = require('../controller/user');

//jwt auth
const ensureAuth = require('../middleware/auth');

const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './uploads/users' })



const api = Router();

api.get('/home', ensureAuth, Homeget);

//metodo para registrar usuarios
api.post('/register', saveUser);

//metodo para login
api.post('/login', loginUser);

//método para mostrar usuario
api.get('/user/:id', ensureAuth, getUser);

//método para mostrar listado de usuarios
api.get('/usersP', getUsers)

//método para actualizar usuario
api.put('/updateUser/:id', ensureAuth, updateUser)

//ruta para subir image
api.post('/upload-image-user/:id', [ensureAuth, md_upload], uploadImage)

//obtenemos imagen
api.get('/getImageUser/:imageFile', getImageFile)



module.exports = api;