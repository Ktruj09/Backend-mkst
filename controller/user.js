"use strict";

//importamos nuestro modelo usuario
const User = require("../models/user");

//importamos bcryp para cifrar la contraseña
const bcrypt = require("bcrypt-nodejs");
const fs = require('fs')
var path = require('path')
var jwt = require('../services/jwt')

//importamos los paquetes para la subida de archivos




//metodo prueba
const Homeget = async(req, res = response) => {
    res.status(200).send({
        message: "Hola mundo!!!!",
    });
}; //end homeget

//metodo para guardar usuarios
const saveUser = async(req, res) => {
        const params = req.body;
        const user = new User();

        if (params.name && params.email && params.password && params.address) {

            user.name = params.name;
            user.email = params.email;
            user.password = params.password;
            user.address = params.address;
            user.type_user = params.type_user;
            user.image = null;

            //verificar si ya existe el correo 
            await User.find({
                $or: [{ email: user.email.toLowerCase() }]

            }).exec((err, users) => {
                if (err) return res.status(500).send({ message: 'Error en la petición' })

                if (users && users.length >= 1) {
                    return res.status(200).send({ message: 'Ya existe un usuario con este correo' })
                } else {
                    bcrypt.hash(params.password, null, null, (err, hash) => {
                        user.password = hash;

                        //guardar usuario
                        user.save((err, userStore) => {
                            if (err) return res.status(500).send({ message: 'Error al guardar el usuario' })

                            if (userStore) {
                                res.status(201).send({ user: userStore })
                            } else {
                                res.status(404).send({ message: 'No se ha registrado el usuario' })
                            }
                        })
                    })
                }
            })


        } else {
            res.status(200).send({
                message: 'Rellene todos los campos necesarios.'
            })
        }

    } //end saveUser

//metodo login
const loginUser = async(req, res) => {
        //hacemos una recogida de los parametros que nos llegarán
        const { email, password } = req.body;
        //servira para generar el token
        const params = req.body;
        await User.findOne({ email: email }, (err, user) => {
            if (err) { return res.status(500).send({ message: "Error en la petición" }); }

            if (user) {
                //comparamos contraseña
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check) {

                        if (params.gettoken) {

                            //si da true, devuelve un token
                            //generar token
                            return res.status(200).send({
                                //hacemos llamado al servicio creado
                                token: jwt.CreateTokn(user)
                            })


                        } else {
                            user.password = undefined;
                            return res.status(200).send({ user })
                        }

                    } else {
                        return res
                            .status(401)
                            .send({ message: "Email incorrecto o contraseña incorrecta" });
                    }
                });
            } else {
                return res.status(401).send({ message: "Error al iniciar sesión" });
            }
        });
    } //end login

//metodo para extraer un usuario
const getUser = async(req, res) => {
        const userId = req.params.id;

        await User.findById(userId, (err, user) => {
            if (err) return res.status(500).send({ message: 'Error en la petición' })

            //si el usuario no llega
            if (!user) return res.status(404).send({ message: 'El usuario no existe' })

            return res.status(200).send({ user })
        })
    } //end getUser

//devolver un listado de usuarios páginados
const getUsers = async(req, res) => {
    const limit = req.query.limit || 5;
    const page = req.query.page || 1;
    const users = await User.paginate({}, { limit, page: page })

    return res.status(200).send({
        users

    })

}

//método para actualizar datos del usuario
const updateUser = async(req, res) => {
    const userId = req.params.id;
    const update = req.body;

    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No tienes permiso para actualizar los datos' })
    }

    await User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
        if (!userUpdated) return res.status(404).send({ message: 'No se ha podido hacer la actualización' })

        return res.status(201).send({
            message: 'Actualización realizada exitosamente!',
            user: userUpdated
        })
    })
}

//metodo para subir image
const uploadImage = async(req, res) => {
        const userId = req.params.id;

        if (req.files) {
            const file_path = req.files.image.path;
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
                await User.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, userUpdate) => {
                    if (err) res.status(404).send({ message: 'Error al actualizar los datos del usuario' })

                    res.status(201).send({ user: userUpdate })
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

const getImageFile = async(req, res) => {
    const image_file = req.params.imageFile;
    const path_file = './uploads/users/' + image_file;

    fs.exists(path_file, (exists) => {
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
    Homeget,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile
};