import { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'

interface EvolucaoInput {
    pacienteId: number
    peso: number
    percentualGordura: number
    circunferenciaGordura: number
    circunferenciaAbdominal: number
    observacao?: string
}

export const registrarEvolucao = async (req: Request, res: Response) => {
    try {
        const { pacienteId, peso, percentualGordura, circunferenciaGordura, circunferenciaAbdominal, observacao } = req.body as EvolucaoInput

        if (!pacienteId || !peso || !percentualGordura || !circunferenciaAbdominal || !circunferenciaGordura) {
            return res.status(400).json({
                message: "Apenas o campo observação é opcional."
            })
        }

        const evolucao = await prisma.evolucao.create({
            data: {
                pacienteId: Number(pacienteId),
                peso,
                percentualGordura,
                circunferenciaGordura,
                circunferenciaAbdominal,
                observacao: observacao || ""
            }
        })

        return res.status(201).json({
            message: "Evolução registrada com sucesso.",
            evolucao
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Erro interno no servidor." })
    }
}

export const listarTodaEvolucao = async (req: Request, res: Response) => {
    try {
        const evolucao = await prisma.evolucao.findMany()

        if (evolucao.length === 0) {
            return res.status(404).json({
                message: "Nenhuma evolução encontrada."
            })
        }

        return res.status(200).json({ evolucao })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Erro interno no servidor." })
    }
}

export const listarEvolucaoPorId = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)

        if (isNaN(id)) return res.status(400).json({ message: "ID inválido." })

        const evolucao = await prisma.evolucao.findUnique({
            where: { id }
        })

        if (!evolucao) {
            return res.status(404).json({ message: "Evolução não encontrada." })
        }

        
        return res.status(200).json({ evolucao })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Erro interno no servidor." })
    }
}