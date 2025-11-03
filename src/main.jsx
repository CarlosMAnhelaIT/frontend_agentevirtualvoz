import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { 
  LayoutDashboard, 
  FileText, 
  Phone, 
  MessageCircle, 
  Repeat, 
  CheckCircle, 
  Search, 
  Bell,
  Users,
  BarChart3
} from 'lucide-react';

// Importar los nuevos componentes de vista
import AgentCreationView from './components/AgentCreationView';
import Llamadas from './components/Llamadas'; // Asegurarse de que Llamadas se importa desde su archivo

// --- Componente Principal ---

export default function App() {
  const [view, setView] = useState('creation'); // Vistas: 'creation', 'call'
  const [agentName, setAgentName] = useState('AseguraIA');
  const [systemPrompt, setSystemPrompt] = useState(
    'Eres un agente de seguros por voz llamado AseguraIA. Tu objetivo es ayudar a los clientes a encontrar el seguro perfecto. Responde de forma concisa, amigable y profesional. Haz preguntas para guiar la conversación. No respondas en formato Markdown. Eres una IA de voz, tus respuestas deben ser naturales para ser escuchadas.'
  );

  return (
    <div className="flex h-screen w-full bg-gray-100 font-sans">
      <Sidebar currentView={view} setView={setView} agentName={agentName} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
          {view === 'creation' && 
            <AgentCreationView 
              agentName={agentName} 
              setAgentName={setAgentName} 
              systemPrompt={systemPrompt} 
              setSystemPrompt={setSystemPrompt} 
            />}
          {view === 'call' && 
            <Llamadas 
              agentName={agentName} 
              systemPrompt={systemPrompt} 
            />}
        </main>
      </div>
    </div>
  );
}

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
    <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-2xl">
      <div className="p-6 text-center border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white tracking-wider">Agent Platform</h1>
        <p className="text-xs text-gray-400">Creador de Agentes</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <NavButton
          viewName="creation"
          icon={LayoutDashboard}
          label="Creación del Agente"
        />
        <NavButton
          viewName="call"
          icon={Phone}
          label="Llamadas"
        />
      </nav>
      <div className="p-4 border-t border-gray-700 text-center">
          <p className="text-sm font-semibold text-white">Agente Actual:</p>
          <p className="text-sm text-blue-300 truncate">{agentName}</p>
      </div>
    </aside>
  );
}

function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 p-4 flex justify-between items-center">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
        />
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
