const dbHandler = require("./db_handler");

const api_handler = {
    createDoctor,
    createTurn,
    createPatient
}

async function createDoctor(name, lastname, selector, specialty, matricula){
    await dbHandler.login.create_doctor({
        creation_date: new Date(),
        lastname: lastname,
        name: name,
        selector: selector,
        specialty: specialty,
        matricula: matricula,
        attending: false,
        sessionData: ""
    });
}

async function createTurn(doctorId, patientId, turnDate, hour, min){
    await dbHandler.createTurn({
        creation_date: new Date(),
        doctorId,
        patientId,
        turnDate,
        hour,
        min
    })
}

async function createPatient(patient){
    let code = await dbHandler.login.create_patient({email: patient.email});
    await code;
    return code;
}

module.exports = api_handler;