const express=require('express')
const router=express.Router()

//books controller
const booksController=require('../controllers/booksController')

router
      .get('/getall',booksController.getbooks)
      .get('/getone/:id',booksController.getbook)
      .post('/add',booksController.addbook)
      .patch('/update/:id',booksController.updatebook)
      .delete('/delete/:id',booksController.deletebook)
      .post('/rent/:id',booksController.rentbook)
      .post('/return',booksController.returnBook)
      .get('/topselling',booksController.topsellingbooks)
      .get('/notreturned',booksController.notreturnedbooks)
      .post('/howold',booksController.booksolderthan)





module.exports=router