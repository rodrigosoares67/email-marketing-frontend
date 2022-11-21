import { createContext, useEffect, useState } from "react";

interface AppContextProps {
  tema?: string
  alternarTema?: () => void
}

const AppContext = createContext<AppContextProps>({})

// @ts-ignore
export function AppProvider(props) {
  const [tema, setTema] = useState('dark')

  function alternarTema() {
    console.log("ALTERNAR TEMA ")
    const novoTema = tema === '' ? 'dark' : ''
    setTema(novoTema)
    localStorage.setItem('tema', novoTema)
  }

  useEffect(() => {
    const temaSalvo = localStorage.getItem('tema')
    // @ts-ignore
    setTema(temaSalvo)
  }, [])

  return (
    <AppContext.Provider value={{
      tema,
      alternarTema
    }}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContext