const app=require('./app')
require('dotenv').config()

//mongodb connection
require('./utils/mongoDB')

//creating server at port process.env.PORT
app.listen(process.env.PORT,()=>{
    console.log("server started listining on port 3000..")
})