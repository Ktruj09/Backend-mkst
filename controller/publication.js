'use strict'
const path = require('path');
const fs = require('fs');
const moment = require('moment');


const Publication = require('../models/publication');
const User = require('../models/user');

const prueba = async(req, res) => {
    res.status(200).send({
        message: 'Probando ruta Publication'
    })
}


//metodo guardar publicación
const savePublication = async(req, res) => {
        const params = req.body;
        const publication = new Publication();

        if (!params.text) {
            return res.status(200).send({ mesage: 'Debes enviar un texto' })
        }

        //seteamos a cada uno de las propiedades
        publication.text = params.text;
        publication.file = null;
        //guardamos el id del usuario que esta haciendo la publicación
        publication.user = req.user.sub;
        publication.created_at = moment().unix();

        await publication.save((err, publicationStored) => {
            if (err) res.status(500).send({ message: 'Error al hacer la publicación' })
            if (!publicationStored) res.status(404).send({ mesage: 'Error al guardar publicación' })

            return res.status(201).send({ publication: publicationStored })
        })
    } //end savePublication

//Método para mostrar publicaciones.
const getPublications = async(req, res) => {
        const limit = req.query.limit || 5;
        const page = req.query.page || 1;


        const publications = await Publication.paginate({}, { limit, page: page })

        return res.status(200).send({
            publications

        })



    } //end getPublications

//devolver publicación con base de su ID
const getPublication = async(req, res) => {
        const publicationId = req.params.id;

        await Publication.findById(publicationId, (err, publication) => {
            if (err) res.status(500).send({ message: 'Error en el Servidor ' })

            if (!publication) res.status(404).send({ message: 'No existe la publicación.' })

            return res.status(200).send({
                publication
            })
        })

    } //end getPublication

//método actualización
const updatePublication = async(req, res) => {
        const publicationId = req.params.id;
        const update = req.body;

        await Publication.findByIdAndUpdate(publicationId, update, { new: true }, (err, publicationUpdate) => {
            if (err) res.status(404).send({ message: 'Error al actualizar el dato. Vuelva a intentarlo' })

            return res.status(201).send({
                publication: publicationUpdate
            })
        })
    } //end método acutalización

//const delete publicación
const deletePublication = async(req, res) => {
        const publicactionId = req.params.id;

        await Publication.findByIdAndDelete(publicactionId, (err, deletePublication) => {
            if (err) res.status(500).send({ message: 'Error en el servidor, vuelve a intentarlo.' })

            return res.status(200).send({
                message: 'Publicación Eliminada.',
                publication: deletePublication
            })
        })
    } //end eliminar publicación

//metodo para subir imagen
const uploadFile = async(req, res) => {
        const publicationId = req.params.id;

        if (req.files) {
            const file_path = req.files.file.path;
            console.log(file_path)
            const file_split = file_path.split('\\')
            console.log(file_split)

            //sacamos el nombre del archivo
            const file_name = file_split[2];
            console.log(file_name)

            const ext_split = file_name.split('\.');
            const file_ext = ext_split[1];
            console.log(file_ext);
            if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg') {

                //actualizar documento de usuario logueado
                await Publication.findByIdAndUpdate(publicationId, { file: file_name }, { new: true }, (err, publicationUpdate) => {
                    if (err) res.status(404).send({ message: 'Error al actualizar los datos del usuario' })

                    res.status(201).send({
                        message: 'Se ha subido el archivo correctamente..',
                        user: publicationUpdate
                    })
                })
            } else {
                return removeFile(res, file_path, 'Extensión no validad')
            }
        } else {
            return res.status(200).send({ message: 'No se ha podido subir la imagen' })
        }


    } //end subida de archivos

function removeFile(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message: message })
    })
}

const getFile = async(req, res) => {
    const image_file = req.params.imageFile;
    const path_file = './uploads/publications/' + image_file;

    await fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({
                message: 'No existe la imagen'
            })
        }
    })
}
module.exports = {
    prueba,
    savePublication,
    getPublications,
    getPublication,
    updatePublication,
    deletePublication,
    uploadFile,
    getFile
}