import { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'

export const agendarConsulta = async (req: Request, res: Response) => {
    try {
        const { pacienteId, data, observacao } = req.body

        if (!pacienteId || !data) {
            return res.status(400).json({ message: "Paciente e data são obrigatórios." })
        }

        const novaConsulta = await prisma.consulta.create({
            data: {
                pacienteId: Number(pacienteId),
                data: new Date(data),
                observacao,
                status: "AGENDADA"
            }
        })

        return res.status(201).json({ message: "Consulta agendada com sucesso!", consulta: novaConsulta })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Erro ao agendar consulta." })
    }
}

export const listarConsultasPorPaciente = async (req: Request, res: Response) => {
    try {
        const pacienteId = Number(req.params.pacienteId)

        const consultas = await prisma.consulta.findMany({
            where: { pacienteId },
            orderBy: { data: 'asc' }
        })

        return res.status(200).json({ consultas })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Erro ao buscar consultas." })
    }
}

export const alterarStatusConsulta = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        const { status } = req.body // ex: "REALIZADA", "CANCELADA"

        await prisma.consulta.update({
            where: { id },
            data: { status }
        })

        return res.status(200).json({ message: "Status da consulta atualizado." })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Erro ao atualizar consulta." })
    }
}