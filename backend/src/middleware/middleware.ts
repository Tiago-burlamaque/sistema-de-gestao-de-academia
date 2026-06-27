import { NextFunction, Response, Request } from 'express'
import jwt from 'jsonwebtoken'

interface TokenPayload {
    id: string
    email: string
    nome: string
}

export const authToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader?.split(' ')[1]

        if (!token) return res.status(401).json({
            message: "Token expirado ou inválido."
        })

        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) throw new Error('JWT_SECRET não definido.')

        jwt.verify(token, JWT_SECRET, (error, decoded) => {
            if (error) return res.status(401).json({
                message: "Token inválido ou expirado."
            })

            if (!decoded || typeof decoded === "string") return res.status(401).json({
                message: "Payload inválido"
            })

            req.user = decoded as TokenPayload

            next()
        })
    } catch (error) {
        console.log(`Erro interno no servidor: ${error}`)
        return res.status(500).json({
            message: "Erro interno no serivdor.", error
        })
    }
}