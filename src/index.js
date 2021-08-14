const express = require('express')
const cors = require("cors");
const app = express()
const path = require('path')
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
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('../client/build'))
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname, '../client/build','index.html'))

    })
}

app.listen(port,()=>{
    console.log('server is up on port  5000')
})