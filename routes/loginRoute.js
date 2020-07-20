const express = require('express');
const router = express.Router();
const apiHandler = require("../handlers/api_handler");
const dbHandler = require("../handlers/db_handler");
const config = require("../config");

router.post("/patient",  async function(req, res){
    let data = req.body;
    console.log(data)
    let login = await dbHandler.login.login_patient(data)

    if(login === false){
        res.status(404).end();
    } else {
        res.send(login[0]).end();
    }

})


router.post("/doctor",  async function(req, res){
    let data = req.body;
    console.log(data)
    let login = await dbHandler.login.login_doctor(data)

    if(login === false){
        res.status(404).end();
    } else {
        res.send(login[0]).end();
    }

})

module.exports = router;