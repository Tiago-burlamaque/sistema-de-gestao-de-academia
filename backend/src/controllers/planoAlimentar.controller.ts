import {
    Request,
    Response
} from 'express'
import { prisma } from '../../lib/prisma'
import { TipoRefeicao } from '../../generated/prisma/enums'

interface PlanoAlimentar {
    pacienteId: number
    nomePlano: string
    caloriasDiarias: number
    objetivo: string
    observacao: string
}

interface Refeicao {
    planoId: number
    tipo: TipoRefeicao
    descricao: string
}

export const criarPlanoAlimentar = async (req: Request, res: Response) => {
    try {
        const { pacienteId, nomePlano, caloriasDiarias, objetivo, observacao } = req.body as PlanoAlimentar

        const planoAlimentar = await prisma.planoAlimentar.findMany()

        if (planoAlimentar.length === 0) return res.status(404).json({
            message: "nenhum plano alimentar encontrado."
        })

        await prisma.planoAlimentar.create({
            data: {
                caloriasDiarias,
                objetivo,
                nomePlano,
                observacao,
                pacienteId
            }
        })

        return res.status(201).json({
            message: "Plano criado com sucesso."
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Erro interno no servidor."
        })
    }
}

export const listarPlanos = async (req: Request, res: Response) => {
    try {
        const consulta = await prisma.planoAlimentar.findMany({
            orderBy: {
                pacienteId: "asc"
            }
        })

        if (consulta.length === 0) return res.status(404).json({
            message: "Nenhum plano registrado."
        })

        return res.status(200).json({
            consulta
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "erro interno servidor."
        })
    }
}

export const adicionarRefeicao = async (req: Request, res: Response) => {
    try {
        const { planoId, tipo, descricao } = req.body as Refeicao

        if (!planoId || !tipo) return res.status(400).json({
            message: "campos planoId e tipo são obrigatórios."
        })

        await prisma.refeicao.create({
            data: {
                planoId,
                descricao,
                tipo
            }
        })

        return res.status(201).json({
            message: "refeição criada."
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Erro interno no servidor."
        })
    }
}

export const categorizarTipoRefeicao = async (req: Request, res: Response) => {
    try {
        const refeicoes = await prisma.refeicao.findMany({
            orderBy: {
                tipo: "asc"
            }
        })
    
        return res.status(200).json({
            refeicoes
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Erro interno no servidor."
        })
    }
}