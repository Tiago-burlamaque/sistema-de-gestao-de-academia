import express from 'express'
import cors from 'cors'
import { Request, Response } from 'express'
import { usuarioRouter } from './routes/usuario.route'

export const app = express()

app.use(cors())
app.use(express.json())

app.get("/teste", (
    req: Request,
    res: Response
) => {
    res.send("Teste")
})

app.use('/user', usuarioRouter)