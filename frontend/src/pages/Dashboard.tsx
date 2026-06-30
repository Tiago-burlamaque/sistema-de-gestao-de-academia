import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Calendar, Apple, LogOut, Plus, Trash2, 
  ChevronRight, Dumbbell, Clock, Utensils, CheckCircle2,
  AlertCircle, Activity, ShieldAlert
} from 'lucide-react';

interface Paciente {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  dataNascimento: string;
  pesoAtual: number;
  altura: number;
  objetivo: string;
  status: string;
}

interface Refeicao {
  id?: number;
  tipo: string;
  descricao: string;
}

interface PlanoAlimentar {
  id: number;
  nomePlano: string;
  caloriasDiarias: number;
  objetivo: string;
  observacao?: string;
  refeicoes: Refeicao[];
}

interface Consulta {
  id: number;
  data: string;
  status: string;
  observacao?: string;
}

const API_BASE_URL = 'http://localhost:3000';

const SUGESTOES_ALIMENTOS = {
  Proteínas: [
    { nome: 'Ovos cozidos', g: 13, carbo: 1, prot: 13, gord: 11 },
    { nome: 'Peito de frango grelhado', g: 31, carbo: 0, prot: 31, gord: 3 },
    { nome: 'Patinho moído', g: 26, carbo: 0, prot: 26, gord: 7 },
    { nome: 'Whey Protein', g: 24, carbo: 2, prot: 24, gord: 1 },
    { nome: 'Iogurte natural', g: 4, carbo: 5, prot: 4, gord: 3 }
  ],
  Carboidratos: [
    { nome: 'Cuscuz', g: 23, carbo: 23, prot: 2, gord: 0 },
    { nome: 'Arroz integral', g: 25, carbo: 25, prot: 3, gord: 1 },
    { nome: 'Batata doce', g: 20, carbo: 20, prot: 2, gord: 0 },
    { nome: 'Aveia em flocos', g: 57, carbo: 57, prot: 14, gord: 7 },
    { nome: 'Pão integral', g: 22, carbo: 22, prot: 4, gord: 1 },
    { nome: 'Banana', g: 23, carbo: 23, prot: 1, gord: 0 }
  ],
  Gorduras: [
    { nome: 'Pasta de amendoim', g: 50, carbo: 20, prot: 25, gord: 50 },
    { nome: 'Azeite de oliva', g: 100, carbo: 0, prot: 0, gord: 100 },
    { nome: 'Castanhas', g: 54, carbo: 12, prot: 15, gord: 54 },
    { nome: 'Abacate', g: 15, carbo: 8, prot: 2, gord: 15 }
  ]
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [dark] = useState<boolean>(() => localStorage.getItem('dark') === 'true' || true);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  
  const [alunoSelecionado, setAlunoSelecionado] = useState<Paciente | null>(null);
  const [activeTab, setActiveTab] = useState<'consultas' | 'dieta'>('consultas');
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [planos, setPlanos] = useState<PlanoAlimentar[]>([]);
  const [refeicaoFocada, setRefeicaoFocada] = useState<number>(0);

  const [macrosEstimados, setMacrosEstimados] = useState({ prot: 65, carbo: 110, gord: 40 });

  const [formData, setFormData] = useState({
    nome: '', telefone: '', email: '', dataNascimento: '',
    pesoAtual: '', altura: '', objetivo: 'SAUDE', observacao: ''
  });

  const [novaConsulta, setNovaConsulta] = useState({ data: '', observacao: '' });
  const [novoPlano, setNovoPlano] = useState({ nomePlano: '', caloriasDiarias: '2000', objetivo: 'HIPERTROFIA', observacao: '' });
  const [refeicoesPlano, setRefeicoesPlano] = useState<Refeicao[]>([
    { tipo: '🌅 Café da Manhã', descricao: '' },
    { tipo: '☀️ Almoço', descricao: '' },
    { tipo: '☕ Lanche da Tarde', descricao: '' },
    { tipo: '🌙 Jantar', descricao: '' }
  ]);

  const carregarPacientes = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/paciente/listar`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data?.pacientes) {
        const ativos = response.data.pacientes.filter((p: Paciente) => p.status === 'ATIVO');
        setPacientes(ativos);
      }
    } catch (error) {
      console.error("Erro ao listar pacientes:", error);
      setPacientes([]);
    }
  };

  const carregarDadosDoAluno = async (pacienteId: number) => {
    try {
      const token = localStorage.getItem('token');
      const resConsultas = await axios.get(`${API_BASE_URL}/consulta/paciente/${pacienteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConsultas(resConsultas.data?.consultas || []);

      const resPlanos = await axios.get(`${API_BASE_URL}/plano-alimentar/paciente/${pacienteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlanos(resPlanos.data?.planos || []);
    } catch (error) {
      console.error(error);
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

  const handleInativarPaciente = async (id: number, nome: string): Promise<void> => {
    if (!window.confirm(`Tem certeza que deseja remover o aluno ${nome}?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE_URL}/paciente/inativar/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Aluno removido!');
      void carregarPacientes();
    } catch (error: any) {
      console.error("Erro ao inativar aluno:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Erro ao remover aluno.');
    }
  };

  const handleSalvarConsulta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alunoSelecionado) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/consulta/agendar`, {
        pacienteId: alunoSelecionado.id,
        data: novaConsulta.data,
        observacao: novaConsulta.observacao
      }, { headers: { Authorization: `Bearer ${token}` } });

      toast.success('Consulta agendada!');
      setNovaConsulta({ data: '', observacao: '' });
      void carregarDadosDoAluno(alunoSelecionado.id);
    } catch (error) {
      toast.error('Erro ao agendar.');
    }
  };

  const toggleStatusConsulta = async (consultaId: number, statusAtual: string) => {
    const proximosStatus: Record<string, string> = {
      'AGENDADA': 'REALIZADA',
      'REALIZADA': 'CANCELADA',
      'CANCELADA': 'AGENDADA'
    };
    const novoStatus = proximosStatus[statusAtual] || 'AGENDADA';
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE_URL}/consulta/status/${consultaId}`, { status: novoStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Status alterado para ${novoStatus}!`);
      if (alunoSelecionado) void carregarDadosDoAluno(alunoSelecionado.id);
    } catch (error) {
      toast.error('Erro ao atualizar status.');
    }
  };

  const handleSalvarPlano = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alunoSelecionado) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/plano-alimentar/criar`, {
        pacienteId: alunoSelecionado.id,
        ...novoPlano,
        caloriasDiarias: parseInt(novoPlano.caloriasDiarias),
        refeicoes: refeicoesPlano.filter(r => r.descricao.trim() !== '')
      }, { headers: { Authorization: `Bearer ${token}` } });

      toast.success('Plano alimentar salvo!');
      setNovoPlano({ nomePlano: '', caloriasDiarias: '2000', objetivo: 'HIPERTROFIA', observacao: '' });
      setRefeicoesPlano([
        { tipo: '🌅 Café da Manhã', descricao: '' },
        { tipo: '☀️ Almoço', descricao: '' },
        { tipo: '☕ Lanche da Tarde', descricao: '' },
        { tipo: '🌙 Jantar', descricao: '' }
      ]);
      setMacrosEstimados({ prot: 45, carbo: 80, gord: 30 });
      void carregarDadosDoAluno(alunoSelecionado.id);
    } catch (error) {
      toast.error('Erro ao criar plano.');
    }
  };

  const adicionarAlimentoNaDescricao = (alimento: any) => {
    const novas = [...refeicoesPlano];
    const textoAtual = novas[refeicaoFocada].descricao;
    novas[refeicaoFocada].descricao = textoAtual ? `${textoAtual}, ${alimento.nome}` : alimento.nome;
    setRefeicoesPlano(novas);

    setMacrosEstimados(prev => ({
      prot: Math.min(prev.prot + alimento.prot, 180),
      carbo: Math.min(prev.carbo + alimento.carbo, 300),
      gord: Math.min(prev.gord + alimento.gord, 90)
    }));
  };

  const handleSalvarPaciente = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/paciente/cadastro`, {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        dataNascimento: formData.dataNascimento,
        pesoAtual: parseFloat(formData.pesoAtual),
        altura: parseFloat(formData.altura),
        objetivo: formData.objetivo,
        observacao: formData.observacao
      }, { headers: { Authorization: `Bearer ${token}` } });

      toast.success('Aluno cadastrado!');
      setShowModal(false);
      setFormData({ nome: '', telefone: '', email: '', dataNascimento: '', pesoAtual: '', altura: '', objetivo: 'SAUDE', observacao: '' });
      void carregarPacientes();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Erro ao cadastrar membro.');
    }
  };

  const totalCaloriasAtuais = (macrosEstimados.prot * 4) + (macrosEstimados.carbo * 4) + (macrosEstimados.gord * 9);

  const themeBg = dark ? 'bg-slate-950 text-slate-50' : 'bg-slate-50 text-slate-900';
  const cardBg = dark ? 'bg-slate-900/60 border-slate-800/80 backdrop-blur-md' : 'bg-white border-slate-200/80 shadow-sm';
  const inputStyle = dark ? 'bg-slate-950 border-slate-800 text-white focus:border-purple-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500';

  return (
    <section className={`min-h-screen ${themeBg} flex antialiased transition-colors duration-300`}>
      <ToastContainer position="top-right" autoClose={2500} theme={dark ? 'dark' : 'light'} />
      
      <aside className={`w-72 fixed h-full top-0 left-0 border-r flex flex-col justify-between p-6 z-40 ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 p-2.5 rounded-xl text-white shadow-lg shadow-purple-600/30">
              <Dumbbell size={22} />
            </div>
            <h1 className='text-xl font-black tracking-tight'>Gym<span className="text-purple-500">Gestão</span></h1>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">Menu Principal</p>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-purple-600 text-white shadow-lg shadow-purple-600/10 border-0 text-left w-full cursor-pointer">
              <Users size={18} /> Painel Geral
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => setShowModal(true)} 
            className='w-full bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-xl text-sm font-bold cursor-pointer border border-slate-700/50 flex items-center justify-center gap-2 transition-all'
          >
            <Plus size={16} /> Novo Aluno
          </button>
          <button 
            onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} 
            className='w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-3 rounded-xl text-sm font-bold cursor-pointer border-0 flex items-center justify-center gap-2 transition-all'
          >
            <LogOut size={16} /> Desconectar
          </button>
        </div>
      </aside>

      <main className='flex-1 pl-80 pr-8 py-8 flex flex-col gap-8 w-full max-w-[1600px]'>
        <section className={`p-4 border rounded-2xl flex items-center justify-between overflow-hidden relative ${dark ? 'bg-purple-950/20 border-purple-500/20' : 'bg-purple-50 border-purple-200'}`}>
          <div className="absolute top-0 left-0 w-2 h-full bg-purple-500" />
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight">Consultas de Hoje</h3>
              <p className="text-xs text-slate-400 font-medium">Acompanhamento e atualizações em tempo real das agendas de hoje.</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-purple-500 text-white font-extrabold text-[11px] rounded-full uppercase tracking-wider">
            Painel Ativo
          </span>
        </section>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-6 border rounded-2xl ${cardBg}`}>
          <h2 className='text-lg font-bold mb-4 flex items-center gap-2'>👥 Quadro Geral de Membros</h2>
          {pacientes.length === 0 ? (
            <p className='text-slate-400 text-sm py-8 text-center'>Nenhum aluno ativo mapeado no sistema.</p>
          ) : (
            <div className='overflow-x-auto w-full rounded-xl'>
              <table className='w-full text-left border-collapse'>
                <thead>
                  <tr className="border-b border-slate-700/20 font-bold text-xs text-slate-400 uppercase">
                    <th className='pb-3 pl-4'>Nome</th>
                    <th className='pb-3 hidden sm:table-cell'>E-mail</th>
                    <th className='pb-3'>Objetivo</th>
                    <th className='pb-3 text-right pr-4'>Ações</th>
                  </tr>
                </thead>
                <tbody className='text-sm font-medium'>
                  {pacientes.map((paciente) => (
                    <tr key={paciente.id} className={`border-b last:border-0 ${dark ? 'border-slate-800/40 hover:bg-slate-800/30' : 'border-slate-100 hover:bg-slate-50'} transition-all`}>
                      <td className='py-4 pl-4 font-semibold'>{paciente.nome}</td>
                      <td className='py-4 text-slate-400 hidden sm:table-cell'>{paciente.email}</td>
                      <td className='py-4'>
                        <span className='px-2.5 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-xs font-bold border border-purple-500/10'>
                          {paciente.objetivo}
                        </span>
                      </td>
                      <td className='py-4 text-right pr-4'>
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => { setAlunoSelecionado(paciente); carregarDadosDoAluno(paciente.id); }}
                            className='bg-purple-600 hover:bg-purple-700 text-white border-0 cursor-pointer text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1 transition-all'
                          >
                            Painel <ChevronRight size={14} />
                          </button>
                          <button 
                            onClick={() => handleInativarPaciente(paciente.id, paciente.nome)}
                            className='bg-transparent text-slate-400 hover:text-red-500 hover:bg-red-500/10 border-0 cursor-pointer p-2 rounded-xl transition-all'
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>

      <AnimatePresence>
        {showModal && (
          <div className='fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-lg p-6 rounded-2xl border flex flex-col gap-4 shadow-2xl ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              <header className='flex justify-between items-center border-b pb-3 border-slate-700/20'>
                <h2 className='text-lg font-bold text-purple-500'>Adicionar Membro</h2>
                <button onClick={() => setShowModal(false)} className='text-slate-400 text-xl cursor-pointer bg-transparent border-0'>&times;</button>
              </header>
              <form onSubmit={handleSalvarPaciente} className='flex flex-col gap-3.5 max-h-[70vh] overflow-y-auto pr-1'>
                <div className='flex flex-col gap-1'>
                  <label className='text-xs font-bold text-slate-400'>Nome Completo</label>
                  <input type="text" onChange={e => setFormData(prev => ({...prev, nome: e.target.value}))} required className={`border rounded-xl p-2.5 text-sm focus:outline-none transition-all ${inputStyle}`} />
                </div>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='flex flex-col gap-1'>
                    <label className='text-xs font-bold text-slate-400'>E-mail</label>
                    <input type="email" onChange={e => setFormData(prev => ({...prev, email: e.target.value}))} required className={`border rounded-xl p-2.5 text-sm focus:outline-none ${inputStyle}`} />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='text-xs font-bold text-slate-400'>Telefone</label>
                    <input type="text" onChange={e => setFormData(prev => ({...prev, telefone: e.target.value}))} required className={`border rounded-xl p-2.5 text-sm focus:outline-none ${inputStyle}`} />
                  </div>
                </div>
                <div className='grid grid-cols-3 gap-3'>
                  <div className='flex flex-col gap-1'>
                    <label className='text-xs font-bold text-slate-400'>Nascimento</label>
                    <input type="date" onChange={e => setFormData(prev => ({...prev, dataNascimento: e.target.value}))} required className={`border rounded-xl p-2.5 text-sm focus:outline-none ${inputStyle}`} />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='text-xs font-bold text-slate-400'>Peso (kg)</label>
                    <input type="number" step="0.1" onChange={e => setFormData(prev => ({...prev, pesoAtual: e.target.value}))} required className={`border rounded-xl p-2.5 text-sm focus:outline-none ${inputStyle}`} />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='text-xs font-bold text-slate-400'>Altura (m)</label>
                    <input type="number" step="0.01" onChange={e => setFormData(prev => ({...prev, altura: e.target.value}))} required className={`border rounded-xl p-2.5 text-sm focus:outline-none ${inputStyle}`} />
                  </div>
                </div>
                <div className='flex flex-col gap-1'>
                  <label className='text-xs font-bold text-slate-400'>Objetivo Estratégico</label>
                  <select onChange={e => setFormData(prev => ({...prev, objetivo: e.target.value}))} className={`border rounded-xl p-2.5 text-sm focus:outline-none ${inputStyle}`}>
                    <option value="SAUDE">Saúde / Bem-estar</option>
                    <option value="EMAGRECIMENTO">Déficit / Emagrecimento</option>
                    <option value="HIPERTROFIA">Superávit / Hipertrofia</option>
                    <option value="PERFORMANCE">Performance Esportiva</option>
                  </select>
                </div>
                <div className='flex justify-end gap-2 pt-3 border-t border-slate-700/20'>
                  <button type="button" onClick={() => setShowModal(false)} className='px-4 py-2 bg-transparent text-slate-400 border-0 cursor-pointer text-sm font-medium'>Cancelar</button>
                  <button type="submit" className='px-5 py-2 bg-purple-600 text-white rounded-xl border-0 text-sm font-bold cursor-pointer'>Confirmar</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {alunoSelecionado && (
          <div className='fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
            <motion.div 
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
              className={`w-full max-w-6xl p-6 rounded-3xl border flex flex-col gap-5 max-h-[90vh] overflow-hidden shadow-2xl ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              <header className='flex justify-between items-center border-b pb-3 border-slate-700/20'>
                <div>
                  <h2 className='text-xl font-extrabold text-purple-500 tracking-tight'>{alunoSelecionado.nome}</h2>
                  <p className='text-xs text-slate-400 font-semibold mt-0.5'>ID do Aluno: #{alunoSelecionado.id}</p>
                </div>
                <button onClick={() => setAlunoSelecionado(null)} className='text-slate-400 text-2xl cursor-pointer bg-transparent border-0'>&times;</button>
              </header>

              <div className='flex gap-1 bg-slate-500/10 p-1.5 rounded-2xl self-start'>
                <button 
                  onClick={() => setActiveTab('consultas')} 
                  className={`px-5 py-2 border-0 rounded-xl cursor-pointer font-bold text-xs transition-all flex items-center gap-1.5 ${activeTab === 'consultas' ? 'bg-purple-600 text-white shadow' : 'bg-transparent text-slate-400'}`}
                >
                  <Clock size={14} /> Consultas & Agenda
                </button>
                <button 
                  onClick={() => setActiveTab('dieta')} 
                  className={`px-5 py-2 border-0 rounded-xl cursor-pointer font-bold text-xs transition-all flex items-center gap-1.5 ${activeTab === 'dieta' ? 'bg-purple-600 text-white shadow' : 'bg-transparent text-slate-400'}`}
                >
                  <Utensils size={14} /> Prescrição Dietética
                </button>
              </div>

              <div className='flex-1 overflow-y-auto pr-1 flex flex-col gap-6'>
                {activeTab === 'consultas' ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <form onSubmit={handleSalvarConsulta} className='flex flex-col gap-3.5 p-5 border rounded-2xl border-slate-700/10 bg-slate-500/5 h-fit'>
                      <h3 className='text-sm font-bold text-purple-400'>Agendar Nova Consulta</h3>
                      <div className='flex flex-col gap-1'>
                        <label className='text-xs text-slate-400 font-semibold'>Data e Horário</label>
                        <input type="datetime-local" value={novaConsulta.data} onChange={e => setNovaConsulta(prev => ({...prev, data: e.target.value}))} required className={`border rounded-xl p-2.5 text-sm focus:outline-none ${inputStyle}`} />
                      </div>
                      <div className='flex flex-col gap-1'>
                        <label className='text-xs text-slate-400 font-semibold'>Anotações Internas</label>
                        <textarea rows={3} value={novaConsulta.observacao} onChange={e => setNovaConsulta(prev => ({...prev, observacao: e.target.value}))} className={`border rounded-xl p-2.5 text-sm resize-none focus:outline-none ${inputStyle}`} />
                      </div>
                      <button type="submit" className='bg-purple-600 hover:bg-purple-700 text-white p-2.5 rounded-xl text-xs border-0 cursor-pointer font-black mt-1 tracking-wider uppercase transition-all'>Salvar na Agenda</button>
                    </form>

                    <div className='flex flex-col gap-3'>
                      <h3 className='text-sm font-bold text-slate-400'>Linha do Tempo (Clique nos Status para alterar)</h3>
                      {consultas.length === 0 ? <p className='text-xs text-slate-500 py-6 text-center border border-dashed rounded-2xl border-slate-700/20'>Nenhum registro agendado.</p> : (
                        consultas.map(c => (
                          <div key={c.id} className={`p-4 border rounded-2xl flex justify-between items-center ${dark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                            <div>
                              <p className='font-bold text-purple-400 text-sm'>{new Date(c.data).toLocaleString('pt-BR').slice(0,-3)}</p>
                              <p className='text-slate-400 text-xs mt-1 font-medium'>{c.observacao || "Sem notas."}</p>
                            </div>
                            <button 
                              onClick={() => toggleStatusConsulta(c.id, c.status)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer border transition-all ${
                                c.status === 'REALIZADA' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                c.status === 'CANCELADA' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                                'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              }`}
                            >
                              {c.status}
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
                    <form onSubmit={handleSalvarPlano} className='lg:col-span-7 flex flex-col gap-4 p-5 border rounded-2xl border-slate-700/10 bg-slate-500/5'>
                      <h3 className='text-sm font-bold text-purple-400'>Montagem Dinâmica de Cardápio</h3>
                      <div className='grid grid-cols-2 gap-3'>
                        <div className='flex flex-col gap-1'>
                          <label className='text-xs text-slate-400 font-semibold'>Nome Estratégico</label>
                          <input 
                            type="text" 
                            placeholder="Ex: Protocolo Cutting" 
                            value={novoPlano.nomePlano} 
                            onChange={e => setNovoPlano(prev => ({...prev, nomePlano: e.target.value}))} 
                            required 
                            className={`border rounded-xl p-2.5 text-sm focus:outline-none ${inputStyle}`} 
                          />
                        </div>
                        <div className='flex flex-col gap-1'>
                          <label className='text-xs text-slate-400 font-semibold'>Meta de Calorias (kcal)</label>
                          <input 
                            type="number" 
                            value={novoPlano.caloriasDiarias} 
                            onChange={e => setNovoPlano(prev => ({...prev, caloriasDiarias: e.target.value}))} 
                            required 
                            className={`border rounded-xl p-2.5 text-sm focus:outline-none ${inputStyle}`} 
                          />
                        </div>
                      </div>

                      <div className='flex flex-col gap-3 my-2'>
                        <label className='text-xs text-slate-400 font-bold uppercase tracking-wider'>Refeições do Protocolo</label>
                        {refeicoesPlano.map((refeicao, index) => (
                          <div key={index} className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-purple-400">{refeicao.tipo}</span>
                            <textarea
                              rows={2}
                              value={refeicao.descricao}
                              onFocus={() => setRefeicaoFocada(index)}
                              onChange={e => {
                                const novas = [...refeicoesPlano];
                                novas[index].descricao = e.target.value;
                                setRefeicoesPlano(novas);
                              }}
                              placeholder="Selecione alimentos ao lado ou digite aqui..."
                              className={`border rounded-xl p-2.5 text-sm resize-none focus:outline-none ${refeicaoFocada === index ? 'border-purple-500 ring-1 ring-purple-500/20' : ''} ${inputStyle}`}
                            />
                          </div>
                        ))}
                      </div>

                      <button type="submit" className='bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl text-xs border-0 cursor-pointer font-black tracking-wider uppercase transition-all mt-2'>
                        Definir Plano Alimentar
                      </button>
                    </form>

                    <div className='lg:col-span-5 flex flex-col gap-5'>
                      <div className={`p-4 border rounded-2xl ${dark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Estimativa de Macros Atuais</h4>
                        <div className="flex flex-col gap-3">
                          <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                              <span>Proteínas</span>
                              <span className="text-purple-400">{macrosEstimados.prot}g / 180g</span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div className="bg-purple-500 h-full transition-all duration-300" style={{ width: `${(macrosEstimados.prot / 180) * 100}%` }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                              <span>Carboidratos</span>
                              <span className="text-amber-500">{macrosEstimados.carbo}g / 300g</span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${(macrosEstimados.carbo / 300) * 100}%` }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                              <span>Gorduras</span>
                              <span className="text-emerald-500">{macrosEstimados.gord}g / 90g</span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${(macrosEstimados.gord / 90) * 100}%` }} />
                            </div>
                          </div>
                          <div className="border-t border-slate-700/20 pt-2 flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400">Total Estimado:</span>
                            <span className="text-sm font-black text-purple-400">{totalCaloriasAtuais} kcal</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col gap-3 max-h-[40vh] overflow-y-auto pr-1">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Alimentos Recomendados (Clique para inserir)</h4>
                        {Object.entries(SUGESTOES_ALIMENTOS).map(([categoria, lista]) => (
                          <div key={categoria} className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wide">{categoria}</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {lista.map((alimento, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => adicionarAlimentoNaDescricao(alimento)}
                                  className={`p-2.5 border text-left rounded-xl text-xs font-semibold cursor-pointer transition-all flex flex-col gap-0.5 ${dark ? 'bg-slate-950/40 border-slate-800 hover:border-purple-500/50 hover:bg-slate-900' : 'bg-slate-50 border-slate-200 hover:border-purple-500 hover:bg-purple-50/30'}`}
                                >
                                  <span className="font-bold">{alimento.nome}</span>
                                  <span className="text-[10px] text-slate-400">P: {alimento.prot}g | C: {alimento.carbo}g | G: {alimento.gord}g</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}