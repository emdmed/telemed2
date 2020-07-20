
const USER = require("../../models/patientModel");
const DOCTOR = require("../../models/doctorModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const crypto = require("crypto");
const { create } = require("../../models/patientModel");

const login_module = {
    create_patient: async function(patient){

        let token = await generateToken();
        await USER.create({id: token, takenTurn:{date: "", hour: "", min: ""}, creationDate: new Date(), email: patient.email})

        return token;

        /*
        crypto.randomBytes(3, async function(err, buffer) {
            code = buffer.toString('hex');
        
            console.log("create user ", create_user)
            let end = resolve(create_user);
            return end
        })*/
        
        //hash password
        /*await bcrypt.hash(user.password, saltRounds, async function(err, hash) {
            //console.log("hash ", hash);
            user.password = hash; 
            create_user = await USER.create(user);
        });   */

    },
    create_doctor: async function(user){
        let data = user

        crypto.randomBytes(3, async function(err, buffer) {
            code = buffer.toString('hex');
            data.id = code
            await DOCTOR.create(data);
        })
 

       

        //hash password
        /*await bcrypt.hash(user.password, saltRounds, async function(err, hash) {
            //console.log("hash ", hash);
            user.password = hash; 
            create_user = await USER.create(user);
        });   */
        
    },
    login_patient: async function(callback){
        let code = callback.id;

        let user_indb = await USER.find({id: code});

        if (user_indb.length === 0 || user_indb == null){
            console.log("cant login, user doesnt exist");
            return false;
        } else {
            return user_indb
        }
    },
    login_doctor: async function(callback){
        let code = callback.id;

        let user_indb = await DOCTOR.find({id: code});

        if (user_indb.length === 0 || user_indb == null){
            console.log("cant login, user doesnt exist");
            return false;
        } else {
            return user_indb
        }
    },
    auto_login: async function(data){
        let logged;
        logged = await USER.find({username: data.username});
        if(logged.length > 0){
            return {log:logged[0], type: "tutor"};
        } else {
            return "autologin_denied"
        }
    },
    change_password: async function(data){
        let found_user = await USER.find({username: data.username});
        //console.log("found: ", found_user);

        if (found_user === null){
            console.log("cant login, user doesnt exist");
            return "user does not exist";
        } else {
            //change password
            hash = found_user[0].password;
            //console.log("matching password");
            let check = await check_password(data.password, hash);
            if(check === "match"){
                await bcrypt.hash(data.new_password, saltRounds, async function(err, hash) {
                    //console.log("hash ", hash);
                    data.password = hash; 
                    await Usuario.findOneAndUpdate({username: data.username}, {password: hash},{useFindAndModify: false});
                    console.log("password changed!");
                });  
                return "password changed";
            } else {
                return "wrong password";
            }
        }   
    },
    find_user_email: async function(email){
        let found = await USER.find({email: email});
        if (found.length === 0){
            console.log("email is available");
            return false;
        } else {
            console.log("email is taken")
            return found;
        }
    }
}

//FUNCTIONS



async function code_find(code){
    console.log("run email find")
    let found = await USER.find({id: code});
    console.log("found: ", found)
    if (found.length === 0){
        console.log("user not found");
        return null;
    } else {
        console.log("username exists")
        return found;
    }
}

async function check_password(password, hash){
    console.log("password: ", password, " -- ", "hash: ", hash);
    const match = await bcrypt.compare(password, hash);
    if (match){
        console.log("password match!")
        return "match";
    } else {
        console.log("password no go");
        return "no match";
    }
}

async function username_check(email){
    let found = await USER.find({email: email});
    if (found.length === 0){
        console.log("username is available");
        return false;
    } else {
        console.log("username is taken")
        return true;
    }
}

async function generateToken() {
    const buffer = await new Promise((resolve, reject) => {
      crypto.randomBytes(3, function(ex, buffer) {
        if (ex) {
          reject("error generating token");
        }

        resolve(buffer);
      });
    });

    return buffer.toString("hex");
  }

module.exports = login_module;
        