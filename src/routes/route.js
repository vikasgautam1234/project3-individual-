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


router.post('/books',authware.authentication,authware.authorization,bookController.createBook ) 
router.get('/books',authware.authentication, bookController.getBooksFromQuery)
router.get('/books/:bookId',authware.authentication, bookController.getBookById )
router.put('/books/:bookId',authware.authentication, authware.authoriseForUpdate, bookController.updateBook )
router.delete('/books/:bookId',authware.authentication, authware.authoriseForUpdate, bookController.deleteBook )

module.exports = router