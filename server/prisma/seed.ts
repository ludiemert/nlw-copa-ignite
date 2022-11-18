import { PrismaClient } from "@prisma/client";

//conexão com o banco
const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'Lucian Diemert',
            email: 'luciandiemert@gmail.com',
            avatarUrl: 'https://github.com/ludiemert.png',  
        }
    })

    //criar bolao => pool
    const pool = await prisma.pool.create({
        data: {
            title: 'Examplo Pool',
            code: 'BOL123',
            ownerId: user.id,

            //ou faço inserção encadeada ou   criar registro na tabela
            participants: {
                create: {
                    userId: user.id
                }
            }
             
        }
    })

    //sempre salve a data com timezone
    await prisma.game.create({
        data: {
            date: '2022-11-02T12:00:00.702Z',            
            firstTeamCountryCode: 'DE',
            secondTeamCountryCode: 'BR',                    
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-03T12:00:00.702Z',            
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'AR', 
            
            //criar o palpite
            guesses: {
                create: {
                    firstTeamPoints: 2,
                    secondTeamPoints: 1,

                    participant: {
                        connect: {
                            userId_poolId: {
                                userId: user.id,
                                poolId: pool.id,
                                
                            }
                        }
                    }
                }
            }
        }
    })
}

main()
