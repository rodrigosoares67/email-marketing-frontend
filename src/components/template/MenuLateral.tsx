import { IconeCasa, IconeEmail, IconeRelatorio, IconeSair, IconeSino } from "../icons";
import MenuItem from "./MenuItem";
import { getAuth, signOut } from 'firebase/auth';

export default function MenuLateral(){
  const auth = getAuth();

  return (
    <aside className={`
      flex flex-col
      bg-gray-200 text-gray-700
      dark:bg-gray-900
    `}>
      <ul className="flex-grow">
        <MenuItem url="/" texto="Início" icone={IconeCasa} className=""/>
        <MenuItem url="/formulario" texto="E-mail" icone={IconeEmail} className="" />
        <MenuItem url="/notificacao" texto="Notificação" icone={IconeSino} className="" />
        <MenuItem url="/relatorio" texto="Relatório" icone={IconeRelatorio} className="" />
        <MenuItem 
          texto="Sair" 
          icone={IconeSair} 
          onClick={() => signOut(auth)}
          className={`
            text-red-600 dark:text-red-400
            hover:bg-red-400 hover:text-white
            dark:hover:text-white
          `}
          url="/autenticacao"
        />
      </ul>
    </aside>
  )
}