const express = require('express');
const router = express.Router();
const apiHandler = require("../handlers/api_handler");
const dbHandler = require("../handlers/db_handler");
const config = require("../config");
const apiKey = "46727622";
var OpenTok = require('opentok'),
    opentok = new OpenTok(apiKey, "6a01eb366bfe5759ebd5b18033894f50dd01338c");

router.post("/createtoken", async function(req, res){

    let data = req.body;

    console.log("active session", data.doctorId);

    let session = await dbHandler.findDoctorBySelector(data.doctorId);
    console.log("Session 1 ", session)

    let token;
    try{
        
        if(session.attending === false){
            console.log("Session 2", session);
            token = opentok.generateToken(session.sessionData);
            console.log("TOKEN ",token);
            
            await dbHandler.updateDoctorSession(session)

            res.json({sessionId: session.sessionData, token, apiKey, patient: session.attending}).end();
        } else {
            //console.log("patient is true: ", sessions.sessionStigliani.patient, "token ",token, "session ", sessions.sessionStigliani.data);
            res.status(400).end();
        }
      
    }catch(error){
        console.log(error);
        res.status(400).end();
    }
    
})

router.post("/createsession", async function(req, res){
    let data = req.body;
    console.log("data ", data)
    
    let doctorSession = await dbHandler.findDoctorBySelector(data.selector);
    console.log(doctorSession)

    opentok.createSession(async function(err, session) {
        if (err) return console.log(err);
        let token = session.generateToken()

        doctorSession.sessionData = session.sessionId;

        console.log("Session created ", doctorSession);

        //update doctor with new data here
        await dbHandler.updateDoctorSession(doctorSession);

        res.json({
            apiKey,
            sessionId: doctorSession.sessionData,
            token
        }).end();
    });
})

router.post("/checkSession", async function(req, res){
    console.log("Check session")
    let data = req.body;

    let doctor =  await dbHandler.findDoctorBySelector(data.selector)

    console.log("check session ", doctor)

    if(doctor.sessionData === ""){
        res.send({session: false}).end();
    } else {
        res.send({session: true}).end();
    }

})

//client tells server to delete sessions
router.post("/deleteSession", async function(req, res){
    let data = req.body;
    let doctor = await dbHandler.findDoctorBySelector(data.doctorId);
    doctor.sessionData = "";
    doctor.attending = false;
    await dbHandler.updateDoctorSession(doctor);
    console.log("Session deleted")
    res.status(200).end();
})

//client tells server patient got disconnected, in case the patient needs to log back again
router.post("/patientDisconnectedSession", async function(req, res){
    let data = req.body;
    console.log("data ",data);

    let doctor = await dbHandler.findDoctorBySelector(data.doctorId);

    doctor.patient = false;
    doctor.sessionData = "";

    await dbHandler.updateDoctorSession(doctor);

    console.log("Patient disconnected")
    res.status(200).end();
})

module.exports = router;