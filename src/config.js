import { config } from "dotenv"
config()

export const CLIENT_ID_PAYPAL = process.env.CLIENT_ID_PAYPAL
export const SECRET_KEY_PAYPAL = process.env.SECRET_KEY_PAYPAL
export const refreshSecret = process.env.REFRESH_PASSWORD 
export const tokenSecret = process.env.SECRET_PASSWORD
