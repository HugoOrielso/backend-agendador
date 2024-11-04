import Admin from '../models/administradores.js'
import dayjs from 'dayjs'
import { compare, hash,  } from 'bcrypt'
import { createRefreshToken, createToken } from '../services/jwt.js'
import Citas from '../models/citas.js'

export async function createNewDay(req,res){
    const {fecha, hours, location} = req.body
    try {
        if(!fecha || !hours.length < 0 || !location){
            return res.status(400).json({
                status: "error",
                message: "Faltan datos por enviar."
            })
        }
        const existingDate = await Citas.findOne({date: fecha})
    
        if(existingDate){
            return res.status(409).json({
                status: "error",
                message: "La fecha está generada"
            })
        }
    
        const newDateToSave = new Citas({
            date: fecha,
            location: location,
            disponibilidad: hours,
            state: 'enabled',
        })
    
        const dateSaved = await newDateToSave.save()
        
        if(!dateSaved){
            return res.status(400).json({
                status: "error",
                message: "Ocurrió un error."
            })
        }
        return res.status(201).json({
            status: "success",
            message: "Turno creado exitosamente."
        })
    } catch (error) {
        
        return res.status(500).json({
            status: "error",
            message: "Ocurrió un error."
        })
    }
}

export async function allDaysData(req,res) {
    if(req.user.rol != 'administrador'){
        return res.status(401).json({
            status: "error",
            message: "No estás autorizado a realizar esta petición."
        })
    }

    try {
        const today = dayjs().format("YYYY-MM-DD")
        const threeMonthsFromNow = dayjs().add(3, 'month').format('YYYY-MM-DD')
        const getDays = await Citas.find({
            date: {
              $gte: today,
              $lte: threeMonthsFromNow
            }
        });
        
        if(!getDays.length < 0){
            return res.status(204).json({
                status: "no content",
                message: "No hay ningún día habilitado"
            })
        }

        if(getDays.length > 0){
            return res.status(200).json({
                status: "success",
                message: "Días disponibles",
                days: getDays
            })
        }
         
    } catch (error) {
        
        return res.status(500).json({
            status: "error",
            message: "Ocurrió un error"
        })
    }
}

export async function getDayByDate(req,res) {
    const {date} = req.params
    try {
        if(!date){
            return res.status(400).json({
                status: "error",
                message: "Faltan datos por enviar"
            })
        }
        const searchDay = disponibilidad.find(i => i.date == date)
        if(!searchDay){
            return res.status(204).json({
                status: "error",
                message: "La fecha seleccionada no está disponible"
            })
        }
        return res.status(200).json({
            status: "success",
            message: `Detalles del día ${date}`,
            date: searchDay
        }) 
    } catch (error) {
        return res.status(404).json({
            status: "error",
            message: "error interno."
        })
    }
}

export async function changeState(req,res) {
    const {state} = req.body
    
    if(!state){
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar"
        })
    }
    try {
        const searchDay = disponibilidad.find(i => i.date == date)
        if(!searchDay){
            return res.status(204).json({
                status: "error",
                message: "La fecha seleccionada no está disponible"
            })
        }
        return res.status(200).json({
            status: "success",
            message: `Detalles del día ${date}`,
            date: searchDay
        }) 
    } catch (error) {
        return res.status(404).json({
            status: "error",
            message: "error interno."
        })
    }
}

export async function crearAdmin(req,res){
    const { email, password, name } = req.body

    if(!email || !password || !name){
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar"
        })
    }

    try {
        const existingUser = await Admin.findOne({email:String(email)})
        
        if(existingUser){
            return res.status(409).json({
                status: "error",
                message: "El usuario ya exite."
            })
        }

        const hashedPassword = await hash(password,10)

        if(!hashedPassword){
            return res.status(400).json({
                status: 'error',
                message: 'Ocurrión un error, intenta más tarde'
            })
        }
        
        const userToSave = new Admin({
            email: String(email),
            name: String(name),
            password: String(hashedPassword),
            rol: 'administrador'
        })

        const userSaved = await userToSave.save()

        if(!userSaved){
            return res.status(400).json({
                status: "error",
                message: "Ocurrió un error, intenta más tarde"
            })
        }
        return res.status(201).json({
            status: "success",
            message: 'Usuario creado exitosamente'
        })  
    } catch (error) {        
        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        })
    }
}


export async function iniciarSesion(req,res){
    const { email, password } = req.body
    if(!email || !password){
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar"
        })
    }
    try {
        const admin = await Admin.findOne({ email: String(email) });
        
        if(!admin){
            return res.status(401).json({
                status: "error",
                message: "Credenciales incorrectas."
            })
        }

        const matchPassword = await compare( password,admin.password)

        if(!matchPassword){
            return res.status(401).json({
                status: "error",
                message: 'Credenciales incorrectas.'
            })
        }
        const token = createToken(admin)
        const refreshToken = createRefreshToken(admin)
        res.cookie('acces_token', token, {httpOnly:false, secure: process.env.NODE_ENV === 'production', path: 'http://localhost:5173'})

        res.cookie('refresh_token', refreshToken, {httpOnly:false, secure: process.env.NODE_ENV === 'production', path: 'http://localhost:5173'})
        
        return res.status(200).json({
            status: "success",
            message: "Inicio de sesión exitoso.",
            admin: {
                name: admin.name,
                rol: admin.rol
            }
        })

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: 'Error interno'
        })
    }
}

