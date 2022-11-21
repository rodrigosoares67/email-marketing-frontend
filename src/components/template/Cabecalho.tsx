import useAppData from "../../data/hooks/useAppData"
import BotaoAlternarTema from "./BotaoAlternarTema"
import Titulo from "./Titulo"
import Usuario from "./Usuario"

interface CabecalhoProps {
  titulo: string
  subtitulo: string
}

export default function Cabecalho(props: CabecalhoProps){

  const { tema, alternarTema } = useAppData()

  return (
    <div className={`flex items-center`}>
      <Titulo titulo={props.titulo} subtitulo={props.subtitulo} />
      <div className={`flex flex-grow justify-end`}>
        {/* @ts-ignore */}
        {/* <Usuario /> */}
        {/* @ts-ignore */}
        <BotaoAlternarTema tema={tema} alternarTema={alternarTema} />
      </div>
    </div>
  )
}