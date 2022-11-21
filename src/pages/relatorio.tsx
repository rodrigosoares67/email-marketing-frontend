import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Layout from '../components/template/Layout'
import useUserData from '../data/hooks/useUserData'

const Relatorio: NextPage = () => {

  return (
    <Layout titulo="Relatório" subtitulo="Status dos envios">
      <h3 className={`text-3xl font-bold`}>Em breve!</h3>
    </Layout>
  )
}

export default Relatorio