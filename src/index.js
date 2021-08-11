const express = require('express')
const cors = require("cors");
const app = express()
require('dotenv').config()
require('./db/mongoose')

const userRouter  =  require('./routers/user')
const blogRouter = require('./routers/blog')
const addTofav = require('./routers/addtofav')




const port = process.env.PORT || 5000
app.use(cors());
app.use(express.json())
app.use(userRouter)
app.use(blogRouter)
app.use(addTofav)


app.listen(port,()=>{
    console.log('server is up on port  5000')
})