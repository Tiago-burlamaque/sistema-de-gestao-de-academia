import express from 'express'
import cors from 'cors'
import { usuarioRouter } from './routes/usuario.route'
import { pacienteRouter } from './routes/paciente.route'
import { evolucaoRouter } from './routes/evoluicao.route'
import { planoRouter } from './routes/planoAlmeentar.route'
import { consultaRouter } from './routes/consulta.route'

export const app = express()

app.use(cors())
app.use(express.json())

app.use('/user', usuarioRouter)
app.use('/paciente', pacienteRouter)
app.use('/evolucao', evolucaoRouter)
app.use('/planoAlimentar', planoRouter)
app.use('/consulta', consultaRouter)