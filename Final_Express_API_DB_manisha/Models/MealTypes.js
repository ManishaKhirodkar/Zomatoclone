const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mealTypesSchema = new Schema({
    name: {
        type : String,
        required: true
    },
    meal_type: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('mealTypes', mealTypesSchema, 'mealtypes');

