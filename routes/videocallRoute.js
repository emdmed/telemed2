const express = require('express');
const router = express.Router();
const apiHandler = require("../handlers/api_handler");
const dbHandler = require("../handlers/db_handler");
const config = require("../config");
const apiKey = "46727622";
var OpenTok = require('opentok'),
    opentok = new OpenTok(apiKey, "6a01eb366bfe5759ebd5b18033894f50dd01338c");

//let sessionStigliani = undefined;

let sessions = {
    sessionStigliani: {
        available: false,
        patient: false,
        data: ""
    }
}

router.get("/createtoken", async function(req, res){

    console.log("active session", sessions.sessionStigliani);

    let token;
    try{
        
        if(sessions.sessionStigliani.patient === false){
            console.log("Stigliani session", sessions.sessionStigliani.data);
            token = opentok.generateToken(sessions.sessionStigliani.data);
            console.log("TOKEN ",token);
            sessions.sessionStigliani.patient = true;
            console.log(sessions.sessionStigliani);
            res.json({sessionId: sessions.sessionStigliani.data, token, apiKey, patient: sessions.sessionStigliani.patient}).end();
        } else {
            console.log("patient is true: ", sessions.sessionStigliani.patient, "token ",token, "session ", sessions.sessionStigliani.data);
            res.status(400).end();
        }
      
    }catch(error){
        console.log(error);
        res.status(400).end();
    }
    
})

router.get("/createsession", function(req, res){
    opentok.createSession(function(err, session) {
        if (err) return console.log(err);
        let token = session.generateToken()

        sessions.sessionStigliani.data = session.sessionId;
        sessions.sessionStigliani.available = true;
        console.log("Session created ",sessions.sessionStigliani);

        res.json({
            apiKey,
            sessionId: session.sessionId,
            token
        }).end();
    });
})

router.get("/checkSession", function(req, res){
    console.log("Check session")
    if(sessions.sessionStigliani.data === ""){
        res.send({session: false}).end();
    } else {
        res.send({session: true}).end();
    }

})

router.get("/createtoken", function(req, res){
    let token;
    try{
        console.log("endocrino session", sessions.sessionStigliani.data);
        token = opentok.generateToken(sessions.sessionStigliani.data);
        console.log("patient video ", "token ",token, "session ", sessions.sessionStigliani.data);
        res.json({sessionId: sessions.sessionStigliani.data, token, apiKey}).end();
    }catch{
        console.log("patient video ", "token ",token, "session ", sessions.sessionStigliani.data);
        res.status(400).end();
    }
})

//client tells server to delete sessions
router.get("/deleteSession", function(req, res){
    sessions.sessionStigliani.data = "";
    console.log("Session deleted")
    res.status(200).end();
})

//client tells server patient got disconnected, in case the patient needs to log back again
router.get("/patientDisconnectedSession", function(req, res){
    sessions.sessionStigliani.patient = false;
    sessions.sessionStigliani.data = "";
    console.log("Patient disconnected")
    res.status(200).end();
})

module.exports = router;