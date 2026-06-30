import { Request, Response } from 'express'
import { prisma } from '../../lib/prisma' 

interface PacienteInput {
    nome: string
    telefone: string
    email: string
    dataNascimento: string
    pesoAtual: number
    altura: number
    objetivo: any
    observacao?: string
}

export const cadastrarPaciente = async (req: Request, res: Response) => {
    try {
        const { nome, telefone, email, dataNascimento, pesoAtual, altura, objetivo, observacao } = req.body as PacienteInput

        // Captura o ID mapeado pelo middleware
        const usuarioLogadoId = (req as any).user?.id || (req as any).usuario?.id

        if (!nome || !telefone || !email || !dataNascimento || !pesoAtual || !altura || !objetivo) {
            return res.status(400).json({ message: "Campos obrigatórios ausentes." })
        }

        if (!usuarioLogadoId) {
            return res.status(401).json({ message: "Sessão expirada ou usuário não identificado. Faça login novamente." })
        }

        const pacienteExistente = await prisma.paciente.findUnique({
            where: { email }
        })

        if (pacienteExistente) {
            return res.status(409).json({ message: "Este e-mail de aluno já está cadastrado." })
        }

        const pacienteCriado = await prisma.paciente.create({
            data: {
                nome,
                email,
                telefone,
                dataNascimento,
                pesoAtual: Number(pesoAtual),
                altura: Number(altura),
                objetivo,
                observacao: observacao || "",
                status: "ATIVO",
                usuarioId: Number(usuarioLogadoId)
            }
        })

        return res.status(201).json({ message: "Aluno cadastrado com sucesso!", paciente: pacienteCriado })
    } catch (error: any) {
        console.error("Erro ao cadastrar paciente:", error)
        if (error.code === 'P2003') {
            return res.status(400).json({ message: "Erro de vínculo: O usuário autenticado não é válido na tabela do banco." })
        }
        return res.status(500).json({ message: "Erro interno no banco de dados ao salvar o aluno." })
    }
}

export const consultarTodosPacientes = async (req: Request, res: Response) => {
    try {
        const pacientes = await prisma.paciente.findMany()

        if (pacientes.length === 0) {
            return res.status(200).json({ pacientes: [] })
        }

        return res.status(200).json({ pacientes })
    } catch (error) {
        console.error("Erro ao buscar pacientes:", error)
        return res.status(500).json({ message: "Erro ao buscar pacientes." })
    }
}

export const consultarPorId = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)

        if (isNaN(id)) return res.status(400).json({ message: "ID inválido." })

        const paciente = await prisma.paciente.findUnique({
            where: { id }
        })

        if (!paciente) {
            return res.status(404).json({ message: "Paciente não encontrado." })
        }

        return res.status(200).json({ paciente })
    } catch (error) {
        console.error("Erro ao buscar paciente por ID:", error)
        return res.status(500).json({ message: "Erro ao processar requisição." })
    }
}

export const editarPaciente = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        const { nome, telefone, email, dataNascimento, pesoAtual, altura, objetivo, observacao } = req.body as PacienteInput

        if (isNaN(id)) return res.status(400).json({ message: "ID inválido." })

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
        console.error("Erro ao editar paciente:", error)
        return res.status(500).json({ message: "Erro ao atualizar dados." })
    }
}

export const inativarPaciente = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)

        if (isNaN(id)) return res.status(400).json({ message: "ID inválido." })

        const paciente = await prisma.paciente.findUnique({
            where: { id }
        })

        if (!paciente) {
            return res.status(404).json({ message: "Paciente não encontrado." })
        }

        await prisma.paciente.update({
            where: { id },
            data: { 
                status: "INATIVO"
            }
        })

        return res.status(200).json({ message: "Paciente inativado com sucesso." })
    } catch (error: any) {
        console.error("Erro ao inativar paciente:", error)
        if (error.code === 'P2003' || error.code === 'P2002') {
             return res.status(409).json({ message: "Não foi possível alterar o status do aluno devido a vínculos pendentes no banco de dados." })
        }
        return res.status(500).json({ message: "Erro ao alterar status." })
    }
}