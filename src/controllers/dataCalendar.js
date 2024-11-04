import dayjs from "dayjs";
import Citas from "../models/citas.js";
import User from "../models/user.js";
import { createEvent } from "./google.js";
import { getMessagesDate } from "../services/hours.js";
const { CALENDAR_ID } = process.env


export async function enableDays(req,res){
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

export async function createNewEvent(req,res) {
    const { location, hour, date, email, name, price, paquete } = req.body
    
    if(!location || !hour.length > 0 || !date || !email || !name || !price || !paquete){
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar."
        })
    }
    
    let finalLocation = location == "Sam Benedetto" ? "sambenedetto": "pescara"
    let userId
    try {
        const findCita = await Citas.findOne({location: finalLocation, date: date})

        if(!findCita){
            return res.status(400).json({status: "error", message: "No hay citas para este día."})
        }

        const disponibilidadHour = findCita.disponibilidad.find(d => d.hour === hour);

        if(!disponibilidadHour){
            return res.status(400).json({status: "error", message: "El día no está disponible."})
        }
        
        if(disponibilidadHour.user){
            return res.status(409).json({status: "error", message: "El día ya está asignado intenta con otro."})
        }

        const findUser = await User.findOne({email: String(email)})

        if(!findUser){
            const userToSave = new User({
                name: String(name),
                email: String(email),
            })
            const userSaved = await userToSave.save()
            
            userId = userSaved._id
            
            if(!userSaved){
                return res.status(400).json({
                    status: "error",
                    message: "Contacta con nosotros"
                })
            }
        }else{
            userId = findUser._id
        }
        const {dateFinal, dateInit} = getMessagesDate(hour,date)
        disponibilidadHour.user = userId
        disponibilidadHour.totalPrice = price
        disponibilidadHour.pricePaid = price
        disponibilidadHour.typeService = paquete
        disponibilidadHour.state = "listo"

        await findCita.save(); 
        const eventGoogle = await createEvent(date,hour,location,name, dateInit, dateFinal)

        return res.status(200).json({
            status: "success",
            message: "Cita creada exitosamente",
        })


    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Ocurrió un error."
        })
    }
}


