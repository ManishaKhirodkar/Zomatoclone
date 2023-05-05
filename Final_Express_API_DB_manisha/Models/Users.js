const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    username: {
        type : String,
        required: true
    },
    password: {
        type: String ,
        required: true
    },
    firstname: {
        type : String,
        required: true
    },
    lastname: {
        type : String,
        required: true
    }
})

module.exports = mongoose.model('user', usersSchema, 'users');

