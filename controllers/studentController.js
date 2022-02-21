const Student=require('../models/students')

//This controller is used to get all the students
module.exports.getall=async(req,res)=>{
    let page=req.query.page
    if (!page || page==0) page = 1
    const students=await Student.find().select("-__v").skip((page-1)*20).limit(20)
    res.status(200).json({success:"true",students:students})
}

//This controller is used to get one student at a time using its id
module.exports.getone=async(req,res)=>{
    const id=req.params.id
    const student=await Student.find({_id:id})
    if (!student) res.status(400).json({success:"false",description:"not found"})
    else{
       res.status(200).json({success:"true",student:student})
}}

//This will add new student to the database
module.exports.add=async(req,res)=>{
    const firstName=req.body.firstName
    const lastName=req.body.lastName
    const course=req.body.course
    const branch=req.body.branch
    if(!firstName|| !lastName || !course || !branch) res.status(400).json({success:"false",description:"all field are required"})
    else{
        const student=await Student({
            firstName:firstName,
            lastName:lastName,
            course:course,
            branch:branch
        })
        student.save(function(error,result){
        if (error) res.status(400).json({success:"false",error:error})
        else{
            res.status(200).json({success:true,student:student})
        }
        })
    }
}

//This controller is to update the existing user 
module.exports.update=async(req,res)=>{
    const id=req.params.id
    Student.findByIdAndUpdate(id,req.body,function(error,result){
        if (error) res.status(400).json({success:"False",error:error})
        else{
            res.status(200).json({success:"true",decription:"updated"})
        }
    })
}

//This controller is to delete the existing user
module.exports.delete=async(req,res)=>{
    const id=req.params.id
    Student.findByIdAndDelete(id,function(error,result){
        if (error) res.status(400).json({success:"false",error:error})
        else{
            res.status(200).json({success:"true",description:"Student deleted from database"})
        }
    })
}