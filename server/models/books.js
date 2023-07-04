const mongoose = require('mongoose')


const newBookTemplate = new mongoose.Schema ({ 
        title:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true
        },
        id:{
            type:mongoose.Types.ObjectId,
            required:false
        }
        ,
        imageUrl: {
            type: String,
            required:true
        }
        ,
        public_id: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
})

module.exports = mongoose.model('booktable', newBookTemplate ) 