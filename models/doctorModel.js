const mongoose = require("mongoose");
const config = require("../config");

//SCHEMA
var User= mongoose.Schema({
    creation_date: Date,
    id: String,
    lastname: String,
    name: String,
    specialty: String,
    selector: String,
    matricula: Number,
    attending: Boolean,
    sessionData: String
});

var User = module.exports = mongoose.model(config.dbName + "_medico", User);
        