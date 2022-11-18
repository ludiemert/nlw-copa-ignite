import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import fastify from 'fastify'


import { poolRoutes } from './routes/pool' 
import { authRoutes } from './routes/auth'
import { gameRoutes } from './routes/game'
import { guessRoutes } from './routes/guess'
import { userRoutes } from './routes/user'

async function bootstrap() {
    const fastify = Fastify({
        logger: true,
    })

await fastify.register(cors, {
    origin: true,   //se tiver dominio colocar: origin: 'www.rocketseat.com.br',
})

    //em produção isso precisa ser uma variavel ambiente
   await fastify.register(jwt, {
    secret: 'nlwcopa', //token essa foi so para teste tem que ser variavel dificil
   })

    //rotas fastify router
    await fastify.register(poolRoutes)
    await fastify.register(authRoutes)
    await fastify.register(gameRoutes)
    await fastify.register(guessRoutes)
    await fastify.register(userRoutes)
   
        await fastify.listen({ port: 3333, host: '0.0.0.0' })
}
bootstrap()