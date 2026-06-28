import { Router } from "express";
import { authToken } from "../middleware/middleware";
import { listarEvolucaoPorId, listarTodaEvolucao, registrarEvolucao } from "../controllers/evolucao.controller";

export const evolucaoRouter = Router()

evolucaoRouter.get('/listar', authToken, listarTodaEvolucao)
evolucaoRouter.get('/listar/:id', authToken, listarEvolucaoPorId)
evolucaoRouter.get('/registrar', authToken, registrarEvolucao)