//patient test code 7da56e

moment.lang("es");
moment.locales("America/Buenos_Aires");

var dev = true;

function checkLoggedin(){
    var logged = JSON.parse(localStorage.getItem("login"));
    console.log(logged)
    if(logged === undefined || logged === null){
        //request new code
    } else {
        checkTakenTurn(logged)
        renderDoctors();
        setInterval(() => {
            checkTakenTurn(logged)
        }, 10000);
    }
}

function checkTakenTurn(patient){
    $.ajax({
        url: "/turns/patientTakenTurn",
        method: "POST",
        data: patient,
        success: function(res){
            let data = res;
            console.log(data)

            if(data.length > 0){
                //allow to take turns
                localStorage.setItem("validTurn", true)
                $(".main-patient-div").empty();

                let minutes;
                if(data[0].min < 10){
                    minutes = "0"+data[0].min;
                } else {
                    minutes = data[0].min;
                }
                //if turn

                $(".main-patient-div").empty();
                $(".main-patient-div").append(`
                    <div class="row">
                        <div class="col">   
                            <h2>Espere...</h2>
                        </div>
                        <div class="col">
                            <h3>${data[0].turnDate} a las ${data[0].hour}:${minutes}hs</h3>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <button class="btn btn-primary enterVideoCall mx-auto mt-3" disabled>Por favor espere...</button>
                        <h5 id="patientMessage" class="text-center mt-5">El médico se está preparando para iniciar la consulta</h5>
                    </div>
                `)

                if(data[0].active === true){
                    //check session
                    $.ajax({
                        url: "/videocall/checkSession",
                        method: "POST",
                        data: {selector: data[0].doctorId},
                        success: function(res){
                            let data = res;
                            console.log(data)
                            if(data.session === true){
                                $(".enterVideoCall").text("Ingresar a videollamada");
                                $(".enterVideoCall").prop("disabled", false);
                            } else if(data.session === false) {
                                console.log(data)
                                // don not activate videocall button
                            } else {
                                console.log("ERROR IN TURN OBJECT")
                            }
                        }
                    })

                } else {
                    $(".main-patient-div").empty();
                    $(".main-patient-div").append(`
                        <div class="row">
                            <div class="col text-center">   
                                <h2 class="text-center">Tiene un turno solicitado</h2>
                            </div>
                            <div class="col text-center">
                                <h3 text-center>${data[0].turnDate} a las ${data[0].hour}:${minutes}hs</h3>
                            </div>
                        </div>
                        <hr>
                        <div class="row text-center">
                            <div class="col">
                                <button class="btn btn-block btn-primary enterVideoCall mx-auto mt-3" disabled>Unirse a videollamada</button>
                                <button class="btn btn-danger cancelTurn mx-auto mt-3" id="${data[0]._id}">Cancelar turno</button>
                                <h5 id="patientMessage" class="text-center mt-5">Podrá unirse cuando el médico inicie la llamada a la hora indicada</h5>
                            </div>   
                        </div>
                    `)
                }
            } else {
                localStorage.setItem("validTurn", false)
            }
        },
        error: function(){
            console.log("Error")
        }
    })
}

checkLoggedin();

$("body").on("click", ".seeTurns", function(){
    let id = $(this).attr("id");
    let paymentLink = $(this).attr("name");
    $("#turnsModal").modal("show")
    $.ajax({
        url: "/turns/findDoctorTurn",
        method: "POST",
        data: {selector: id},
        success: function(res){
            let data = res;
            console.log(data);
            $("#turnsHere").empty();
         
            data.forEach(element => {
                let now = moment()
                let turn = moment(element.turnDate, 'DD-MM-YYYY')
                let difference = turn.diff(now, "days");
                let minutes;
                if(element.min < 10){
                    minutes = "0"+element.min
                } else {
                    minutes = element.min
                }
                if(difference < 0){
                   
                }else {
                    if(element.patientId === "none"){
                        $("#turnsHere").append(`

                            <div class="btn-group w-100 mb-1" role="group" aria-label="Basic example">
                                <button class="btn btn-secondary w-100 takeTurn" name="${paymentLink}" id="${element._id}">${moment(element.turnDate, "DD-MM-YYYY").format("dddd")} ${moment(element.turnDate, "DD-MM-YYYY").format("L")} ${element.hour}:${minutes}hs</button>
                            </div>
                    
                        `)
                    } 
                }
            });
        },
        error: function(){
            $("#turnsHere").empty();
            $("#turnsHere").append(`
                <h2>No se han encontrado turnos</h2>
            `)  
        }
    })
})


$("body").on("click", ".takeTurn", function(){
    let id = $(this).attr("id");
    let paymentLink = $(this).attr("name");
    let patient = JSON.parse(localStorage.getItem("login"));
    let ask = confirm("El turno tiene un valor de 850 pesos. ¿Desea reservarlo?")
    if(ask === false){

    } else {    

        let payment = {
            id,
            patient
        }

        localStorage.setItem("payment", JSON.stringify(payment));
        // go to mercadopago payment
        if(dev === false){
            window.location = paymentLink
        } else {
            window.location = "paymentSuccess.html"
        }
    
    }
})

$("body").on("click", ".enterVideoCall", function(){
    window.location = "patientVideocall.html"
})


function renderDoctors(){
    $.ajax({
        url: "/getDoctors",
        method: "GET",
        success: function(res){
            let data = res;

            data.forEach(element=>{
                var cvId = element.selector;
                console.log("element ", element)
                $("#renderDoctorsHere").append(`
                
                    <div class="col-xl-4 col-lg-4 col-md-6 col-sm- ${element.specialty} filters">
                        <div class="single-team mb-30 shadow">
                            <div class="team-img">
                                <img src="assets/img/doctors/${element.selector}.jpg" alt="" class="img-fluid">
                            </div>
                            <div class="p-3">
                                <h3><a>Dr. ${element.lastname}</a></h3>
                                <span>${element.specialty}</span>
                                <p class="font-italic">MN ${element.matricula}</p>
                                <hr>
                                <div id="cv${element.selector}"></div>
                                <hr>
                                <button class="mt-2 btn btn-secondary seeTurns btn-block" name="${element.paymentLink}" id="${element.selector}">Solicitar turno</button>
                            </div>
                        </div>
                    </div>

                `)

                element.cv.forEach(element=>{
                    $("#cv"+ cvId).append(`<p>${element}</p>`)
                })
            })

      
        }
    })
}

$("body").on("click", ".cancelTurn", function(){

    let id = $(this).attr("id");
    $.ajax({
        url: "/turns/cancelTurn",
        method: "POST",
        data: {id: id},
        success: function(res){
            console.log(res)
            alert("Turno eliminado")
            location.reload();
        },
        error: function(){
            console.log("Error")
        }
    })
})

//FILTERS

$("body").on("click", "#filterClinica", function(){
    let specialty = $(this).text();
    $(".filters").hide();
    $("."+specialty).show();
})

$("body").on("click", "#filterCirugia", function(){
    let specialty = $(this).text();
    $(".filters").hide();
    $("."+specialty).show();
})

$("body").on("click", "#filterDiabetologia", function(){
    let specialty = $(this).text();
    $(".filters").hide();
    $("."+specialty).show();
})