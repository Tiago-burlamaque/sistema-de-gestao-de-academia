import { Router } from 'express'

// CORREÇÃO: Adicionando a extensão .js obrigatória para o interpretador Node resolver as rotas locais
import { cadastro, login } from './controllers/user.controller.js'
import { 
    cadastrarPaciente, 
    consultarTodosPacientes, 
    constultarPorId, 
    editarPaciente, 
    inativarPaciente 
} from './controllers/paciente.controller.js'

const routes = Router()

// Endpoints de Autenticação e Usuário
routes.post('/user/cadastro', cadastro)
routes.post('/user/login', login)

// Endpoints de Gerenciamento de Pacientes
routes.post('/pacientes', cadastrarPaciente)
routes.get('/pacientes', consultarTodosPacientes)
routes.get('/pacientes/:id', constultarPorId)
routes.put('/pacientes/:id', editarPaciente)
routes.patch('/pacientes/:id/inativar', inativarPaciente)

export default routes