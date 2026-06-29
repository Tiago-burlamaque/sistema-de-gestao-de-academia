import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

interface Paciente {
    id: number;
    nome: string;
    telefone: string;
    email: string;
    dataNascimento: string;
    pesoAtual: number;
    altura: number;
    objetivo: string;
}

function Dashboard() {
    const navigate = useNavigate();
    const [dark] = useState<boolean>(() => localStorage.getItem('dark') === 'true');
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    
    const [formData, setFormData] = useState({
        nome: '',
        telefone: '',
        email: '',
        dataNascimento: '',
        pesoAtual: '',
        altura: '',
        objetivo: 'SAUDE',
        observacao: ''
    });

    const carregarPacientes = async (): Promise<void> => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/pacientes', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data && response.data.pacientes) {
                setPacientes(response.data.pacientes);
            }
        } catch (error: unknown) {
            const axiosError = error as any;
            if (axiosError.response?.status !== 404) {
                console.error("Erro ao buscar pacientes:", axiosError);
            }
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            void carregarPacientes();
        }
    }, [navigate]);

    const handleLogout = (): void => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSalvarPaciente = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3000/pacientes', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Aluno cadastrado com sucesso!');
            setShowModal(false);
            setFormData({
                nome: '', telefone: '', email: '', dataNascimento: '',
                pesoAtual: '', altura: '', objetivo: 'SAUDE', observacao: ''
            });
            void carregarPacientes();
        } catch (error: unknown) {
            const axiosError = error as any;
            if (axiosError.response?.status === 409) {
                toast.error('Este e-mail de aluno já está cadastrado.');
            } else {
                toast.error('Erro interno ao salvar paciente.');
            }
        }
    };

    const themeBg = dark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900';
    const cardBg = dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
    const inputStyle = dark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-300 text-slate-900';

    return (
        <section className={`min-h-screen ${themeBg}`}>
            <nav className={`w-full h-20 flex items-center justify-between px-8 shadow-md ${dark ? 'bg-slate-950' : 'bg-white border-b border-slate-200'}`}>
                <h1 className='text-2xl poppins-extrabold text-purple-600'>GymGestão</h1>
                <div className='flex items-center gap-4'>
                    <button type="button" onClick={() => setShowModal(true)} className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm poppins-bold cursor-pointer border-0'>
                        + Novo Aluno
                    </button>
                    <button type="button" onClick={handleLogout} className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm poppins-bold cursor-pointer border-0'>
                        Sair
                    </button>
                </div>
            </nav>

            <main className='p-8 max-w-7xl mx-auto flex flex-col gap-8'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <div className={`p-6 border rounded-xl shadow-md ${cardBg}`}>
                        <h2 className='text-lg poppins-bold mb-2'>Alunos Cadastrados</h2>
                        <p className='text-4xl poppins-black text-purple-500'>{pacientes.length}</p>
                    </div>
                    <div className={`p-6 border rounded-xl shadow-md ${cardBg}`}>
                        <h2 className='text-lg poppins-bold mb-2'>Consultas Ativas</h2>
                        <p className='text-4xl poppins-black text-rose-500'>0</p>
                    </div>
                    <div className={`p-6 border rounded-xl shadow-md ${cardBg}`}>
                        <h2 className='text-lg poppins-bold mb-2'>Planos Prontos</h2>
                        <p className='text-4xl poppins-black text-emerald-500'>0</p>
                    </div>
                </div>

                <div className={`p-6 border rounded-xl shadow-md ${cardBg}`}>
                    <h2 className='text-xl poppins-extrabold mb-4'>Meus Alunos / Pacientes</h2>
                    {pacientes.length === 0 ? (
                        <p className='text-slate-400 text-sm poppins-regular'>Nenhum aluno cadastrado no sistema ainda. Clique em "+ Novo Aluno" para começar.</p>
                    ) : (
                        <div className='overflow-x-auto w-full'>
                            <table className='w-full text-left border-collapse'>
                                <thead>
                                    <tr className={`border-b ${dark ? 'border-slate-700' : 'border-slate-200'} poppins-bold text-sm text-slate-400`}>
                                        <th className='pb-3'>Nome</th>
                                        <th className='pb-3'>E-mail</th>
                                        <th className='pb-3'>Telefone</th>
                                        <th className='pb-3'>Objetivo</th>
                                        <th className='pb-3'>Peso (kg)</th>
                                        <th className='pb-3'>Altura (m)</th>
                                    </tr>
                                </thead>
                                <tbody className='poppins-regular text-sm'>
                                    {pacientes.map((paciente) => (
                                        <tr key={paciente.id} className={`border-b ${dark ? 'border-slate-700/50' : 'border-slate-100'} hover:bg-slate-500/10 transition-all`}>
                                            <td className='py-3 poppins-bold'>{paciente.nome}</td>
                                            <td className='py-3 text-slate-400'>{paciente.email}</td>
                                            <td className='py-3'>{paciente.telefone}</td>
                                            <td className='py-3'><span className='px-2 py-0.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded text-xs'>{paciente.objetivo}</span></td>
                                            <td className='py-3'>{paciente.pesoAtual}</td>
                                            <td className='py-3'>{paciente.altura}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {showModal && (
                <div className='fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50'>
                    <div className={`w-full max-w-lg p-6 rounded-2xl border shadow-2xl flex flex-col gap-4 ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <header className='flex justify-between items-center border-b pb-3 border-slate-700/40'>
                            <h2 className='text-xl poppins-extrabold text-purple-500'>Cadastrar Novo Aluno</h2>
                            <button type="button" onClick={() => setShowModal(false)} className='text-slate-400 hover:text-red-500 text-xl cursor-pointer bg-transparent border-0'>&times;</button>
                        </header>
                        <form onSubmit={handleSalvarPaciente} className='flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1'>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor="nome" className='text-xs poppins-bold text-slate-400'>Nome Completo</label>
                                <input type="text" id="nome" value={formData.nome} onChange={handleInputChange} required className={`border rounded p-2 text-sm w-full focus:outline-none ${inputStyle}`} />
                            </div>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="email" className='text-xs poppins-bold text-slate-400'>E-mail</label>
                                    <input type="email" id="email" value={formData.email} onChange={handleInputChange} required className={`border rounded p-2 text-sm w-full focus:outline-none ${inputStyle}`} />
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="telefone" className='text-xs poppins-bold text-slate-400'>Telefone</label>