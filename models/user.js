'use strict'

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')
const UserModel = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido, favor ingresar Nombre']

    },
    email: {
        type: String,
        required: [true, 'El nombre es requerido, favor ingresar Email']

    },
    password: {
        type: String,
        required: [true, 'El nombre es requerido, favor ingresar Contraseña']

    },
    address: {
        type: String,
        required: [true, 'El nombre es requerido, favor ingresar Dirección']

    },
    type_user: {
        type: String,
        required: [true, 'El nombre es requerido, favor ingresar Tipo de Usuario']

    },
    image: {
        type: String,

    }

});

UserModel.plugin(mongoosePaginate)
module.exports = mongoose.model('User', UserModel);