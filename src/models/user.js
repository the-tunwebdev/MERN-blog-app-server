const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt =  require('jsonwebtoken')
const express = require('express')
var Cookies = require('cookies')
// const Task =  require('./tasks')
const userSchema =  new mongoose.Schema({
    name : {
        type : String,
        trim : true , // remove spacesuserSchema
        required : true
    },
    email :{
        type : String,
        required : true,
        trim : true , // remove spaces
        lowercase : true , 
        unique :  true ,
        
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ('email is invalid')

            }
        }

    },
    password : {
        type:String, 
        required : true,
        minlength : 7,
        trim : true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error ('password can not be  password ')
            }
        }
    },
    verified : {
        type : Boolean,
        default : false
    },
    
    login_err : [{
        type : mongoose.Schema.Types.ObjectId,
        
    }],

    tokens : [{
        token :{
            type : String , 
            required : true
        }
    }]
},{
    timestamps : true,
})
userSchema.virtual('tasks',{
    ref : 'Task',
    localField : '_id',
    foreignField : 'owner'
}) 
userSchema.virtual('favs',{
    ref : 'Fav',
    localField : '_id',
    foreignField : 'owner'
}) 

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisisamessage')
    user.tokens  = user.tokens.concat({token : token})
    await user.save()
    

    return token
}
//get public info for user
userSchema.methods.toJSON =  function(){
    const user  =  this
    const userObject = user.toObject()
    
    delete userObject.tokens
    return userObject
}
// add your own funciton
userSchema.statics.findByCredentials =  async (email,password)=>{
    const user  =  await User.findOne({email : email})
    if(!user){
        throw new Error ('unable to login email doesnt exist')
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error ('unable to login')

    }
    return  user
}
userSchema.statics.findByEmail =  async (email,name)=>{
    
    

    
}
//hash the updated password
userSchema.pre('save',async function (next) {
    
    const user  =  this 
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password , 10)
    }
    next()

})
// delete blog when user delete his account
userSchema.pre('remove',async function (next) {
    const user  =  this 
    Task.deleteMany({owner :  user._id })
    
    next()
})

const User = mongoose.model('User',userSchema)
module.exports = User;