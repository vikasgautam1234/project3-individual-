const express = require('express');
const router =  express.Router();
const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const authware = require('../middleware/authware')



router.get('/test' , function(req,res){
    res.send("running properly")
})


router.post('/register', userController.createUser)
router.post('/login', userController.loginUser)
router.post('/books',authware.authentication,bookController.createBook )


module.exports = router