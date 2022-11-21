import { UsuarioInterface } from "../../@types/UsuarioInterface"
import useUserData from "../../data/hooks/useUserData"

interface UsuarioProps {
  usuario: UsuarioInterface,
}

export default function Usuario(props: UsuarioProps) {

  const { usuario } = useUserData()

  return (
    <div 
      className={`
        hidden sm:flex items-center
        bg-gray-700 dark:bg-gray-900
        p-1 pr-5 mx-5 rounded-full
      `}
      //onClick={}
    >
      <div className={`
        flex items-center justify-center
        bg-white text-yellow-600
        w-6 h-6 rounded-full
      `}>
        
      </div>
      <div className={`
        hidden lg:flex items-center ml-4
        text-white
      `}>
        <span className="text-sm">Usuário: {usuario?.nome}</span>
      </div>
    </div>
  )
}