const mongoose = require('mongoose')
const taskSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true 
    },
    imageURL : {
        type : String,
        trim : true ,
        
    },
    description : {
        type : String , 
        trim : true,
        required : true,

    },
    likes:[{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }],
    comments:[{
        text :  String , 
        postedBy:{type:String,ref: 'User'}

    }],
    owner :{
        type : mongoose.Schema.Types.ObjectId,
        required :  true,
        ref : 'User'

    }
},{
    timestamps : true
})

const Task = mongoose.model('Task',taskSchema)
module.exports = Task
