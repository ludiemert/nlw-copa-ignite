import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authenticate } from "../plugins/authenticate"

export async function authRoutes(fastify: FastifyInstance)  { 
    fastify.get('/me', {
            onRequest: [authenticate],
        }, async (request) => {
        //await request.jwtVerify()
        return { user: request.user}
    })

    fastify.post('/users', async (request) => {
        const createUserBody = z.object({
            access_token: z.string(),
        })

    
        const { access_token } = createUserBody.parse(request.body)

        console.log(access_token)

        //comunicar com a api do gitHub
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })

        const userData = await userResponse.json()
        console.log("======>", userData) 

        const userInfoSchema = z.object({
            id: z.string(),
            email: z.string().email(), 
            name: z.string(),
            picture: z.string().url(),
        })

        const userInfo = userInfoSchema.parse(userData)

        let user = await prisma.user.findUnique({
            where: {
                googleId: userInfo.id,
            }
        })

        console.log("===> USER" , user)

        if(!user) {
            user = await prisma.user.create({
                data: {
                    googleId: userInfo.id,
                    name: userInfo.name,
                    email: userInfo.email,
                    avatarUrl: userInfo.picture,
                }
            })
        }
               
        const token = fastify.jwt.sign({
            name: user.name,
            avatarUrl: user.avatarUrl,
        }, {
            sub: user.id,
            expiresIn: '25 days', //dias que o usuario vai ficar conectado (com o token jwt) depois vai desconectar
        })

        return { token }
    })
     

}