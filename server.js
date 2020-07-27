const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const config = require("./config")
const port = 3000;
const apiHandler = require("./handlers/api_handler");
const db_handler = require("./handlers/db_handler");

//config
config.environment.set();
config.connectToDB();

const server = require("http").createServer(app);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/client"));

//ROUTES
const loginRoute = require("./routes/loginRoute");
app.use("/login", loginRoute);

const turnsRoute = require("./routes/turnsRoute");
app.use("/turns", turnsRoute);

const videocallRoute = require("./routes/videocallRoute");
app.use("/videocall", videocallRoute);

app.get("/", function(req, res){
    res.sendFile("index.html")
})

app.post("/createPatient", async function(req, res){
    let data = req.body
    let patient;
    try{
        patient = await apiHandler.createPatient(data);
        res.send(patient).end();
    }catch(error){
        console.log(error);
        res.status(404).end();
    }
})

app.get("/getDoctors", async function(req, res){
    let doctors;
    try{
        doctors = await db_handler.findAllDoctors();
        res.send(doctors).end();
    }catch(error){
        console.log(error)
        res.status(404).end();
    }

})

app.post("/changePaymentLink", async function(req, res){
    let data = req.body;

    console.log(data)

    await db_handler.changeDoctorPaymentLink(data);

    res.status(200).end()
})

server.listen(process.env.PORT || port);
console.log("Running on port " + port)

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
/*
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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");
const msg = {
  to: 'enrique.darderes@gmail.com',
  from: 'enrique.darderes@gmail.com',
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);*/


apiHandler.createDoctor("Luciana", "Belbey", "lbelbey", "Clínica", "134091")
