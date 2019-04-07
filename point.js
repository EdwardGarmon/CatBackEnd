const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pointSchema = new mongoose.Schema({


    _id: mongoose.Schema.Types.ObjectId,
    name : String,
     
    hurricanes: [{type : Schema.Types.ObjectId, ref : 'hurricane'}]

})

module.exports = mongoose.model('point',pointSchema);