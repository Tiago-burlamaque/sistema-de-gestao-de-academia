import { Request, Response } from 'express'
import {prisma} from '../../lib/prisma'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()


interface UsuarioInput {
    nome: string
    email: string
    senha: string
}

export const cadastro = async (req: Request, res: Response) => {
    try {
        const { nome, email, senha } = req.body as UsuarioInput

        if (!nome || !email || !senha) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios." })
        }

        // CORREÇÃO: Busca única para evitar duplicados que quebram o banco
        const usuarioExistente = await prisma.usuario.findUnique({
            where: { email }
        })

        if (usuarioExistente) {
            return res.status(409).json({ message: "Este e-mail já está cadastrado." })
        }

        const senhaHash = await bcrypt.hash(senha, 10)

        const usuarioCriado = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: senhaHash
            }
        })

        return res.status(201).json({ message: "Usuário criado com sucesso!", usuario: usuarioCriado })
    } catch (error) {
        console.error("Erro no cadastro:", error)
        return res.status(500).json({ message: "Erro interno ao criar conta." })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, senha } = req.body as UsuarioInput
        
        if (!email || !senha) {
            return res.status(400).json({ message: "E-mail e senha são obrigatórios." })
        }
        
        const usuario = await prisma.usuario.findUnique({
            where: { email }
        })

        if (!usuario) {
            return res.status(404).json({ message: "E-mail ou senha incorretos." })
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha)

        if (!senhaValida) {
            return res.status(401).json({ message: "E-mail ou senha incorretos." })
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
        console.error("Erro no login:", error)
        return res.status(500).json({ message: "Erro interno no servidor." })
    }
}