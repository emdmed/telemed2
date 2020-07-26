const express = require('express');
const router = express.Router();
const apiHandler = require("../handlers/api_handler");
const dbHandler = require("../handlers/db_handler");
const config = require("../config");
const { db } = require('../models/turnModel');

router.post("/findDoctorTurn",  async function(req, res){
   let data = req.body;
   let found = await dbHandler.findDoctorTurn(data)
   if(found.length === 0){
      res.status(404).end();
   } else {
      res.send(found).end();
   }
})

//deleted turn by doctor on doctor menu, attended or not
router.post("/deleteTurn",  async function(req, res){
   let data = req.body;

   await dbHandler.deleteTurn(data);
   res.status(200).end()
})

router.post("/cancelTurn", async function(req, res){
   let data = req.body;

   console.log(data.id)

   await dbHandler.deletePatientFromTurn(data);
   res.status(200).end();
})

//Turn was attended and finished by doctor
router.post("/deleteTurnByTurn",  async function(req, res){
   let data = req.body;
   await dbHandler.deleteTurnByTurn(data);
   res.status(200).end()
})

//not being used
router.post("/deletePatientTurn",  async function(req, res){
   let data = req.body;

   await dbHandler.deletePatientTurn(data);
   res.status(200).end()
})

router.post("/createTurn",  async function(req, res){
   let data = req.body;

   await dbHandler.createTurn(data);
   res.status(200).end()
})

router.post("/patientTakeTurn",  async function(req, res){
   let data = req.body;
   await dbHandler.patientTakeTurn(data);
   res.status(200).end()
})

router.post("/patientTakenTurn",  async function(req, res){
   let data = req.body;

   let found = await dbHandler.findPatientTurn(data);
   res.send(found).end()
})

//doctor allows patient to enter videocall, after this the videocall must be started before the patient can enter it
router.post("/setActiveTurn",  async function(req, res){
   let data = req.body.id;
   let found = await dbHandler.setActiveTurn(data);
   res.send(found).end()
})





module.exports = router;