
moment.lang("es");
moment.locales("America/Buenos_Aires");
const url = "https://demotelemed.herokuapp.com"

let STORED_PATIENT = JSON.parse(localStorage.getItem("login"));

if (!STORED_PATIENT){
    alert("Error al validar paciente, por favor vuelva a ingresar");
    window.location = ENV_URL;
} else {}

var apiKey;
var sessionId;
var token;
let globalSession;

function createSession(doctorId){
    $.ajax({
        url: "/videocall/createsession",
        method: "POST",
        data: {selector: doctorId},
        success: function(res){
            let data = res;
            console.log("APIKEY ", data.apiKey);
            apiKey = data.apiKey;
            sessionId = data.sessionId;
            token = data.token;
            console.log("Session created! ", sessionId);
            // (optional) add server code here
            initializeSession();
        }
    })
}

$("body").on("click", "#init_consultation", function(){
    let doctor = JSON.parse(localStorage.getItem("doctorActiveTurn"))
    createSession(doctor.doctorId);
})

async function initPatientConsultorio(){

  let status = await checkLoggedInPatient();
  console.log("returned status ",status)
  
  //check for valid turn
  let turn = JSON.parse(localStorage.getItem("validTurn"))

  let turnData = JSON.parse(localStorage.getItem("turn"))

  if(status === true && turn === true){
    console.log("Init patient consultorio status is ", status)
    console.log("Creating token...");
    $.ajax({
      url: "/videocall/createtoken",
      method: "POST",
      data: turnData,
      success: function(res){
          let data = res;
          apiKey = data.apiKey;
          sessionId = data.sessionId;
          token = data.token;
          initializeSession();
      },
      error: function(){
          alert("El consultorio no se encuentra disponible, por favor espere a que el médico esté atendiendo");
      }
    })
  } else {
    alert("Error in initiating videocall");
  }
}

// Handling all of our errors here by alerting them
function handleError(error) {
    if (error) {
      alert(error.message);
    }
}
  
function initializeSession() {
    var session = OT.initSession(apiKey, sessionId);
    console.log("initsession ", "apikey", apiKey,  "sessionid", sessionId, "token ", token)
    globalSession = session;
  
    // Subscribe to a newly created stream
    session.on('streamCreated', function(event) {
        session.subscribe(event.stream, 'subscriber', {
          insertMode: 'append',
          width: '100%',
          height: '100%'
        }, handleError);
    });
    // Create a publisher
    var publisher = OT.initPublisher('publisher', {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    }, handleError);
  
    // Connect to the session
    session.connect(token, function(error) {
      // If the connection is successful, publish to the session
      if (error) {
        handleError(error);
      } else {
        session.publish(publisher, handleError);
      }
    });

    session.on("streamDestroyed", function(event) {

    let turndata = JSON.parse(localStorage.getItem("doctorActiveTurn"));

    $.ajax({
        url: "/videocall/patientDisconnectedSession",
        method: "POST",
        data: turndata,
        success: function(res){
            alert("Desconectado");
            if(window.location.href === url + "/patientVideocall.html"){
              window.location = "patient.html"
            } else {
              window.location = "doctor.html"
            }
        }
      })
  });
}

$("body").on("click", "#end_call", function(session){

  globalSession.disconnect()
  let doctorActiveTurn = JSON.parse(localStorage.getItem("doctorActiveTurn"));
  console.log(doctorActiveTurn)

  $.ajax({
    url: "/videocall/deleteSession",
    method: "POST",
    data: doctorActiveTurn,
    success: function(res){
      console.log(res);
      //delete turn
      $.ajax({
        url: "/turns/deleteTurnByTurn",
        method: "POST",
        data: doctorActiveTurn,
        success: function(res){
          console.log("Active Turn Deleted")
        }
      })
    }
  })
})

async function checkLoggedInPatient(){
  var status;
  let user = JSON.parse(localStorage.getItem("login"));

  if (user === undefined){
    alert("Necesita Ingresar para ser atendido");
    status = false;
  } else {
    //check if user is on waiting line and check index 
    await $.ajax({
      url: "/turns/patientTakenTurn",
      method: "POST",
      data: user,
      success: function(res){
        //is turn active true? return true
        let data = res;
        if(data[0].active === true){
          status = true
          localStorage.setItem("turn", JSON.stringify(data[0]))
        } else {
          status = false
        } 
      },
      error: function(){
          alert("Error")
          status = false
      }
    })
  }
  return status;
}

$("body").on("click", "#get_endocrino_patient_list", function(){
  $(".patients_here").empty();
  
  $.ajax({
    url:"/endocrinoPatientList",
    method: "GET",
    success: function(res){
      console.log(res)
      let data = res;
   
      data.forEach(element => {
        $(".patients_here").append(`
        
          <div class="form-row my-auto" id="${element.dni}">
            <p class="mr-1 my-auto">${element.email}</p>
            <p class="mx-1 my-auto">${element.dni}</p>
            <button class="btn btn-sm btn-danger mx-1 my-auto delete_patient" id="${element.dni}">x</button>
          </div>

        `)
      });
    }
  })
})

$("body").on("click", ".delete_patient", function(){
  let dni = $(this).attr("id");
  $.ajax({
    url: "/deleteEndocrinoTurnByDni",
    method: "POST",
    data: {dni: dni},
    success: function(){
      console.log("deleted!");
    }
  })
})

function checkPatientTurnDate(turn){
  let now = moment();
  let turnDate = moment(turn.turnDate, "DD/MM/YYYY")
  var validated = false;

  let difference = turnDate.diff(now, "days");
  if(difference === 0){
      //check time
      let nowHour = new Date().getHours()
      let nowMinutes = new Date().getMinutes();
      console.log(nowHour + ":" + nowMinutes)
      console.log("turn time: "+ turn.hour + ":" + turn.min)
      if(nowHour === turn.hour){
          //check minutes
          let minDiff = +nowMinutes - +turn.min
          if(minDiff >0 && minDiff <= 10){
              console.log("activate videocall")
              //check doctor active session
              validated = true
          } else if (minDiff < 0 && minDiff >= -10){
              //console.log("activate turn button")
              //check doctor active session
              validated = true
          } else {
              console.log("Activate videocall")
          }
      }
  }
  return validated
}