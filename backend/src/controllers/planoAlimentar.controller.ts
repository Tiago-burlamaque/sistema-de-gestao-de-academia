import { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'

interface RefeicaoInput {
    tipo: string
    descricao: string
}

export const criarPlanoAlimentar = async (req: Request, res: Response) => {
    try {
        const { pacienteId, nomePlano, caloriasDiarias, objetivo, observacao, refeicoes } = req.body

        if (!pacienteId || !nomePlano || !caloriasDiarias || !objetivo) {
            return res.status(400).json({ message: "Campos obrigatórios ausentes." })
        }

        // Criação usando Nested Writes - Casando perfeitamente com os modelos PlanoAlimentar e Refeicao do seu schema
        const novoPlano = await prisma.planoAlimentar.create({
            data: {
                pacienteId: Number(pacienteId),
                nomePlano,
                caloriasDiarias: Number(caloriasDiarias),
                objetivo,
                observacao: observacao || "",
                refeicoes: {
                    create: refeicoes.map((ref: RefeicaoInput) => ({
                        tipo: ref.tipo,
                        descricao: ref.descricao
                    }))
                }
            },
            include: { refeicoes: true }
        })

        return res.status(201).json({ message: "Plano alimentar criado com sucesso!", plano: novoPlano })
    } catch (error) {
        console.error("Erro ao criar plano alimentar:", error)
        return res.status(500).json({ message: "Erro interno ao salvar plano alimentar." })
    }
}

export const buscarPlanoPorPaciente = async (req: Request, res: Response) => {
    try {
        const pacienteId = Number(req.params.pacienteId)

        const planos = await prisma.planoAlimentar.findMany({
            where: { pacienteId },
            include: { refeicoes: true },
            orderBy: { id: 'desc' }
        })

        return res.status(200).json({ planos })
    } catch (error) {
        console.error("Erro ao buscar planos:", error)
        return res.status(500).json({ message: "Erro ao buscar plano alimentar." })
    }
}