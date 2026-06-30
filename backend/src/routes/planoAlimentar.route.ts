import { Router } from "express";
import { criarPlanoAlimentar, buscarPlanoPorPaciente } from "../controllers/planoAlimentar.controller";
import { authToken } from "../middleware/middleware";

export const planoAlimentarRouter = Router()
planoAlimentarRouter.post('/criar', authToken, criarPlanoAlimentar)
planoAlimentarRouter.get('/paciente/:pacienteId', authToken, buscarPlanoPorPaciente)