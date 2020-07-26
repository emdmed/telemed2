//doctor code ddddfc

moment.lang("es");
moment.locales("America/Buenos_Aires");




let today = moment().format('L')
console.log(today)

function checkLoggedin(){
    let logged = JSON.parse(localStorage.getItem("login"));
    if(logged === undefined || logged === null){
        window.location = "index.html"
    } else {
        getTurns(logged.selector)
    }
}

checkLoggedin();

function getTurns(doctor){
    $.ajax({
        url: "/turns/findDoctorTurn",
        method: "POST",
        data: {selector: doctor},
        success: function(res){
            let data = res;
            $("#myTurnsHere").empty();
            data.forEach(element => {
                let minutes;
                if(element.min < 10){
                    minutes = "0"+element.min
                } else {
                    minutes = element.min
                }

                if(element.patientId === "none"){
                    $("#myTurnsHere").append(`

                        <div class="form-row my-auto">
                            <h5 class="my-auto mr-2">${moment(element.turnDate, "DD-MM-YYYY").format("L")}</h5>
                            <h5 class="my-auto mr-2"> a las ${element.hour}:${minutes}hs</h5>
                            <p class="my-auto mr-2">Libre</p>            
                            <button class="btn btn-outline-danger deleteTurn" id="${element._id}">x</button>
                        </div>
                        <hr>
                
                    `)
                } else {
                    $("#myTurnsHere").append(newturnhtml(element, minutes))
                }
            });
        },
        error: function(){
            console.log("Error")
        }
    })
}

$("body").on("click", ".deleteTurn", function(){

    let id = $(this).attr("id");
    let doctor = JSON.parse(localStorage.getItem("login"))
    $.ajax({
        url: "/turns/deleteTurn",
        method: "POST",
        data: {id: id},
        success: function(res){
            console.log(res)
            alert("Turno eliminado")
            $("#myTurnsHere").empty();
            getTurns(doctor)
        },
        error: function(){
            console.log("Error")
        }
    })
})


$("body").on("click", ".createTurn", function(){
    console.log("click")
    let creationDate = new Date();
    let date = moment($("#turnDate").val()).format("L")
    let hs = $("#turnHour").val().trim();
    let min = $("#turnMin").val().trim();
    let doctor = JSON.parse(localStorage.getItem("login"));

    $.ajax({
        url: "/turns/createTurn",
        method: "POST",
        data: {creation_date: creationDate, doctorId: doctor.selector, patientId: "none", turnDate: date, hour: hs, min: min, active: false},
        success: function(res){
            console.log(res);
            alert("Turno creado")
            $("#turnHour").val("");
            $("#turnMin").val("");

            //get turns
            let doctor = JSON.parse(localStorage.getItem("login"));
            getTurns(doctor.selector)
        },
        error: function(){
            console.log("Error")
        }
    })
});

$("body").on("click", ".startTurn",  function(){
    let id = $(this).attr("id");
    //find turn and set it to active
    $.ajax({
        url: "/turns/setActiveTurn",
        method: "POST",
        data: {id: id},
        success: function(res){   
            let data = res;
            localStorage.setItem("doctorActiveTurn", JSON.stringify(data));
            window.location = "doctorVideocall.html"
        },
        error: function(){
            console.log("Error")
        }
    })
})

$("body").on("click", "#refreshDoctorTurns", function(){
    location.reload();
})


function oldturnhtml(element){
    return `
                
    <div class="btn-group w-100" role="group" aria-label="Basic example">
        <button class="btn btn-success startTurn" id="${element._id}">Iniciar</button>
        <button class="btn btn-primary w-100">${moment(element.turnDate, "DD-MM-YYYY").format("L")} ${element.hour}:${minutes}hs Turno tomado</button>
        <button class="btn btn-danger deleteTurn" id="${element._id}">x</button>
    </div>
    
    `
}

function newturnhtml(element, minutes){
    return `
    <div class="form-row my-auto">
        <h5 class="my-auto mr-2">${moment(element.turnDate, "DD-MM-YYYY").format("L")}</h5>
        <h5 class="my-auto mr-2"> a las ${element.hour}:${minutes}hs</h5>
        <p class="my-auto mr-2">Turno tomado</p>            
        <div class="btn-group" role="group">
            <button class="btn btn-outline-success startTurn" id="${element._id}">Iniciar</button>
            <button class="btn btn-outline-danger deleteTurn" id="${element._id}">x</button>
        </div>
    </div>
    <hr>
    `
}

$("body").on("click", "#setPaymentLink", function(){
    let doctor = JSON.parse(localStorage.getItem("login"));

    let link = prompt("Ingrese su link de pago");

    $.ajax({
        url: "/changePaymentLink",
        method: "POST",
        data: {id: doctor._id, link: link},
        success: function(res){
            console.log(res);
        },
        error: function(err){
            console.log(err);
        }
    })
})


