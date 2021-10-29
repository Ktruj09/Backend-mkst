'use strict'

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const PublicationModel = new mongoose.Schema({
    text: {
        type: String
    },
    file: {
        type: String
    },
    created_at: {
        type: String
    },
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

PublicationModel.plugin(mongoosePaginate)

module.exports = mongoose.model('Publication', PublicationModel);