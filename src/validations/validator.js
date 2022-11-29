

//------------------------NAME VALIDATION------------------------------------------------------------
 const isValidName = function(name){
    let nameRegex = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
    return nameRegex.test(name)
 }
 //----------------------------PHONE NUMBER VALIDATION--------------------------------------------------
 const isValidPhoneNumber = function(phone){
    let phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone)
 }
 //---------------------------EMAIL VALIDATION---------------------------------------------------------
 const isValidEmail = function(email){
    let emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    return emailRegex.test(email)
 }
 //---------------------------PASSWORD VALIDATION-------------------------------------------------------
 const isValidPassWord = function(password){
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,15}$/;
    return passwordRegex.test(password)}
    //----------------------------------PINCODE VALIDATION-----------------------------------------------
 
    const isValidPincode = function(pincode){
        let pincodeRegex =  /^[1-9][0-9]{5}$/;
        return pincodeRegex.test(pincode)
    }
//-----------------------------VALUE VALIDATION------------------------------------------------------
 const isEmpty = function(value){
    if(typeof value === "string" && value.trim().length === 0) return false;
     return true 
 }


 module.exports = {isValidName, isValidEmail, isValidPassWord, isValidPhoneNumber, isValidPincode,isEmpty}