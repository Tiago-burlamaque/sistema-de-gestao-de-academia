import { Router } from "express";
import { authToken } from "../middleware/middleware";
import { agendarConsulta, atualizarStatus, listarConsultas } from "../controllers/consulta.controller";

export const consultaRouter = Router()

consultaRouter.post('/agendarConsulta', authToken, agendarConsulta)
consultaRouter.get('/listarConsultas', authToken, listarConsultas)
consultaRouter.patch('/atualizarStatus/:id', authToken, atualizarStatus)
