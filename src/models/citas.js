import mongoose, { model } from "mongoose";

const disponibilidadSchema = new mongoose.Schema({
    hour: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        default: null 
    },
    totalPrice:{ type: String, required: false, default: null },
    pricePaid:{ type: String, required: false, default: null },
    typeService:{ type: String, required: false , default: null},
    state: { type: String, required: false , default: null}, 
});

const dateSchema = new mongoose.Schema({
    date: { type: String, required: true }, 
    disponibilidad: { type: [disponibilidadSchema], required: true }, 
    location: { type: String, required: true },
    state: { type: String, required: true }, 
});

export default model('Cita', dateSchema, 'citas');  
        