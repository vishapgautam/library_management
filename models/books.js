const mongoose=require('mongoose')
const { v4: uuidv4 } = require('uuid');

const PrevBroughtSchema=mongoose.Schema({
    Id:{
        type:String,
        required:true
    },
    fromDate:{
        type:Date
    },
    toDate:{
        type:Date
    }
})


const bookSchema=mongoose.Schema(
    {
      _id:{
          type:String,
          default:()=>uuidv4().replace(/\-/g,"")
      },
      bookName:{
          type:String,
          required:[true,'Book name is required'],
          Unique:[true,'already exist']
        },
     course:{
         type:String,
         required:[true,'Course is required']
     },
     subject:{
         type:String,
         required:[true,'Subject is required']
     },
     createdAt:{
         type:Date,
         default: new Date()
     },
     PrevBrought:[PrevBroughtSchema]
})




module.exports=mongoose.model("Book",bookSchema)