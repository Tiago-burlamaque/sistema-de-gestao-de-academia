import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type ObjetivoPaciente = 'EMAGRECIMENTO' | 'HIPERTROFIA' | 'SAUDE'
type StatusPaciente = 'ATIVO' | 'INATIVO'

interface PacienteInput {
    nome: string
    telefone: string
    email: string
    dataNascimento: string
    pesoAtual: number
    altura: number
    objetivo: ObjetivoPaciente
    observacao?: string
}

export const cadastrarPaciente = async (req: Request, res: Response) => {
    try {
        const { nome, telefone, email, dataNascimento, pesoAtual, altura, objetivo, observacao } = req.body as PacienteInput

        if (!nome || !telefone || !email || !dataNascimento || !pesoAtual || !altura || !objetivo) {
            return res.status(400).json({})
        }

        const pacienteExistente = await prisma.paciente.findUnique({
            where: { email }
        })

        if (pacienteExistente) return res.status(409).json({})

        const pacienteCriado = await prisma.paciente.create({
            data: {
                nome,
                email,
                telefone,
                dataNascimento,
                pesoAtual: Number(pesoAtual),
                altura: Number(altura),
                objetivo: objetivo as any,
                observacao: observacao || "",
                status: 'ATIVO' as any
            }
        })

        return res.status(201).json({ paciente: pacienteCriado })
    } catch (error) {
        console.error(error)
        return res.status(500).json({})
    }
}

export const consultarTodosPacientes = async (req: Request, res: Response) => {
    try {
        const pacientes = await prisma.paciente.findMany()
        if (pacientes.length === 0) return res.status(404).json({})
        return res.status(200).json({ pacientes })
    } catch (error) {
        console.error(error)
        return res.status(500).json({})
    }
}

export const constultarPorId = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        if (isNaN(id)) return res.status(400).json({})

        const paciente = await prisma.paciente.findUnique({ where: { id } })
        if (!paciente) return res.status(404).json({})

        return res.status(200).json({ paciente })
    } catch (error) {
        console.error(error)
        return res.status(500).json({})
    }
}

export const editarPaciente = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        const { nome, telefone, email, dataNascimento, pesoAtual, altura, objetivo, observacao } = req.body as PacienteInput

        if (isNaN(id)) return res.status(400).json({})

        const dadosAtualizacao: any = {
            nome,
            email,
            telefone,
            dataNascimento,
            pesoAtual: pesoAtual ? Number(pesoAtual) : undefined,
            altura: altura ? Number(altura) : undefined,
            objetivo,
            observacao
        }

        const edit = await prisma.paciente.update({
            where: { id },
            data: dadosAtualizacao
        })

        return res.status(200).json({ paciente: edit })
    } catch (error) {
        console.error(error)
        return res.status(500).json({})
    }
}

export const inativarPaciente = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        if (isNaN(id)) return res.status(400).json({})

        await prisma.paciente.update({
            where: { id },
            data: { status: 'INATIVO' as any }
        })

        return res.status(200).json({})
    } catch (error) {
        console.error(error)
        return res.status(500).json({})
    }
}