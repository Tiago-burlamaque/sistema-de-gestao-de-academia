import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import axios from 'axios';
import logo from '../assets/images/progresso.png';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const navigate = useNavigate();
    
    const [dark, setDark] = useState<boolean>(() => localStorage.getItem('dark') === 'true');
    const [formData, setFormData] = useState({ email: '', senha: '' });

    const toggleTheme = (isDark: boolean): void => {
        setDark(isDark);
        if (isDark) {
            localStorage.setItem('dark', 'true');
        } else {
            localStorage.removeItem('dark');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/user/login', formData);
            
            localStorage.setItem('token', response.data.token);
            toast.success('Login efetuado com sucesso.');
            
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (error: any) {
            const status = error.response?.status;
            if (status === 401 || status === 404) return void toast.error("E-mail ou senha incorretos.");
            if (status === 500) return void toast.error("Erro interno no servidor.");
            toast.error("Erro ao conectar com o servidor.");
        }
    };

    // Ajuste de classes de gradiente compatíveis com o motor do Tailwind v4
    const themeBg = dark ? 'bg-gradient-to-r from-purple-900 to-purple-700' : 'bg-gradient-to-r from-rose-400 to-rose-500';
    const navBg = dark ? 'bg-gradient-to-tr from-purple-700 to-purple-950' : 'bg-gradient-to-tr from-rose-500 to-rose-600';
    const cardBg = dark ? 'bg-purple-950/40 border-purple-600/55' : 'bg-rose-500/40 border-rose-600/55';
    const shadowColor = dark ? 'shadow-purple-950' : 'shadow-rose-950';
    const btnNavTheme = dark ? 'border-white text-white' : 'border-black text-black';
    const inputFocus = dark ? 'focus:border-purple-400' : 'focus:border-rose-300';

    return (
        <section className={`min-h-screen transition-colors duration-500 ${themeBg} text-white poppins-regular`}>
            <nav className={`w-full h-20 rounded-b-2xl flex items-center justify-between px-8 shadow-2xl transition-all duration-500 ${navBg}`}>
                <div className='w-40 flex items-center'>
                    <img src={logo} alt="Logo" className='h-12 object-contain' />
                </div>
                <div>
                    <h1 className='text-xl md:text-3xl poppins-extrabold text-center'>Sistema de Gestão</h1>
                </div>
                <div className='flex items-center gap-4'>
                    {dark ? (
                        <button type="button" className={`border-2 p-2 rounded-full flex gap-2 poppins-bold cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 shadow-md ${btnNavTheme}`} onClick={() => toggleTheme(false)}>
                            <CiLight className='text-2xl' /> <span className="hidden sm:inline">Light</span>
                        </button>
                    ) : (
                        <button type="button" className={`border-2 p-2 rounded-full flex gap-2 poppins-bold cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 shadow-md ${btnNavTheme}`} onClick={() => toggleTheme(true)}>
                            <MdDarkMode className='text-2xl' /> <span className="hidden sm:inline">Dark</span>
                        </button>
                    )}
                    <button type="button" className={`border-2 rounded-full p-2 px-4 poppins-bold transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer ${dark ? 'border-white text-white' : 'border-black text-black'}`} onClick={() => navigate('/cadastro')}>
                        Criar Conta
                    </button>
                </div>
            </nav>

            <main className='w-full h-[calc(100vh-80px)] flex items-center justify-center p-4'>
                <div className={`w-full max-w-md bg-opacity-40 border rounded-2xl shadow-2xl p-6 transition-all duration-500 ${cardBg} ${shadowColor}`}>
                    <form className='flex flex-col gap-5' onSubmit={handleLogin}>
                        <header className='w-full text-center'>
                            <h2 className='text-2xl text-white poppins-extrabold tracking-wide'>Login</h2>
                        </header>

                        <div className='flex flex-col gap-4 text-white'>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="email" className='poppins-bold text-sm'>Email</label>
                                <input type="email" id='email' value={formData.email} onChange={handleChange} className={`w-full border border-white/20 rounded p-2.5 text-lg bg-black/10 text-white focus:outline-none transition-all duration-300 ${inputFocus}`} required placeholder="seu@email.com" />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="senha" className='poppins-bold text-sm'>Senha</label>
                                <input type="password" id='senha' value={formData.senha} onChange={handleChange} className={`w-full border border-white/20 rounded p-2.5 text-lg bg-black/10 text-white focus:outline-none transition-all duration-300 ${inputFocus}`} required placeholder="••••••••" />
                            </div>

                            <button className='w-full border border-white/40 bg-white/10 p-2.5 rounded text-xl poppins-extrabold cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 hover:bg-white hover:text-purple-900 focus:outline-none mt-2 shadow-lg' type='submit'>
                                Entrar
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <ToastContainer theme={dark ? 'dark' : 'light'} position="top-right" autoClose={3000} />
        </section>
    );
}

export default Login;