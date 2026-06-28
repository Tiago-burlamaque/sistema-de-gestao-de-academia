import { prisma } from '../../lib/prisma'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Response, Request } from 'express'
import dotenv from 'dotenv'

dotenv.config()

interface Usuario {
    nome: string
    email: string
    senha: string
}

export const cadastro = async (
    req: Request,
    res: Response
) => {
    try {
        const { nome, email, senha } = req.body as Usuario

        if (!nome || !email || !senha) return res.status(400).json({
            message: "Os campos são obrigatórios."
        })

        const usuario = await prisma.usuario.findUnique({
            where: {
                email
            }
        })

        if (usuario) return res.status(409).json({
            message: "Usuario já cadastrado."
        })

        const salts = 20
        const senhaHash = await bcrypt.hash(senha, salts)

        const usuarioCriado = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: senhaHash
            }
        })

        return res.status(201).json({
            message: "Usuário criado com sucesso.", usuarioCriado
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "erro interno no servidor.", error
        })
    }
}

export const login = async (
    req: Request,
    res: Response
) => {
    try {
        const { email, senha } = req.body as Usuario
        
        
        if (!email || !senha) {
            return res.status(400).json({ message: "Os campos são obrigatórios." })
        }
        
        const usuario = await prisma.usuario.findUnique({
            where: { email }
        })

        if (!usuario) {
            return res.status(404).json({
                message: "Usuário não cadastrado."
            })
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha)


        if (!senhaValida) {
            return res.status(401).json({
                message: "E-mail ou senha incorretos."
            })
        }

        const secret = process.env.JWT_SECRET

        if (!secret) {
            throw new Error("JWT_SECRET não definido.")
        }

        const token = jwt.sign({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        }, secret, {
            expiresIn: '1d'
        })

        return res.status(200).json({
            message: "Login efetuado com sucesso.",
            token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "erro interno no servidor.", error })
    }
}