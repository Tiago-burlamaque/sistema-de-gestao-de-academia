import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/cadastro" replace />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={
          <div className="flex min-h-screen items-center justify-center text-white bg-slate-900">
            <h2 className="text-2xl poppins-bold">Página não encontrada</h2>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;