const userModel = require('../models/userModel')
const validation = require('../validations/validator')
const jwt = require("jsonwebtoken")

let {isValidName, isValidEmail, isValidPassWord, isValidPhoneNumber, isValidPincode,isEmpty} =validation
const createUser = async function(req,res){
    try{
        let data = req.body
        let{title, name, email, password, phone, address} = data
        if(Object.keys(data).length == 0){
            return res.status(400).send({status : false , message : "body can not be empty"})
        }
        if(!title || !name || !email || !password || !phone){
            return res.status(400).send({status : false , message : "all fields are mandatory"})
        }
  //-----------------------------CHECKING VALID TITLE OR NOT-----------------------------------------------------      
        if(title != "Mr"& title != "Mrs"& title != "Miss"){
            return res.status(400).send({status : false , message : "title must be from Mr/Mrs/Miss"})
        }
        if(!isEmpty(title)){
            return res.status(400).send({status : false , message : " title is required"})
        }
        if(!isEmpty(name)){
           return res.status(400).send({status : false , message : "name is required"})
        }
        if(!isEmpty(email)){
            return res.status(400).send({status : false , message : "email is required"})
        }
        //-------------------------------CHECKING THE DUPLICACY OF EMAIL-------------------------------------------
        let uniqueEmail = await userModel.findOne({email : email})
        if(uniqueEmail){
            return res.status(400).send({status : false , message : "this email already exists"})
        }
        if(!isEmpty(password)){
            return res.status(400).send({status : false , message : "password is required"})
        }
        if(!isEmpty(phone)){
            return res.status(400).send({status : false , message : "phone number is required"})
        }
        //-----------------------------------CHECKING PHONE DUPLICACY-------------------------------------
        const uniquePhone = await userModel.findOne({phone : phone})
        if(uniquePhone){
            return res.status(400).send({status : false , message : "this phone no. alredy exists"})
        }
        if(!isValidName(name)){
            return res.status(400).send({status : false , message : "invalid name"})
        }
        if(!isValidEmail(email)){
            return res.status(400).send({status : false, message : "invalid emailId"})
        }
        if(!isValidPassWord(password)){
            return res.status(400).send({status : false, message : "Your password must have 8 to 15 characters, contain at least one number or symbol, and have a mixture of uppercase and lowercase letters"})
        }
        if(!isValidPhoneNumber(phone)){
            return res.status(400).send({status : false , message : "invalid phone number"})
        }

        let user = await userModel.create(data)
        return res.status(201).send({status : false , message : "user created successfully" , data : user})

    }
    catch(error){
        return res.status(500).send({status : false , message: error.message})

    }
}

const loginUser = async function(req,res){
try{
let data = req.body
let{email,password} = data
if(Object.keys(data).length ==0){
    return res.status(400).send({status : false , message : "body can not be empty"})
}
if(!email || ! password){
    return res.status(400).send({status : false , message : "email and password is mandatory"})
}
if(!isValidEmail(email)){
    return res.status(400).send({status : false, message : "invalid emailId"})
}
if(!isValidPassWord(password)){
    return res.status(400).send({status : false , message : "Your password must have 8 to 15 characters, contain at least one number or symbol, and have a mixture of uppercase and lowercase letters"})
}
let findUser = await userModel.findOne({email : email, password : password})
if(!findUser){
    return res.status(400).send({status : false , message : "email or password is not correct"})
}
let token = jwt.sign(
    {
      userId : findUser._id.toString(),
      expiresIn : "2m"
    },
   "top-secret-token"
);
res.setHeader("x-api-key", token);
return res.status(201).send({status : true, message : "successfully logged in", token : token})
}
catch(error){
       return res.status(500).send({status : false, message: error.message}) 
}
}


module.exports.createUser = createUser
module.exports.loginUser = loginUser