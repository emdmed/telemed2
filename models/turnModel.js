const mongoose = require("mongoose");
const config = require("../config");

//SCHEMA
var User= mongoose.Schema({
    creation_date: Date,
    doctorId: String,
    patientId: String,
    turnDate: String,
    hour: Number,
    min: Number,
    active: Boolean,
    admin: Boolean
});

var User = module.exports = mongoose.model(config.dbName + "_turn", User);
        