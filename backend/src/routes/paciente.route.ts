import { Router } from "express";
import { cadastrarPaciente, consultarPorId, consultarTodosPacientes, editarPaciente, inativarPaciente } from "../controllers/paciente.controller";
import { authToken } from "../middleware/middleware";

export const pacienteRouter = Router()

pacienteRouter.post('/cadastro', authToken, cadastrarPaciente)
pacienteRouter.get('/listar', authToken, consultarTodosPacientes)
pacienteRouter.get('/listar/:id', authToken, consultarPorId)
pacienteRouter.put('/atualizar/:id', authToken, editarPaciente)
pacienteRouter.patch('/inativar/:id', authToken, inativarPaciente)