const mongoose=require('mongoose')
const { v4: uuidv4 } = require('uuid');

const studentSchema=mongoose.Schema(
    {
      _id:{
          type:String,
          default:()=>uuidv4().replace(/\-/g,"")
      },
      firstName:{
          type:String,
          required:[true,'First name is required']
        },
      lastName:{
          type:String,
          required:[true,'last name is required']
          },
     course:{
         type:String,
         required:[true,'Course is required']
     },
     branch:{
         type:String
     },
     BooksBrought:{
         type:Array
     },
     defaulter:{type:Number}
})

module.exports=mongoose.model("Students",studentSchema)