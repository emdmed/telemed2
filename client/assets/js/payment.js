let payment = JSON.parse(localStorage.getItem("payment"))

setTimeout(() => {
    $.ajax({
        url: "/turns/patientTakeTurn",
        method: "POST",
        data: {_id: payment.id, patientId: payment.patient.id},
        success: function(res){
            window.location = "https://www.siriustelemed.com/patient.html" //full url in production
        },
        error: function(){
            alert("Error")
            window.location = "https://www.siriustelemed.com"
        }
    })
}, 1000);

