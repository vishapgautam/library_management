const match = require('nodemon/lib/monitor/match')

//requiring schemas of books and students
const Book=require('../models/books')
const Student = require('../models/students')


//This controller will send all the books limited by 10 books per page
module.exports.getbooks=async(req,res)=>{
    let page=req.query
    if (!page || page==0) page=1
    const books=await Book.find().select("-__v -PrevBrought").sort("bookName").skip((page-1)*20).limit(20)
    res.status(200).json({success:"true",number:books.length,result:books})
   
}

//This controller will be used to send one book at a time using its id
module.exports.getbook=async(req,res)=>{
    const id=req.params.id
    const book=await Book.find({_id:id}).select("-__v -_id")
    if (!book[0]) res.status(400).json({success:"false",description:"book not found"})
    res.status(200).json({success:"true",result:book})   
}

//This controller will be used to add new books
module.exports.addbook=async(req,res)=>{
    const book=new Book({
        bookName:req.body.bookName,
        course:req.body.course,
        subject:req.body.subject,
        PrevBrought:[{
            Id:req.body.PrevBrought.Id,
            fromDate:req.body.PrevBrought.fromDate,
            toDate:req.body.PrevBrought.toDate
        }]
    })
    book.save(function(err,result){
        if (err) {
            res.status(400).json({success:"false",error:"Some error occured while adding"})
        }
        else{
            res.status(200).json({success:"true",result:result})
        }
    })
}

//This controller is used to update the existing book
module.exports.updatebook=async(req,res)=>{
    const id=req.params.id
    Book.findByIdAndUpdate(id,req.body,function(error,result){
        if (error) res.status(400).json({success:"false",error:"Some error occured while updating"})
        else{
            res.status(200).json({success:"true",description:"successfully updated"})
        }
    })
}

//This controller is used to delete the existing book using its id
module.exports.deletebook=async(req,res)=>{
    const id=req.params.id
    Book.findByIdAndDelete(id,function(error,result){
        if (error) res.status(400).json({success:"false",error:"Some error occures while deleting"})
        else{
            res.status(200).json({success:"true",description:"successfully deleted"})
        }
    })
}

//This controller is used to rent a book 
module.exports.rentbook=async(req,res)=>{
    const book_id=req.params.id
    const firstName=req.body.firstName
    const lastName=req.body.lastName
    const student=await Student.where({firstName:firstName}).where({lastName:lastName})
    if (!student[0]) res.status(400).json({success:"false",description:"Student not found"})
    else{
        const book =await Book.findOne({_id:book_id})
        if (!book) res.status(400).json({success:"false",description:"book not found"})
        book.PrevBrought.push({Id:student[0]._id,fromDate:Date.now(),toDate:null})
        Book.findByIdAndUpdate(book._id,{PrevBrought:book.PrevBrought},async function(error,result){
            if (error) res.status(400).json({success:"false",error:"An error occured while updating"})
            else{
                const student=await Student.where({firstName:req.body.firstName}).where({lastName:req.body.lastName})
                const last_element=book.PrevBrought.length-1
                student[0].BooksBrought.push(book.PrevBrought[last_element]._id)
                Student.findByIdAndUpdate(student[0]._id,{BooksBrought:student[0].BooksBrought},function(er,re){
                    res.status(200).json({success:"true",description:"Now you can take this book",result:book.PrevBrought[last_element],url:`/students/getone/${book.PrevBrought[last_element]._id}`})
                })
                
            }
        })
}}

//This controller is used to return the book 
module.exports.returnBook=async(req,res)=>{
    const id=req.body.id
    let book=await Book.findOne({_id:id})
    if (!book) res.status(400).json({success:"false",description:"book not found"})
    const bookslast_transtion=book.PrevBrought[book.PrevBrought.length-1]
    if (bookslast_transtion.toDate) return res.status(400).json({success:"false",description:"This book is already returned"})
    const return_date=new Date(bookslast_transtion.fromDate)
    const date_now=Date.now()
    const days=parseInt((return_date-date_now)/(1000*60*60*24))
    let message="Book returned within time"
    if (days>=10)  message="You are returning this book late"
    book.PrevBrought[book.PrevBrought.length-1].toDate=Date.now()
    Book.findByIdAndUpdate(book._id,{PrevBrought:book.PrevBrought},function(error,result){
        if(error) res.status(400).json({success:"false",error:error})
        res.status(200).json({success:"true",message:message})
    })

}

//This controller will sent the top 10 most selling books from all the books
module.exports.topsellingbooks=async(req,res)=>{
    const book= await Book.aggregate([
        
        //This project is used to select the fields to pass in any new field is passed in project then it will add that field to the result
        //Then $size is used to get the size of array PrevBrought 
        {
            $project: { Number_of_times_taken: { $size:"$PrevBrought" },bookName:1,course:1,subject:1}
        },

        //This $match is used to compare or select that document which satisfy our condition given
        {
            $match:{Number_of_times_taken:{$gte:2}}
        },

        //This is used to sort the result according to the number of times book taken in decending order
        {
            $sort:{Number_of_times_taken:-1}
        },

        //This field is used to limit the result
        {
            $limit:10
        }
    ])

    res.status(200).json({success:"true",result:book})
}

//This controller is used to get the books that are not returned yet
module.exports.notreturnedbooks=async(req,res)=>{
    let page=req.query.page
    if (!page|| page==0) page=1
    const book=await Book.aggregate(
        [
            {
               $project:{bookName:1,branch:1,last_transaction:{$last:'$PrevBrought'}}

            },

            //This syntax is important "lastElement.toDate" used to find field in embedded documents
            //Here null is passed not "null" because its null not a string
            //This will return documents which has only null toDate property
            {
                $match:{"last_transaction.toDate":null}
            },
             
            //This is used to skip pages
            {
                $skip:(10*(page-1))   
            },
            
            //This is to limit the number of documents
            {
                $limit:10
            },

            //This is used to sort the oldest brought book to newest
            //Here again we are acceding embedded documents it important to remember
            {
                $sort:{"last_transaction.fromDate":1}
            }
             
    ])
    res.status(200).json({success:"true",result:book})
}

//This controller is used to get the number of books which are older than a specified 
module.exports.booksolderthan=async(req,res)=>{
    const datee=(new Date(req.body.date))||Date.now()
    const books=await Book.find().select("-__v -PrevBrought").sort("books.createdAt")
    let len=books.length
    let i=0
    while (i<len){
        if (((datee-(new Date(books[i].createdAt)))/(1000*60*60))<0){
            books.splice(i,1)
            len=books.length
        }else{
        i=i+1
        }
    }
    res.status(200).json({success:"true",numberofBooks:len,books:books})
    
}