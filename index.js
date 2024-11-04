import express from 'express'
import routerGoogle  from './src/router/google.routes.js'
import routerPaypal from './src/router/paypal.routes.js' 
import routerUsers from './src/router/users.routes.js'
import routerCalendar from './src/router/calendar.routes.js'
import routerAdministracion from './src/router/administracion.routes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { config } from 'dotenv'
import { connectionDBMongoose } from './src/database/connection.js'

const PORT = process.env.PORT ?? 8080
const app = express()

config()
connectionDBMongoose()

app.use(cookieParser())
app.use("/", express.static("dist", {redirect: false} ))
app.use(cors({origin:'http://localhost:5173',credentials:true}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))

app.use('/api/google', routerGoogle)
app.use('/api/calendar', routerCalendar)
app.use('/api/paypal', routerPaypal)
app.use('/api/users', routerUsers)
app.use('/api/administracion', routerAdministracion)


app.get("*", (req,res,next) =>{
    res.sendFile(process.cwd() + '/dist/index.html')
})
app.listen(PORT,()=>{
    console.log(`Server on port ${PORT}`);
})


