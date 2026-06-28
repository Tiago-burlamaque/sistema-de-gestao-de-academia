// Importa as bibliotecas
import {
    Request,
    Response
} from 'express'
import { prisma } from '../../lib/prisma'

// Tipagem da evolução
interface Evolucao {
    pacienteId: number
    peso: number
    percentualGordura: number
    circunferenciaGordura: number
    circunferenciaAbdominal: number
    observacao: string
}

// Registra a evolução do paciente
export const registrarEvolucao = async (
    req: Request,
    res: Response
) => {
    try {
        const { pacienteId, peso, percentualGordura, circunferenciaGordura, circunferenciaAbdominal, observacao } = req.body as Evolucao

        if (!pacienteId || !peso || !percentualGordura || !circunferenciaAbdominal || !circunferenciaGordura) return res.status(400).json({
            message: "Apenas o campo observação é opcional."
        })

        const evolucao = await prisma.evolucao.create({
            data: {
                pacienteId,
                peso,
                percentualGordura,
                circunferenciaGordura,
                circunferenciaAbdominal,
                observacao
            }
        })

        return res.status(201).json({
            evolucao
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Erro interno no servidor.", error
        })
    }
}

export const listarTodaEvolucao = async (req: Request, res: Response) => {
    try {
        const evolucao = await prisma.evolucao.findMany()

        if(!evolucao) return res.status(404).json({
            message: "Nenhuma evolução encontrada."
        })

        return res.status(200).json({
            evolucao
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Erro interno no servidor."
        })
    }
}

export const listarEvolucaoPorId = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)

        const evolucao = await prisma.evolucao.findUnique({
            where: {
                id
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "erro interno no servidor interno."
        })
    }
}