import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

interface UsuarioInput {
    nome: string
    email: string
    senha: string
}

export const cadastro = async (req: Request, res: Response) => {
    try {
        const { nome, email, senha } = req.body as UsuarioInput

        if (!nome || !email || !senha) {
            return res.status(400).json({})
        }

        const usuarioExistente = await prisma.usuario.findUnique({
            where: { email }
        })

        if (usuarioExistente) {
            return res.status(409).json({})
        }

        const senhaHash = await bcrypt.hash(senha, 10)

        const usuarioCriado = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: senhaHash
            }
        })

        return res.status(201).json({ usuario: usuarioCriado })
    } catch (error) {
        console.error(error)
        return res.status(500).json({})
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, senha } = req.body as UsuarioInput
        
        if (!email || !senha) {
            return res.status(400).json({})
        }
        
        const usuario = await prisma.usuario.findUnique({
            where: { email }
        })

        if (!usuario) {
            return res.status(404).json({})
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha)

        if (!senhaValida) {
            return res.status(401).json({})
        }

        const secret = process.env.JWT_SECRET
        if (!secret) {
            throw new Error("JWT_SECRET não definido.")
        }

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
}