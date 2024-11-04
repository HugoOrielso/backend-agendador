import moment from 'moment'
import { tokenSecret } from '../config.js';
import jwt from 'jsonwebtoken'

export  const auth = async(req, res, next) => {
  const { acces_token, refresh_token } = req.cookies
  
  if (!acces_token || !refresh_token) {
    return res.status(403).json({
      status: 'error',
      message: 'No estás autorizado a realizar esta petición'
    })
  }
  try {
    const payload = jwt.decode(acces_token, tokenSecret)
    if (payload.exp <= moment().unix()) {
      throw new Error('Token vencido')
    }
    req.user = payload
    
  } catch (error) {
    return res.status(403).json({
      status: 'error',
      message: 'Token inválido'
    })
  }
  next()
}
