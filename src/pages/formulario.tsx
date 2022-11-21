import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { DestinatarioInterface } from '../@types/DestinatarioInterface';
import { MensagemInterface } from '../@types/MensagemInterface';
import { useRouter } from 'next/router'
import Layout from '../components/template/Layout'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import useUserData from '../data/hooks/useUserData';
import { FileInterface } from '../@types/FileInterface';

const SweetAlert = withReactContent(Swal)
const axios = require('axios').default;

const Formulario: NextPage = () => {

  const [destinatarios, setDestinatarios] = useState([])
  const [mensagem, setMensagem] = useState<MensagemInterface>({})
  const [destSelecionados, setDestSelecionados] = useState([])
  const [anexos, setAnexos] = useState([])

  const router = useRouter()

  // Carrega a lista de Destinatarios
  useEffect(() => {
    // Retorna o Token
    // axios.post(`${process.env.NEXT_PUBLIC_API_NODE_HOST}/auth`, {
    //   user: `${process.env.NEXT_PUBLIC_API_NODE_USER}`,
    //   psw: `${process.env.NEXT_PUBLIC_API_NODE_PASS}`
    // })
    //   .then(function (response: any) {
    //   console.log(response)

      
    // }).catch((error: any) => {
    //   console.log(error)
    // })

    axios.get(`${process.env.NEXT_PUBLIC_API_NODE_HOST}/destinatarios`, {
      // headers: {
      //   'Authorization': response.data
      // }
    })
      .then(function (response: any) {
        console.log(response);

        const destinatarios = response.data

        destinatarios.map((destinatario: DestinatarioInterface) => {
          destinatario.isChecked = false
          
          return destinatario
        })

        setDestinatarios(destinatarios)
      })
      .catch(function (error: any) {
        SweetAlert.fire(
          'Erro!',
          'Aconteceu um problema ao listar os destinatários [' + error + ']',
          'error'
        )
      })

  }, [])

  // Seleciona todos os destinatários
  async function handleTodos(e: any){
    const todos = destinatarios

    todos.map((destinatario: DestinatarioInterface) => {
      return destinatario.isChecked = true
    })

    setDestSelecionados(todos)
  }

  // Remove todas as seleções
  async function handleNenhum(e: any){
    const todos = destinatarios

    todos.map((destinatario: DestinatarioInterface) => {
      return destinatario.isChecked = false
    })

    setDestSelecionados([])
  }

  // Salva a mensagem
  async function salvaMensagem(anexos?: any){
    console.log("SALVA MENSAGEM")
    console.log(anexos)

    await axios({
      method: "post",
      url: `${process.env.NEXT_PUBLIC_API_EMAIL_MARKETING}/mensagens`,
      data: {
        assunto: mensagem.assunto,
        conteudo: mensagem.conteudo,
        //user: usuario?.email,
        anexos: anexos
      }
    }).then(function (response: any) {
      salvaDestinatarios(response.data);
    })
    .catch((error: any) => {
      SweetAlert.fire(
        'Erro!',
        'Aconteceu um problema ao cadastrar a mensagem [' + error + ']',
        'error'
      )
    })
  }

  // Realiza upload dos anexos
  async function uploadAnexos(){
    const possuiAnexos = anexos.length > 0
    const multipleFiles = anexos?.length > 1 ? '/multiple' : '';
    
    console.log(anexos)

    const data = new FormData()

    anexos.map((anexo) => {
      return data.append('file', anexo)
    })

    console.log(data)

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }

    if(possuiAnexos){
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_EMAIL_MARKETING}/files/upload${multipleFiles}`,
        data,
        config
      ).then(function (response: any) {
        console.log('Response - upload Anexos')
        console.log(response.data);
  
        salvaMensagem(response.data)
      })
      .catch((error: any) => {
        console.log(error)
        SweetAlert.fire(
          'Erro!',
          'Aconteceu um problema ao realizar o envio dos anexos [' + error + ']',
          'error'
        )
      })
    } else {
      salvaMensagem()
    }
  }

  // Salva os destinatários
  async function salvaDestinatarios(mensagem: MensagemInterface){
    console.log("SALVA DESTINATARIOS")
    
    await axios({
      method: "post",
      url: `${process.env.NEXT_PUBLIC_API_EMAIL_MARKETING}/destinatarios`,
      data: {
        destinatarios: destSelecionados,
        mensagem: mensagem
      }
    }).then((response: any) => {
      SweetAlert.fire(
        'Sucesso!',
        'Mensagem cadastrada com sucesso - adicionada à fila de envio',
        'success'
      )

      router.push("/relatorio")
    }).catch((error: any) => {
      SweetAlert.fire(
        'Erro!',
        'Aconteceu um problema ao cadastrar a mensagem [' + error + ']',
        'error'
      )
    })
  }

  // Envia o formulário
  function handleSubmit(e: any) {
    // Garante que não será realizada a renderização novamente da tela
    e.preventDefault()

    // Realiza o upload dos anexos
    uploadAnexos()
  }

  

  // Alteração do checkbox (marcado ou desmarcado)
  const handleChangeCheckbox = (event: any) => {
    console.log("HANDLE CHANGE CHECKBOX")

    var idxDestinatarioClicado = destinatarios.findIndex((destinatario: DestinatarioInterface) => destinatario.id == event.target.value)
    console.log("IDX DESTINATARIO CLICADO = " + idxDestinatarioClicado)

    var novosDestinatarios = [...destinatarios]
    console.log("NOVOS DESTINATARIOS = ")
    console.log(novosDestinatarios)

    // @ts-ignore
    var destinatarioCheckChange = {...novosDestinatarios[idxDestinatarioClicado]}
    console.log("DESTINATARIO CHECK CHANGE = ")
    console.log(destinatarioCheckChange)

    destinatarioCheckChange.isChecked = event.target.checked

    // @ts-ignore
    novosDestinatarios[idxDestinatarioClicado] = destinatarioCheckChange

    setDestinatarios(novosDestinatarios)

    const destinatariosSelecionados = novosDestinatarios.filter((destinatario: DestinatarioInterface) => {
      return destinatario.isChecked ? true : false
    })

    setDestSelecionados(destinatariosSelecionados)
  }

  const handleChangeAnexos = (anexos: any) => {
    setAnexos(Array.from(anexos))
  }

  return (
    <Layout titulo="Novo Envio" subtitulo="Envie um novo e-mail">
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <h2 className={`
          font-bold text-2xl my-5
          dark:text-gray-300
        `}>
          Conteúdo
        </h2>

        <div className="mb-6">
          <label htmlFor="assunto" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Assunto
          </label>
          <input
            type="text"
            id="assunto"
            value={mensagem?.assunto || ''} 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Assunto do e-mail"
            required
            onChange={(event) => setMensagem({...mensagem, assunto: event.target.value})}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="conteudo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
            Conteúdo
          </label>
          <textarea
            id="conteudo"
            rows={4}
            required
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Conteúdo do e-mail que será enviado"
            onChange={(event) => setMensagem({...mensagem, conteudo: event.target.value})}
          >{mensagem?.conteudo}</textarea>
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="anexo">Anexo(s)</label>
          <input 
            className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
            aria-describedby="anexo_help" 
            id="anexo" 
            type="file" 
            multiple
            //value={anexos}
            onChange={(event) => handleChangeAnexos(event.target.files)}
          />
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="anexo_help">Selecione o(s) arquivos para enviar em anexo ao e-mail</div>
        </div>

        <button
          type="submit"
          className="my-5 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Enviar
        </button>

        <h2 className={`
        font-bold text-2xl my-5
        dark:text-gray-300
      `}>
        Destinatários
        </h2>
        
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
          <div className="pb-4 bg-white dark:bg-gray-900 pt-3 pl-3 grid grid-cols-5 gap-4">
            {/* <div className="">
              <label htmlFor="table-search" className="sr-only">Pesquisar</label>
              <div className="relative mt-1">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                </div>
                <input type="text" id="table-search" className="block p-2 pl-10 w-80 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Pesquisar..." />
              </div>
            </div> */}

            <div className="pt-1">
              <div
                onClick={handleTodos}
                className="focus:outline-none text-white text-center bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800 cursor-pointer"
              >
                Todos
              </div>
            </div>

            <div className="pt-1">
              <div
                onClick={handleNenhum}
                className="focus:outline-none text-black text-center bg-white hover:bg-white focus:ring-4 focus:ring-white font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-white dark:hover:bg-white dark:focus:ring-white cursor-pointer"
              >
                Nenhum
              </div>
            </div>
          </div>

          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                  </div>
                </th>
                <th scope="col" className="py-3 px-6">
                  Código
                </th>
                <th scope="col" className="py-3 px-6">
                  Nome
                </th>
                <th scope="col" className="py-3 px-6">
                  E-mail
                </th>
              </tr>
            </thead>
            <tbody>
              {destinatarios?.map((destinatario: any, index) => {
                return (
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={index}>
                    <td className="p-4 w-4">
                      <div className="flex items-center">
                        <input
                          id={`checkbox-${destinatario.id}`}
                          value={destinatario.id}
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          onChange={handleChangeCheckbox}
                          checked={destinatario.isChecked ? true : false}
                        />
                        <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                      </div>
                    </td>
                    <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {destinatario.id}
                    </th>
                    <td className="py-4 px-6">
                      {destinatario.nome}
                    </td>
                    <td className="py-4 px-6">
                      {destinatario.email}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {/* <nav className="flex justify-between items-center pt-4" aria-label="Paginação">
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Mostrando <span className="font-semibold text-gray-900 dark:text-white">1-10</span> de <span className="font-semibold text-gray-900 dark:text-white">{destinatarios.length}</span></span>
            <ul className="inline-flex items-center -space-x-px">
              <li>
                <a href="#" className="block py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                  <span className="sr-only">Anterior</span>
                  <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                </a>
              </li>
              <li>
                <a href="#" className="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
              </li>
              <li>
                <a href="#" className="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
              </li>
              <li>
                <a href="#" aria-current="page" className="z-10 py-2 px-3 leading-tight text-blue-600 bg-blue-50 border border-blue-300 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
              </li>
              <li>
                <a href="#" className="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">...</a>
              </li>
              <li>
                <a href="#" className="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">100</a>
              </li>
              <li>
                <a href="#" className="block py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                  <span className="sr-only">Próxima</span>
                  <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                </a>
              </li>
            </ul>
          </nav> */}
        </div>
      </form>
    </Layout>
  )
}

export default Formulario