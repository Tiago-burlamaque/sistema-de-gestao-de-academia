import { Router } from "express";
import { agendarConsulta, listarConsultasPorPaciente, alterarStatusConsulta } from "../controllers/consulta.controller";
import { authToken } from "../middleware/middleware";

export const consultaRouter = Router()
consultaRouter.post('/agendar', authToken, agendarConsulta)
consultaRouter.get('/paciente/:pacienteId', authToken, listarConsultasPorPaciente)
consultaRouter.patch('/status/:id', authToken, alterarStatusConsulta)