import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { MdDarkMode } from "react-icons/md";

function Cadastro() {

    const [dark, setDark] = useState(false)

    return (
        <>
            {
                dark ?
                    <section>

                    </section>

                    :

                    <section className='h-screen bg-linear-to-r from-rose-400 to-rose-500'>
                        <nav className='min-w-full h-20 bg-linear-to-tr from-rose-500 to-rose-600 rounded-b-2xl flex text-white'>
                            <div className='w-140 h-20'>
                                <img src="../assets/images/progresso.png" alt="" />
                            </div>
                            <div className='w-200 h-20  flex items-center justify-center'>
                                <h1 className='text-3xl poppins-extrabold'>
                                    Nutricionista para comunidade LGBTQIAPN+
                                </h1>
                            </div>
                            <div className='w-100 h-20 items-center justify-end flex gap-4'>
                                <button className='border-2 p-2 rounded-full border-black flex gap-2 text-black poppins-extrabold cursor-pointer hover:-translate-y-1 transition-300 duration-300 hover:shadow-2xl hover:shadow-black'>
                                    <MdDarkMode className='text-2xl text-black' />
                                    Dark
                                </button>
                                <button className='border-2 rounded-full p-2 poppins-extrabold hover:-translate-y-1 '>
                                    Entrar
                                </button>
                            </div>
                        </nav>
                        <div>

                        </div>
                        <ToastContainer />
                    </section>
            }
        </>
    )
}

export default Cadastro
