import Llamadas from './components/Llamadas.jsx';
import React, { useState } from 'react';
import './index.css';
import { 
  LayoutDashboard, 
  Ticket, 
  Phone, 
  MessageCircle, 
  Repeat, 
  CheckCircle, 
  Search, 
  Bell,
  Users,
  BarChart3
} from 'lucide-react';

// --- Datos de Muestra (Mock Data) ---

const mockMetrics = {
  conversations: '1,234',
  messages: '15,678',
  avgIterations: '4.2',
  resolutionRate: '89%',
  activeAgents: '3',
};

const mockTickets = [
  { id: 'T-12345', client: 'Ana García', product: 'Seguro de Auto - Premium', status: 'Nuevo', date: '2025-10-31', agent: 'IA' },
  { id: 'T-12346', client: 'Carlos Rodríguez', product: 'Seguro de Hogar - Básico', status: 'En Proceso', date: '2025-10-30', agent: 'Juan P.' },
  { id: 'T-12347', client: 'Luisa Fernández', product: 'Seguro de Vida - Completo', status: 'Completado', date: '2025-10-30', agent: 'IA' },
  { id: 'T-12348', client: 'Miguel Torres', product: 'Seguro de Auto - Básico', status: 'Nuevo', date: '2025-10-31', agent: 'IA' },
  { id: 'T-12349', client: 'Sofía Morales', product: 'Seguro de Viaje - Internacional', status: 'En Proceso', date: '2025-10-29', agent: 'Laura G.' },
  { id: 'T-12350', client: 'Javier Gómez', product: 'Seguro de Hogar - Premium', status: 'Completado', date: '2025-10-28', agent: 'IA' },
];

// --- Componente Principal ---

export default function App() {
  const [view, setView] = useState('metrics'); // 'metrics' o 'tickets'

  return (
    <div className="flex h-screen w-full bg-gray-100 font-sans">
      {/* Sidebar: Barra de navegación lateral */}
      <Sidebar currentView={view} setView={setView} />

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header: Barra superior */}
        <Header />

        {/* Área de contenido (cambia según la vista) */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
          {view === 'metrics' && <MetricsDashboard />}
          {view === 'tickets' && <TicketsView />}
          {view === 'llamadas' && <Llamadas />}
        </main>
      </div>
    </div>
  );
}

// --- Componentes de Navegación ---

function Sidebar({ currentView, setView }) {
  const NavButton = ({ viewName, icon: Icon, label }) => {
    const isActive = currentView === viewName;
    return (
      <button
        onClick={() => setView(viewName)}
        className={`
          flex items-center w-full space-x-3 px-4 py-3 rounded-lg text-sm font-medium
          transition-all duration-200
          ${
            isActive
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }
        `}
      >
        <Icon size={20} />
        <span>{label}</span>
      </button>
    );
  };

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-2xl">
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-white tracking-wider">AseguraIA</h1>
        <p className="text-xs text-gray-400">Panel de Agente Virtual</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <NavButton
          viewName="metrics"
          icon={LayoutDashboard}
          label="Métricas"
        />
        <NavButton
          viewName="tickets"
          icon={Ticket}
          label="Tickets"
        />
        <NavButton
          viewName="llamadas"
          icon={Phone}
          label="Llamadas"
        />
      </nav>
      <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-500 text-center">© 2025 Aseguradora Inc.</p>
      </div>
    </aside>
  );
}

function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 p-4 flex justify-between items-center">
      {/* Barra de búsqueda */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Buscar tickets, clientes..."
          className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
        />
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
      
      {/* Iconos de usuario y notificaciones */}
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

// --- Sección: Métricas ---

function MetricsDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Métricas del Agente</h1>
      
      {/* Grid de Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="Conversaciones"
          value={mockMetrics.conversations}
          icon={Phone}
          color="blue"
        />
        <StatCard
          title="Total Mensajes"
          value={mockMetrics.messages}
          icon={MessageCircle}
          color="indigo"
        />
        <StatCard
          title="Iteraciones (Prom.)"
          value={mockMetrics.avgIterations}
          icon={Repeat}
          color="purple"
        />
        <StatCard
          title="Tasa de Resolución"
          value={mockMetrics.resolutionRate}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Agentes Activos"
          value={mockMetrics.activeAgents}
          icon={Users}
          color="yellow"
        />
      </div>

      {/* Grid de Gráficos (Simulados) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartPlaceholder title="Volumen de Llamadas (Últimos 30 días)" className="lg:col-span-2" />
        <ChartPlaceholder title="Temas Principales" />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  const colors = {
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-center space-x-4 transition-all hover:shadow-xl hover:scale-105">
      <div className={`p-3 rounded-full text-white ${colors[color] || 'bg-gray-500'}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function ChartPlaceholder({ title, className = '' }) {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-lg border border-gray-200 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="bg-gray-50 h-64 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-400">
          <BarChart3 size={48} className="mx-auto" />
          <p className="mt-2 text-sm">Datos del gráfico se mostrarían aquí</p>
        </div>
      </div>
    </div>
  );
}

// --- Sección: Tickets ---

function TicketsView() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tickets de Contratación</h1>
      
      {/* Contenedor de la tabla */}
      <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Th>ID Ticket</Th>
                <Th>Cliente</Th>
                <Th>Producto</Th>
                <Th>Estado</Th>
                <Th>Fecha</Th>
                <Th>Agente</Th>
                <Th>Acciones</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                  <Td className="font-mono text-sm">{ticket.id}</Td>
                  <Td className="font-medium">{ticket.client}</Td>
                  <Td>{ticket.product}</Td>
                  <Td>
                    <StatusBadge status={ticket.status} />
                  </Td>
                  <Td className="text-gray-500">{ticket.date}</Td>
                  <Td className="text-gray-500">{ticket.agent}</Td>
                  <Td>
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                      Ver Detalles
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Paginación (Simulada) */}
        <div className="p-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-600">
          <p>Mostrando 1-6 de {mockTickets.length} tickets</p>
          <div className="flex space-x-1">
            <button className="px-3 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-50">Anterior</button>
            <button className="px-3 py-1 rounded-md border border-blue-500 bg-blue-500 text-white">1</button>
            <button className="px-3 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-50">Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helpers para la tabla
const Th = ({ children }) => (
  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const Td = ({ children, className = '' }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-800 ${className}`}>
    {children}
  </td>
);

function StatusBadge({ status }) {
  const statusColors = {
    'Nuevo': 'bg-blue-100 text-blue-800',
    'En Proceso': 'bg-yellow-100 text-yellow-800',
    'Completado': 'bg-green-100 text-green-800',
  };
  
  const colorClasses = statusColors[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses}`}>
      {status}
    </span>
  );
}import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);