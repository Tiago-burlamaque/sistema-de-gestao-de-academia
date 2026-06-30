import express from 'express'
import cors from 'cors'
import { usuarioRouter } from './routes/usuario.route'
import { pacienteRouter } from './routes/paciente.route'
import { evolucaoRouter } from './routes/evoluicao.route'
import { consultaRouter } from './routes/consulta.route'
import { planoAlimentarRouter } from './routes/planoAlimentar.route'

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))


app.use(express.json())

app.use('/user', usuarioRouter)
app.use('/paciente', pacienteRouter)
app.use('/evolucao', evolucaoRouter)
app.use('/consulta', consultaRouter)
app.use('/plano-alimentar', planoAlimentarRouter)

export { app }