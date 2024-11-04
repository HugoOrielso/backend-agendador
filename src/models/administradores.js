import mongoose, { model } from "mongoose";

const schemaAdministrador = new mongoose.Schema({
    name: {type: String, required:true},
    email: {type: String, required:true},
    password: {type: String, required:true},
    rol: {type: String, required:true}
})

export default  model('Admin',schemaAdministrador,'administradores')

