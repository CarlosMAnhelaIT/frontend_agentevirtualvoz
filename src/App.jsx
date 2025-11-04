import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { 
  Phone, 
  Search, 
  Bell,
  BarChart3,
  BrainCircuit
} from 'lucide-react';

// Importar los nuevos componentes de vista
import Llamadas from './components/Llamadas';
import Incidencias from './components/Incidencias';
import ObjetivosIA from './components/ObjetivosIA';

// --- Componente Principal ---

export default function App() {
  const [view, setView] = useState('call'); // Vistas: 'call', 'incidencias', 'objetivos'
  const [agentName, setAgentName] = useState('LyntiaIA');
  const [systemPrompt, setSystemPrompt] = useState(
    'Eres un agente de IA de Lyntia. Tu objetivo es ayudar a los clientes con soporte técnico. Responde de forma concisa, amigable y profesional. Haz preguntas para guiar la conversación. No respondas en formato Markdown. Eres una IA de voz, tus respuestas deben ser naturales para ser escuchadas.'
  );

  return (
    <div className="flex h-screen w-full bg-gray-100 font-sans">
      <Sidebar currentView={view} setView={setView} agentName={agentName} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
          {view === 'call' && 
            <Llamadas 
              agentName={agentName} 
              systemPrompt={systemPrompt} 
            />}
          {view === 'incidencias' && 
            <Incidencias />}
          {view === 'objetivos' &&
            <ObjetivosIA />}
        </main>
      </div>
    </div>
  );
}

import logo from './assets/Lyntia.png';

// --- Componentes de Navegación ---

function Sidebar({ currentView, setView, agentName }) {
  const NavButton = ({ viewName, icon: Icon, label }) => {
    const isActive = currentView === viewName;
    return (
      <button
        onClick={() => setView(viewName)}
        className={`flex items-center w-full space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
            isActive
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}>
        <Icon size={20} />
        <span>{label}</span>
      </button>
    );
  };

  return (
    <aside className="w-64 bg-white text-gray-800 flex flex-col shadow-2xl border-r border-gray-200">
      <div className="p-6 text-center border-b border-gray-200">
        <img src={logo} alt="Lyntia Logo" className="w-40 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-gray-800 tracking-wider">Plataforma de Agentes Virtuales</h1>
        <p className="text-xs text-gray-500">Prototipo de MVP</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <NavButton
          viewName="call"
          icon={Phone}
          label="Llamada en Vivo"
        />
        <NavButton
          viewName="incidencias"
          icon={BarChart3}
          label="Panel de Incidencias"
        />
        <NavButton
          viewName="objetivos"
          icon={BrainCircuit}
          label="Capacidades de la IA"
        />
      </nav>
      <div className="p-4 border-t border-gray-200 text-center">
          <p className="text-sm font-semibold text-gray-700">Agente Actual:</p>
          <p className="text-sm text-blue-600 truncate">{agentName}</p>
      </div>
    </aside>
  );
}

function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 p-4 flex justify-end items-center">
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell size={20} />
        </button>
        <div className="flex items-center space-x-2">
          <img
            src="https://placehold.co/40x40/E2E8F0/4A5568?text=A"
            alt="Avatar de usuario"
            className="w-8 h-8 rounded-full border-2 border-gray-300"
          />
          <span className="hidden md:block text-sm font-medium text-gray-700">Admin</span>
        </div>
      </div>
    </header>
  );
}