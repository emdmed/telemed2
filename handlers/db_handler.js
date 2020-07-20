const PatientModel = require("../models/patientModel");
const DoctorModel = require("../models/doctorModel");
const TurnModel = require("../models/turnModel");
const loginModule = require("./modules/login-module-db");

const db_handler = {
    getPatientList,
    findPatient,
    findDoctor,
    createTurn,
    updateTurn,
    deleteTurn,
    deletePatientTurn,
    patientTakeTurn,
    findDoctorTurn,
    findPatientTurn,
    findAllDoctors,
    setActiveTurn,
    deleteTurnByTurn,
    login: loginModule
}

async function createTurn(turn){
    await TurnModel.create(turn);
}

async function updateTurn(turn){
    await TurnModel.findOneAndUpdate(turn, {useFindAndModify: false});
}

async function setActiveTurn(id){
    let turn = await TurnModel.findByIdAndUpdate({_id: id}, {active: true},{useFindAndModify: false});
    return turn;
}

async function deleteTurn(doctor){
    await TurnModel.findOneAndDelete({_id: doctor.id});
}

//Turn was attended and finished by doctor
async function deleteTurnByTurn(turn){
    await TurnModel.findOneAndDelete({_id: turn._id});
    console.log("Turn finished by doctor");//save to attended turns db here
}

//Not being used
async function deletePatientTurn(turn){
    await TurnModel.findOneAndDelete({patientId: turn.id});
}

async function findDoctorTurn(doctor){
    let selector = doctor.selector;
    let found = await TurnModel.find({doctorId:selector})
    return found;
}

async function findPatientTurn(patient){
    console.log(patient.id)
    let found = await TurnModel.find({patientId:patient.id})
    return found;
}

async function patientTakeTurn(turn){
    await TurnModel.findOneAndUpdate({_id: turn._id}, {patientId: turn.patientId}, {useFindAndModify: false});
}

async function findPatient(patient){
    let found = await PatientModel.find({id: patient.id});
    if(found.length === 0){
        return false
    } else {
        return found;
    }
}

async function findDoctor(doctor){
    let found = await DoctorModel.find({id: doctor.id});
    if(found.length === 0){
        return false
    } else {
        return found;
    }
}

async function updatePatient(patient){
    try{
        let updated = await PatientModel.findOneAndUpdate({"info.phone": patient.info.phone}, patient, {useFindAndModify: false});
        return updated.info.number
    }catch(err){
        return false
    }
}

async function getPatientList(){
    let patientList = await PatientModel.find();
    return patientList;
}

async function deletePatient(phone){
    let deleted = await PatientModel.findOneAndDelete({"info.phone": phone});
}

async function findAllDoctors(){
    let doctors = DoctorModel.find();
    return doctors
}

module.exports = db_handler;