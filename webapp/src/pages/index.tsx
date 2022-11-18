import Image from "next/image"
import appPreviewImg from '../assets/app-nlw-preview.png'
import logoImg from '../assets/logo.svg'
import usersAvatarExampleImg from '../assets/users-avatar-exemplo.png'
import iconCheckImg from '../assets/icon-check.svg'
import { api } from '../lib/axios'
import { FormEvent, useState } from "react"


interface HomeProps {
  poolCount: number;
  guessCount: number;
  usersCount: number;
} 


export default function Home(props: HomeProps) {  
  const [poolTitle, setPoolTitle] = useState('')

  //console.log (poolTitle) => digita oque vc colocar no input, é o ESTADO no REACT temos o valor dela em tempo real
          
  async function createPool(event: FormEvent ) {
    event.preventDefault()
    //criar nosso bolão

    try {
      const response = await api.post('/pools', {
        title: poolTitle,
      });

      const { code } = response.data

      await navigator.clipboard.writeText(code)

      alert('Bolão criado com sucesso, cod criado p area de transf')
      
      setPoolTitle(code)
    } catch (err) {
      console.log(err)
      alert('Falha ao criar o bolão, tente novamente!')
    }
  }


  return (  
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="NLW Copa" />

        <h1 className="mt-14  text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
        <Image src={usersAvatarExampleImg} alt="" />

        <strong className="text-gray-100 text-xl">
          <span className="text-ignite-500">+ {props.usersCount} </span> pessoas já estão usando
        </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input 
          className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100" 
          type="text"
          required placeholder="Qual nome do seu bolão?" 
          onChange={event => setPoolTitle(event.target.value)}
          value={poolTitle}
          />    

          <button    
          className="bg-yellow-500 px-6 py-4 rounded uppercase text-gray-900 font-bold text-sm hover:bg-yellow-700" 
          type="submit"
          >Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
        Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-gray-600 flex items-center justify-between text-gray-100">
            <div className="flex items-center gap-6">
              <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl" >+ {props.poolCount}</span>
              <span>Bolões criados </span>
            </div>
        </div>

        <div className="w-px h-14 bg-gray-600" />

        <div className="flex items-center gap-6">
        <Image src={iconCheckImg} alt="" />
           <div className="flex flex-col">
              <span className="font-bold text-2xl">+ {props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
        </div>
        </div>         
      </main>

      <Image src={appPreviewImg} 
      alt="Dois celulares na aplicação NLW" 
      quality={100} //controla a qualidade da imagem para melhor
      />
    </div>
    //<h1 className="text-violet-500 font-bold text-4xl">Contagem: {props.count}</h1>      
  )
}
   
//chamadas do lado do servidor (NEXT)
export const getServerSideProps = async () => {  
  //fazer a requisição Http (fetch => função global)
 // const poolCountResponse = await api.get('pools/count') //"forçar" o html nao desabilitar o js da pag
 // const data = await response.json()  nao precisa mais usar por causa da bibliot axios
  //sincronismo com o gesses
  //const guessCountResponse = await api.get('guesses/count') 
  

  //para as promisses executar em paralelo no JS
  const [
    poolCountResponse, 
    guessCountResponse, 
    usersCountResponse] 
    = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count')
  ])


  //console.log(data)
  return {
    props: {
    poolCount: poolCountResponse.data.count,
    guessCount: guessCountResponse.data.count,
    usersCount: usersCountResponse.data.count,
    }
  }
} 