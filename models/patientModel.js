const mongoose = require("mongoose");
const config = require("../config");

//SCHEMA
var User= mongoose.Schema({
    creationDate: Date,
    takenTurn: Object,
    id: String,
    email: String
});

var User = module.exports = mongoose.model(config.dbName + "_patient", User);
        