const express=require('express')
const router=express.Router()

//Student controller
const studentController=require('../controllers/studentController')

router
      .get('/getall',studentController.getall)
      .get('/getone/:id',studentController.getone)
      .post('/add',studentController.add)
      .patch('/update/:id',studentController.update)
      .delete('/delete/:id',studentController.delete)


module.exports=router