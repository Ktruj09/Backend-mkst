'use strict'

const { Router } = require('express');

//metodos para subida de archivos.
const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './uploads/publications' })
    //controlador Publication
const {
    prueba,
    savePublication,
    getPublications,
    getPublication,
    updatePublication,
    deletePublication,
    uploadFile,
    getFile
} = require('../controller/publication');
const ensureAuth = require('../middleware/auth');

const api = Router();

api.get('/home', prueba);

//ruta guardar publicación
api.post('/publication', ensureAuth, savePublication)

//ruta mostrar publicaciones
api.get('/getPublications/:page?', ensureAuth, getPublications)

//ruta para devolver una sola publicación
api.get('/publication/:id', ensureAuth, getPublication)

//ruta para actualizar una publicación
api.put('/updatedPublication/:id', ensureAuth, updatePublication)

//ruta para eliminar publicación
api.delete('/deletePublication/:id', ensureAuth, deletePublication)

//ruta para subir imagen a la publicación
api.post('/filePublication/:id', md_upload, uploadFile)
module.exports = api;