import jwt from 'jsonwebtoken'
import { refreshSecret, tokenSecret } from '../config.js'
import { config } from 'dotenv'
import { createRefreshToken, createToken } from '../services/jwt.js'
config()

export async function refreshTokenController(req,res,next){
    const {refresh_token, acces_token} = req.cookies
    
    try {
        if(!refresh_token  || !acces_token){
            return res.status(401).json({
                status: "error",
                message: "No estás autorizado para realizar esta petición"
            })
        }


        if(jwt.verify(refresh_token, refreshSecret)){
            const user = jwt.decode(refresh_token,refreshSecret)
            const token = createToken(user)
            const refreshToken = createRefreshToken(user)
            
            res.cookie('acces_token', token, {httpOnly:true, secure: false,path: 'http://localhost:5173'})
            res.cookie('refresh_token', refreshToken, {httpOnly:true, secure: false,path: 'http://localhost:5173'})
            
            res.status(200).json({
              status: 'success',
              message: 'Identificado correctamente',
              admin: {
                nombre: user.name,
                rol: user.rol
              }
            })
            next()
        }
    } catch (error) {
        return res.status(401).json({
            status: "error",
            message: "No se pudo hacer refresh, inicia sesión nuevamente."
        })
    }
}