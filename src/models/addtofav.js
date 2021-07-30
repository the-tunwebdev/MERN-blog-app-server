const mongoose = require('mongoose')
const favSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true 
    },
    imageURL : {
        type : String,
        trim : true 
    },
    description : {
        type : String , 
        trim : true,
        required : true,

    },
    owner :{
        type : mongoose.Schema.Types.ObjectId,
        required :  true,
        ref : 'User'

    }
},{
    timestamps : true
})

const Fav = mongoose.model('Fav',favSchema)
module.exports = Fav
