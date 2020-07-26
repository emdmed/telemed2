let dev = true;

let payment = JSON.parse(localStorage.getItem("payment"))

setTimeout(() => {
    $.ajax({
        url: "/turns/patientTakeTurn",
        method: "POST",
        data: {_id: payment.id, patientId: payment.patient.id},
        success: function(res){
            if(dev === false){
                window.location = "https://www.siriustelemed.com/patient.html" //full url in production
            } else {
                window.location = "patient.html"
            }
       
        },
        error: function(){
            alert("Error")
            if(dev === false){
                window.location = "https://www.siriustelemed.com"
            } else {
                window.location = "index.html"
            }
            
        }
    })
}, 1000);

