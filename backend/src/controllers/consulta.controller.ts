import { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'
import { StatusConsulta } from '../../generated/prisma/enums'

interface ConsultaInput {
    pacienteId: number
    data: string | Date // O JSON envia como string ISO, precisamos converter
    observacao?: string
}

interface AtualizarStatusInput {
    status: StatusConsulta
}

export const agendarConsulta = async (req: Request, res: Response) => {
    try {
        const { pacienteId, data, observacao } = req.body as ConsultaInput

        if (!pacienteId || !data) {
            return res.status(400).json({
                message: "Preencha os campos pacienteId e data."
            })
        }

        const dataConsulta = new Date(data)

        const consultaExistente = await prisma.consulta.findFirst({
            where: {
                data: dataConsulta,
                pacienteId: Number(pacienteId)
            }
        })

        if (consultaExistente) {
            return res.status(409).json({
                message: "Consulta já agendada para este paciente neste mesmo horário."
            })
        }

        const novaConsulta = await prisma.consulta.create({
            data: {
                pacienteId: Number(pacienteId),
                data: dataConsulta,
                status: "AGENDADA",
                observacao: observacao || ""
            }
        })

        return res.status(201).json({
            message: "Consulta agendada com sucesso.",
            consulta: novaConsulta
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Erro interno no servidor."
        })
    }
}

export const listarConsultas = async (req: Request, res: Response) => {
    try {
        const consultas = await prisma.consulta.findMany({
            orderBy: { data: 'asc' } // Boa prática: listar as mais próximas primeiro
        })

        if (consultas.length === 0) {
            return res.status(404).json({
                message: "Nenhuma consulta agendada."
            })
        }

        return res.status(200).json({
            consultas
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Erro interno no servidor."
        })
    }
}

export const atualizarStatus = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        const { status } = req.body as AtualizarStatusInput

        if (!status) {
            return res.status(400).json({ message: "O campo status é obrigatório." })
        }

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID da consulta inválido." })
        }

        // CORREÇÃO: Busca estrita pelo ID primário da consulta (única forma segura para .update)
        const consulta = await prisma.consulta.findUnique({
            where: { id }
        })

        if (!consulta) {
            return res.status(404).json({
                message: "Consulta não encontrada."
            })
        }

        // Executa a atualização apenas pelo ID único
        const consultaAtualizada = await prisma.consulta.update({
            where: { id },
            data: { status }
        })

        // CORREÇÃO: Faltava enviar a resposta para o cliente não travar a requisição
        return res.status(200).json({
            message: "Status da consulta atualizado com sucesso.",
            consulta: consultaAtualizada
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Erro interno no servidor."
        })
    }
}