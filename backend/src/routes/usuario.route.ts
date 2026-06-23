import { Router } from "express";
import { cadastro, login } from "../controllers/usuario.controller";

export const usuarioRouter = Router()

usuarioRouter.post('/cadastro', cadastro)
usuarioRouter.post('/login', login)