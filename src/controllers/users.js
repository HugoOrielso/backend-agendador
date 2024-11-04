import User from "../models/user.js"
import Cita from "../models/citas.js";


export async function getUser(req, res) {
    const { email } = req.params;
    
    if (!email) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar"
        });
    }

    try {
        const existingUser = await User.findOne({ email: email });
        
        if (!existingUser) {
            return res.status(204).json({
                status: "no content",
                message: 'El usuario no existe'
            });
        }
        
        const activeCita = await Cita.findOne({ user: existingUser._id, active: true });

        if (!activeCita) {
            return res.status(200).json({
                status: "success",
                message: 'Usuario encontrado, pero no tiene citas activas'
            });
        }
        return res.status(200).json({
            status: "success",
            message: "Usuario y cita activa encontrados",
            cita: activeCita 
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error en el servidor"
        });
    }
}


export async function saveUser(req,res) {
    const { email, name } = req.body
    if(!email || !name){
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar"
        })
    }
    try {
        const existingUser = await User.findOne({email: email})
        if(existingUser){
            return res.status(200).json({
                status: "success",
                message: 'El usuario existe'
            })
        }
        if(!existingUser){
            const newUser = new User({
                email: email,
                name: name
            })
            const saveUser = await newUser.save()
            if(!saveUser){
                return res.satus(400).json({
                    status: 'error',
                    message: 'Ocurrió un error al guardar el usuario'
                })
            }
            return res.status(201).json({
                status: 'success',
                message: 'Usuario guardado exitosamente'
            })
        }
    } catch (error) {
        console.log(error);
    }
}