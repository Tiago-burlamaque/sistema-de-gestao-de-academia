import {
    Request,
    Response
} from 'express'
import { prisma } from '../../lib/prisma'
import { StatusConsulta } from '../../generated/prisma/enums'

interface Consulta {
    pacienteId: number
    data: Date
    status: StatusConsulta
    observacao: string
}

export const agendarConsulta = async (req: Request, res: Response) => {
    try {
        const { pacienteId, data, observacao } = req.body as Consulta

        if (!pacienteId || !data) {
            return res.status(400).json({
                message: "Preencha os campos pacienteId e data."
            })
        }

        const consutla = await prisma.consulta.findMany({
            where: {
                data,
                pacienteId
            }
        })

        if(consutla.length > 1) return res.status(409).json({
            message: "Consulta já agendada."
        })

        await prisma.consulta.create({
            data: {
                pacienteId,
                data,
                status: "AGENDADA",
                observacao


            }
        })
        return res.status(201).json({
            message: "Consulta agendada com sucesso."
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Erro interno no servidor."
        })
    }
}

export const listarConsultas = async (req: Request, res: Response) => {
    try {
        const consulta = await prisma.consulta.findMany()

        if(consulta.length === 0) return res.status(404).json({
            message: "Nenhuma consulta agendada."
        })

        return res.status(200).json({
            consulta
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Erro interno servidor."
        })
    }
}

export const atualizarStatus = async (req: Request, res: Response) => {
    try {
        const { status, pacienteId } = req.body as Consulta
        const id = Number(req.params.id)

        const consulta = await prisma.consulta.findMany({
            where: {
                pacienteId,
                status: "AGENDADA"
            }
        })

        if(consulta.length === 0) return res.status(404).json({
            message: "consulta não existe"
        })

        await prisma.consulta.update({
            where: {
                id,
                pacienteId,
                status: "AGENDADA"
            },
            data: {
                status
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Erro interno no servidor."
        })
    }
}