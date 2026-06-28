import { Router } from "express";
import { authToken } from "../middleware/middleware";
import { adicionarRefeicao, categorizarTipoRefeicao, criarPlanoAlimentar, listarPlanos } from "../controllers/planoAlimentar.controller";

export const planoRouter = Router()

planoRouter.post('/criarPlano', authToken, criarPlanoAlimentar)
planoRouter.get('/listarPlanos', authToken, listarPlanos)
planoRouter.post('/adicionarRefeicao', authToken, adicionarRefeicao)
planoRouter.get('/categorizar', authToken, categorizarTipoRefeicao)