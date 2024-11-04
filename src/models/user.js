import mongoose, { model } from "mongoose";


const schemaCita = new mongoose.Schema({
    name: String,
    email: String
})

export default  model('User',schemaCita,'users')

