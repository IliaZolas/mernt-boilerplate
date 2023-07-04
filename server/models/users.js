const mongoose = require('mongoose')


const newUserTemplate = new mongoose.Schema ({ 
        name:{
            type:String,
            required:true,
        },
        surname:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:false
        },
        password:{
            type:String,
            required:false
        },
        imageUrl: {
            type: String,
            required:true
        }
        ,
        public_id: {
            type: String,
            required: true
        }
})

module.exports = mongoose.model('usertable', newUserTemplate )