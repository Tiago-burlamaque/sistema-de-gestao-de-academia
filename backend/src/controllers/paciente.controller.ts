// Importa bibliotecas
import {
    Request,
    Response
} from 'express'
import { ObjetivoPaciente, StatusPaciente } from '../../generated/prisma/enums'
import { prisma } from '../../lib/prisma'

// Tipa o paciente
interface Paciente {
    id: number
    nome: string
    telefone: string
    email: string
    dataNascimento: string
    pesoAtual: number
    altura: number
    objetivo: ObjetivoPaciente
    observacao: string
    status: StatusPaciente
}

// Cadastra o paciente
export const cadastrarPaciente = async (
    req: Request,
    res: Response
) => {
    try {
        const { nome, telefone, email, dataNascimento, pesoAtual, altura, objetivo, observacao, status } = req.body as Paciente

        if (!nome || !telefone || !email || !dataNascimento || !pesoAtual || !altura || !objetivo || !status) return res.status(400).json({
            message: "apenas o campo observação é opcional."
        })

        const paciente = await prisma.paciente.findUnique({
            where: {
                email
            }
        })

        if (paciente) return res.status(409).json({
            message: "Paciente já cadastrado."
        })

        const pacienteCriado = await prisma.paciente.create({
            data: {
                nome,
                email,
                telefone,
                dataNascimento,
                pesoAtual,
                altura,
                objetivo,
                observacao,
                status: "ATIVO"
            }
        })

        return res.status(201).json({
            message: "Paciente criado com sucesso.", pacienteCriado
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Erro interno no servidor.", error
        })
    }
}

// Consulta todoso os pacientes
export const consultarTodosPacientes = async (
    req: Request,
    res: Response
) => {
    try {
        const pacientes = await prisma.paciente.findMany()

        if (!pacientes) return res.status(404).json({
            message: "Nenhum paciente encontrado."
        })

        return res.status(200).json({
            pacientes
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Erro interno no servidor.", error
        })
    }
}

// Consulta apenas 1 paciente pelo id como parametro
export const constultarPorId = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.user.id)

        const pacienteId = await prisma.paciente.findUnique({
            where: {
                id
            }
        })

        if (!pacienteId) return res.status(404).json({
            message: "paciente não encotrado."
        })

        return res.status(200).json({
            pacienteId
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Erro interno no servidor.", error
        })
    }
}

// Edita o paciente pelo id do parametro
export const editarPaciente = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id)
        const { nome, telefone, email, dataNascimento, pesoAtual, altura, objetivo, observacao } = req.body as Paciente

        const edit = await prisma.paciente.update({
            where: {
                id
            },
            data: {
                nome,
                email,
                telefone,
                dataNascimento,
                pesoAtual,
                altura,
                objetivo,
                observacao,
            }
        })

        return res.status(200).json({
            message: "Dados do paciente atualizado.", edit
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Erro interno no servidor.", error
        })
    }
}

// Inativa o paciente pelo id do parametro
export const inativarPaciente = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id)

        const inativar = await prisma.paciente.update({
            where: {
                id
            },
            data: {
                status: "INATIVO"
            }
        })

        return res.status(200).json({
            message: "Paciente inativo."
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Erro interno no servidor.", error
        })
    }
}