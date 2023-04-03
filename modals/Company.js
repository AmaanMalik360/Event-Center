import mongoose from 'mongoose'
// const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
    name:{
      type: String,
      required: true  
    },

    
    email:{
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    
    contact:{
        type: Number,
        unique: true,
        required: true
    },
    
    password:{
        type: String,
        required: true
    },
    services:[],

    // rating:{
    //     type: Number,  
    // },
    // photo:{
    //     type: File,
        
    // }

},
{
    timestamps: true
})


const Company = mongoose.model("Company", companySchema)
export default Company




