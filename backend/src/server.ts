import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

dotenv.config()

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

// ==========================================
// 1. CONTROLLER / ROTAS DE USUÁRIO
// ==========================================

interface UsuarioInput {
    nome: string
    email: string
    senha: string
}

app.post('/user/cadastro', async (req, res) => {
    try {
        const { nome, email, senha } = req.body as UsuarioInput

        if (!nome || !email || !senha) return res.status(400).json({})

        const usuarioExistente = await prisma.usuario.findUnique({ where: { email } })
        if (usuarioExistente) return res.status(409).json({})

        const senhaHash = await bcrypt.hash(senha, 10)

        const usuarioCriado = await prisma.usuario.create({
            data: { nome, email, senha: senhaHash }
        })

        return res.status(201).json({ usuario: usuarioCriado })
    } catch (error) {
        console.error(error)
        return res.status(500).json({})
    }
})

app.post('/user/login', async (req, res) => {
    try {
        const { email, senha } = req.body as any
        
        if (!email || !senha) return res.status(400).json({})
        
        const usuario = await prisma.usuario.findUnique({ where: { email } })
        if (!usuario) return res.status(404).json({})

        const senhaValida = await bcrypt.compare(senha, usuario.senha)
        if (!senhaValida) return res.status(401).json({})

        const secret = process.env.JWT_SECRET
        if (!secret) throw new Error("JWT_SECRET não definido.")

        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome, email: usuario.email },
            secret,
            { expiresIn: '1d' }
        )

        return res.status(200).json({ token })
    } catch (error) {
        console.error(error)
        return res.status(500).json({})
    }
})

// ==========================================
// 2. CONTROLLER / ROTAS DE PACIENTE
// ==========================================

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

app.post('/pacientes', async (req, res) => {
    try {
        const { nome, telefone, email, dataNascimento, pesoAtual, altura, objetivo, observacao } = req.body as PacienteInput

        if (!nome || !telefone || !email || !dataNascimento || !pesoAtual || !altura || !objetivo) {
            return res.status(400).json({})
        }

        const pacienteExistente = await prisma.paciente.findUnique({ where: { email } })
        if (pacienteExistente) return res.status(409).json({})

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
                status: "ATIVO" as any
            }
        })

        return res.status(201).json({ paciente: pacienteCriado })
    } catch (error) {
        console.error(error)
        return res.status(500).json({})
    }
})

app.get('/pacientes', async (req, res) => {
    try {
        const pacientes = await prisma.paciente.findMany()
        if (pacientes.length === 0) return res.status(404).json({})
        return res.status(200).json({ pacientes })
    } catch (error) {
        console.error(error)
        return res.status(500).json({})
    }
})

app.get('/pacientes/:id', async (req, res) => {
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
})

app.put('/pacientes/:id', async (req, res) => {
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
})

app.patch('/pacientes/:id/inativar', async (req, res) => {
    try {
        const id = Number(req.params.id)
        if (isNaN(id)) return res.status(400).json({})

        await prisma.paciente.update({
            where: { id },
            data: { status: "INATIVO" as any }
        })

        return res.status(200).json({})
    } catch (error) {
        console.error(error)
        return res.status(500).json({})
    }
})

// ==========================================
// INITIALIZATION
// ==========================================

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})