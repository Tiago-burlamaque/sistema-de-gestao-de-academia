declare global {
    namespace Express {
        interface Request {
            user: {
                id: String
                nome: string
                email: string
            }
        }
    }
}

export {}