import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Cadastro() {

    const [dark, setDark] = useState(false)

    const navigate = useNavigate()

    const handleDark = () => {
        setDark(true)
        localStorage.setItem('dark', true)
    }

    const handleLight = () => {
        setDark(false)
        localStorage.removeItem('dark')
    }

    function testeLight() {
        toast.success("teste")
    }

    function testeDark() {
        toast.success("teste")
    }

    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const handleCadastro = async (e) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:3000/user/cadastro', {
                nome: nome,
                email: email,
                senha: senha
            })

            toast.success('Usuario criado com sucesso.')

            navigate('/login')
        } catch (error) {
            if(error.status === 409) {
                toast.error("Usuário já cadastrado.")
            }

            if(error.status === 401) {
                toast.error("Email ou senha inválidos.")
            }

            if(error.status === 500) {
                toast.error("Erro interno no servidor.")
                console.log(error)
            }
        }
    }

    return (
        <>
            {
                dark ?
                    <section className='h-screen bg-linear-to-r from-purple-700 to-purple-500'>
                        <nav className='min-w-full h-20 bg-linear-to-tr from-purple-700 to-purple-950 rounded-b-2xl flex text-white shadow-2xl shadow-purple-950'>
                            <div className='w-140 h-20'>
                                <img src="../assets/images/progresso.png" alt="" />
                            </div>
                            <div className='w-200 h-20  flex items-center justify-center'>
                                <h1 className='text-3xl poppins-extrabold'>
                                    Nutricionista esportivo
                                </h1>
                            </div>
                            <div className='w-100 h-20 items-center justify-end flex gap-4'>
                                <button className='border-2 p-2 rounded-full border-white flex gap-2 text-white poppins-extrabold cursor-pointer hover:-translate-y-1 transition-300 duration-300 hover:shadow-2xl hover:shadow-white' onClick={handleLight}>
                                    <CiLight className='text-2xl text-white' />
                                    Light
                                </button>
                                <button className='border-2 rounded-full p-2 poppins-extrabold hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-2xl hover:shadow-white' onClick={testeDark}>
                                    Entrar
                                </button>
                            </div>
                        </nav>
                        <div>

                        </div>
                        <ToastContainer
                            theme='dark' />
                    </section>

                    :

                    <section className='h-screen bg-linear-to-r from-rose-400 to-rose-500'>
                        <nav className='min-w-full h-20 bg-linear-to-tr from-rose-500 to-rose-600 rounded-b-2xl flex text-white shadow-2xl shadow-rose-6000'>
                            <div className='w-140 h-20'>
                                <img src="../assets/images/progresso.png" alt="" />
                            </div>
                            <div className='w-200 h-20  flex items-center justify-center'>
                                <h1 className='text-3xl poppins-extrabold'>
                                    Nutricionista esportivo
                                </h1>
                            </div>
                            <div className='w-100 h-20 items-center justify-end flex gap-4'>
                                <button className='border-2 p-2 rounded-full border-black flex gap-2 text-black poppins-extrabold cursor-pointer hover:-translate-y-1 transition-300 duration-300 hover:shadow-2xl hover:shadow-black' onClick={handleDark}>
                                    <MdDarkMode className='text-2xl text-black' />
                                    Dark
                                </button>
                                <button className='border-2 rounded-full p-2 poppins-extrabold hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-2xl hover:shadow-black'>
                                    Entrar
                                </button>
                            </div>
                        </nav>
                        <div>
                            <main className='w-full h-[90vh] flex items-center justify-center'>
                                <div className='w-100 h-120 bg-rose-500/40 border border-rose-600/55 rounded-2xl shadow-2xl shadow-rose-950 p-4'>
                                    <form className='flex-col flex gap-5' onSubmit={handleCadastro}>

                                        <header className='w-full h-10 flex items-center justify-center'>
                                            <h1 className='text-2xl text-white poppins-extrabold'>Cadastro</h1>
                                        </header>

                                        <div className='flex-col flex gap-5 justify-center h-full text-white'>
                                            <label htmlFor="nome" className='poppins-bold'>Nome</label>
                                            <input
                                                type="text"
                                                id='nome'
                                                value={nome}
                                                onChange={(e) => setNome(e.target.value)}
                                                className='border rounded p-2 text-xl poppins-extrabold focus:outline-4 focus:outline-rose-300 transition-all duration-300' />

                                            <label htmlFor="email" className='poppins-bold'>Email</label>
                                            <input
                                                type="email"
                                                id='email'
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className='border rounded p-2 text-xl poppins-extrabold focus:outline-4 focus:outline-rose-300 transition-all duration-300' />

                                            <label htmlFor="senha" className='poppins-bold'>Senha</label>
                                            <input
                                                id='senha'
                                                type="password"
                                                value={senha}
                                                onChange={(e) => setSenha(e.target.value)}
                                                className='border rounded p-2 text-xl poppins-extrabold focus:outline-4 focus:outline-rose-300 transition-all duration-300 ' />
                                            <button className='border p-2 rounded text-xl poppins-extrabold cursor-pointer hover:-translate-y-1 shado-2xl hover:shadow-white transition-all duration-300' type='submit'>
                                                Cadastrar
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </main>
                        </div>
                        <ToastContainer
                            theme='light' />
                    </section>
            }
        </>
    )
}

export default Cadastro
