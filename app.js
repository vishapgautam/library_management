const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const morgan=require('morgan')


//Middlewere for development process
app.use(morgan('dev'))

//Middleware that include body-parser, to process params and url
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())


//user defiend routes
const booksRouter=require('./routers/booksRoute')
const studentRouter=require('./routers/studentRoute')

//routing middleware
app.use('/books',booksRouter)
app.use('/students',studentRouter)



module.exports=app
