console.log("login js loaded")

$("body").on("click", "#patientLogin", function(){
    let code = $("#patientLoginCode").val().trim();
    $.ajax({
        url: "/login/patient",
        method: "POST",
        contenType: "application/json",
        data: {id: code},
        success: function(res){
            let data = res;
            console.log(data);
            localStorage.setItem("login", JSON.stringify(data));
            window.location = "patient.html"
        },
        error: function(){
            alert("Error")
        }
    })
})

$("body").on("click", "#doctorLogin", function(){
    let code = $("#doctorLoginCode").val().trim();
    $.ajax({
        url: "/login/doctor",
        method: "POST",
        contenType: "application/json",
        data: {id: code},
        success: function(res){
            let data = res;
            console.log(data);
            localStorage.setItem("login", JSON.stringify(data));

            if(data.admin === true){
                window.location = "admin.html"
            } else {
                window.location = "doctor.html"
            }
          
        },
        error: function(){
            alert("Error")
        }
    })
})

//Generate patient personal code
$("body").on("click", "#createPatientCode", function(){
    let email = $("#patientEmail").val().trim();
    $.ajax({
        url: "/createPatient",
        method: "POST",
        data: {email: email},
        success: function(res){
            let data = res;
            console.log(data);
            $("#patientCodeModal").modal("hide");
            $("#displayCodeModal").modal("show");
            $("#yourCode").text(data);
        }
    })
})