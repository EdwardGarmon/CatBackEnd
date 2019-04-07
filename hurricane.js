const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hurricaneSchema = new mongoose.Schema({


    _id: mongoose.Schema.Types.ObjectId,
    name: String,            
    windspeed: Number,
    year: Number,
    type: String,
    

})

module.exports = mongoose.model('hurricane',hurricaneSchema);