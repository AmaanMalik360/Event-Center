import mongoose from 'mongoose'
// const mongoose = require('mongoose')

import bcrypt from 'bcryptjs'


const userSchema = new mongoose.Schema({
    name:{
      type: String,
      required: true  
    },
    
    contact:{
        type: Number,
        unique: true,
        required: true
    },

    email:{
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },

    password:{
        type: String,
        required: true
    },
    // photo:{
    //     type: File,
        
    // }
},
{
    timestamps: true
})


const User = mongoose.model("User", userSchema)
export default User




// If i want to reference some data from company.js. $lookup operator is used. This is called referencing
// Another method is embedding i.e. to embed that into arrays and objects.
