const scorePatient = (patient)=>{

    console.log("Scoring...");

    let activeSypmtoms = [];

    //rule out
    for(key in patient.ruleOut){
        console.log(patient.ruleOut[key])
        if(patient.ruleOut[key] === true){
            console.log("patient ruled out! because: ", key, " is true");
                patient.score = 100;
                return patient;
        }
    }

    //not ruled out
    //check age priority
    if(patient.info.age >= 40 && patient.info.age < 70){
        patient.score = 30;
    } else if (patient.info.age >= 18 && patient.info.age < 40){
        patient.score = 0;
    } else if (patient.info.age > 70){
        patient.score = 60;
    }

    //check symptoms
    for(key in patient.symptoms){
        if(patient.symptoms[key].isPresent === true){
            console.log(key, " is true");
            //activeSypmtoms.push({[key]: patient.symptoms[key]});
        }
    }

    diagnose(patient);

    console.log("Patient score: ", patient.score);

    return patient;

}

function diagnose(patient){
    console.log("diagnosing...");
    let score = patient.score;

    //Abdominal 
    //apendicitis
    if(patient.symptoms.fever.isPresent === true && patient.symptoms.abdominalPain.isPresent === true && patient.symptoms.abdominalPain.location.seven == true){
        console.log("apendicitis");
        patient.score = 70; 
    }

    //colecistitis
    if(patient.symptoms.fever.isPresent === true && patient.symptoms.abdominalPain.isPresent === true && patient.symptoms.abdominalPain.location.one == true){
        console.log("colecistitis");
        let score = patient.score;
        patient.score = score + 15;

    } else if(patient.symptoms.abdominalPain.isPresent === true && patient.symptoms.abdominalPain.location.one == true){
        console.log("colecistitis,sin fiebre");
        let score = patient.score;
        patient.score = score + 7;
    }

    //Infecciones respiratorias
    //faringitis-laringitis
    if(patient.symptoms.throatPain.isPresent === true){
   
        if(patient.symptoms.fever.isPresent === true){
            patient.score = score + 2
            console.log("Fever + ")
        } else if (patient.symptoms.fever.isPresent === false){
            patient.score = score + 1
        }

        if(patient.symptoms.throatPain.voiceChange === false){
            console.log("faringitis");
        } else if (patient.symptoms.throatPain.voiceChange === true){
            console.log("laringitis");
        }
    } 

    //CVAS
    if(patient.symptoms.throatPain.isPresent === true && patient.symptoms.fever.isPresent === true){
        patient.score = score + 3
        patient.info.covidAlert = true
    }

    //infeccion respiratoria baja
    if(patient.symptoms.fever.isPresent === true && patient.symptoms.cough.isPresent === true){
        console.log("respiratory infection")
        patient.score = score + 15;
        patient.info.covidAlert = true
    }

    //infeccion urinaria baja
    if(patient.symptoms.urinatingPain.isPresent == true && patient.symptoms.fever.isPresent === false){
        console.log("infeccion urinaria baja")
        patient.score = score + 3;
    } else if (patient.symptoms.urinatingPain.isPresent == true && patient.symptoms.fever.isPresent === true){
        console.log("infeccion urinaria alta o complicada");
        patient.score = score + 10;
    }

    return patient;

}

module.exports = scorePatient;

