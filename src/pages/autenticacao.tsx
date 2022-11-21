import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import AuthInput from '../components/auth/AuthInput'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';

export interface IAutenticacaoPageProps {}

const axios = require('axios')
const SweetAlert = withReactContent(Swal)

const Autenticacao: NextPage<IAutenticacaoPageProps> = (props) => {
  const auth = getAuth();
  const router = useRouter()
  const [authing, setAuthing] = useState(false);

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const signWithEmail = async () => {
    signInWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        const user = userCredential.user;

        router.push('/')
      })
      .catch((error) => {
        const errorCode = error.code;
        let messageError = ""

        if(errorCode === "auth/wrong-password"){
          messageError = "Usuário e/ou senha inválidos! Tente novamente."
        }

        SweetAlert.fire(
          `Erro!`,
          messageError,
          'error'
        )
      });
  }

  const signInWithGoogle = async () => {
    setAuthing(true);

    signInWithPopup(auth, new GoogleAuthProvider())
      .then(response => {
        router.push('/')
      })
      .catch(error => {
        setAuthing(false)
      })
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="hidden md:block md:w-1/2 lg:w-2/3">
        <img 
          src="/assets/wallpaper.jpg"
          alt="Imagem da Tela de Autenticação"
          className="h-screen w-full object-cover"
        />
      </div>
      <div className="m-10 w-full md:w-1/2 lg:w-1/3">
          <h1 className={`text-3xl font-bold mb-5`}>
            E-mail Marketing
          </h1>

          <h4 className={`text-1xl font-bold mb-5`}>
            Acesse sua conta
          </h4>
          
          <AuthInput
            label="Email"
            tipo="email"
            valor={email}
            valorMudou={setEmail}
            obrigatorio
          />
          <AuthInput
            label="Senha"
            tipo="password"
            valor={senha}
            valorMudou={setSenha}
            obrigatorio
          />

          <button
            onClick={() => signWithEmail()}
            //disabled={authing}
            className={`
              w-full bg-green-500 hover:bg-green-400
              text-white rounded-lg px-4 py-3 mt-6
            `}>
            Entrar
          </button>

          {/* <button
            onClick={() => signInWithGoogle()}
            disabled={authing}
            className={`
              w-full bg-green-500 hover:bg-green-400
              text-white rounded-lg px-4 py-3 mt-6
            `}>
            Entrar com o Google
          </button> */}

          <hr className="my-6 border-gray-300 w-full" />
      </div>
  </div>
  )
}

export default Autenticacao