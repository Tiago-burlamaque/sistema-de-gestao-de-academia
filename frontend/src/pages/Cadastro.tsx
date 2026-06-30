import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

function Cadastro() {
    const navigate = useNavigate();
    
    const [dark, setDark] = useState<boolean>(() => localStorage.getItem('dark') === 'true');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [carregando, setCarregando] = useState(false); // Evita cliques duplos

    const toggleTheme = (isDark: boolean): void => {
        setDark(isDark);
        if (isDark) {
            localStorage.setItem('dark', 'true');
        } else {
            localStorage.removeItem('dark');
        }
    };

    const handleCadastro = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setCarregando(true); // Ativa o estado de carregamento
        
        try {
            await axios.post('http://localhost:3000/user/cadastro', {
                nome: nome,
                email: email,
                senha: senha
            });
            toast.success('Usuário criado com sucesso.');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error: any) {
            const status = error.response?.status;
            if (status === 400) return void toast.error("Preencha todos os campos corretamente.");
            if (status === 409) return void toast.error("Usuário já cadastrado.");
            if (status === 401) return void toast.error("Email ou senha inválidos.");
            if (status === 500) return void toast.error("Erro interno no servidor.");
            toast.error("Erro ao conectar com o servidor.");
        } finally {
            setCarregando(false); // Desativa o carregamento independente de dar certo ou errado
        }
    };

    // Suas variáveis de estilo (Adicionei o btnHoverText)
    const themeBg = dark ? 'bg-linear-to-r from-purple-900 to-purple-700' : 'bg-linear-to-r from-rose-400 to-rose-500';
    const navBg = dark ? 'bg-linear-to-tr from-purple-700 to-purple-950 shadow-purple-950/50' : 'bg-linear-to-tr from-rose-500 to-rose-600 shadow-rose-600/50';
    const cardBg = dark ? 'bg-purple-950/40 border-purple-600/55' : 'bg-rose-500/40 border-rose-600/55';
    const shadowColor = dark ? 'shadow-purple-950' : 'shadow-rose-950';
    const btnNavTheme = dark ? 'border-white text-white hover:shadow-white/20' : 'border-black text-black hover:shadow-black/20';
    const inputFocus = dark ? 'focus:outline-purple-400' : 'focus:outline-rose-300';
    const btnHoverText = dark ? 'hover:text-purple-900' : 'hover:text-rose-600'; // Corrigido aqui!

    return (
        <section className={`min-h-screen transition-colors duration-500 ${themeBg} text-white poppins-regular`}>
            <nav className={`w-full h-20 rounded-b-2xl flex items-center justify-between px-8 shadow-2xl transition-all duration-500 ${navBg}`}>
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
                    <button type="button" className={`border-2 rounded-full p-2 px-4 poppins-bold transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer ${dark ? 'border-white text-white' : 'border-black text-black'}`} onClick={() => navigate('/login')}>
                        Entrar
                    </button>
                </div>
            </nav>

            <main className='w-full h-[calc(100vh-80px)] flex items-center justify-center p-4'>
                <div className={`w-full max-w-md bg-opacity-40 border rounded-2xl shadow-2xl p-6 transition-all duration-500 ${cardBg} ${shadowColor}`}>
                    <form className='flex flex-col gap-5' onSubmit={handleCadastro}>
                        <header className='w-full text-center'>
                            <h2 className='text-2xl text-white poppins-extrabold tracking-wide'>Cadastro</h2>
                        </header>

                        <div className='flex flex-col gap-4 text-white'>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="nome" className='poppins-bold text-sm'>Nome</label>
                                <input type="text" id='nome' value={nome} onChange={(e) => setNome(e.target.value)} className={`w-full border border-white/20 rounded p-2.5 text-lg bg-black/10 text-white focus:outline-sm transition-all duration-300 ${inputFocus}`} required placeholder="Seu nome" />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="email" className='poppins-bold text-sm'>Email</label>
                                <input type="email" id='email' value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full border border-white/20 rounded p-2.5 text-lg bg-black/10 text-white focus:outline-sm transition-all duration-300 ${inputFocus}`} required placeholder="seu@email.com" />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="senha" className='poppins-bold text-sm'>Senha</label>
                                <input type="password" id='senha' value={senha} onChange={(e) => setSenha(e.target.value)} className={`w-full border border-white/20 rounded p-2.5 text-lg bg-black/10 text-white focus:outline-sm transition-all duration-300 ${inputFocus}`} required placeholder="••••••••" />
                            </div>

                            <button 
                                className={`w-full border border-white/40 bg-white/10 p-2.5 rounded text-xl poppins-extrabold cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 hover:bg-white ${btnHoverText} focus:outline-none mt-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`} 
                                type='submit'
                                disabled={carregando}
                            >
                                {carregando ? 'Cadastrando...' : 'Cadastrar'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <ToastContainer theme={dark ? 'dark' : 'light'} position="top-right" autoClose={3000} />
        </section>
    );
}

export default Cadastro;
