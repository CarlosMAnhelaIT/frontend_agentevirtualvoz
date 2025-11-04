import React, { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bug, Clock, CheckCircle, AlertCircle } from 'lucide-react';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Incidencias = () => {
    const [incidencias, setIncidencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mock AWS Lambda URL
    const MOCK_LAMBDA_URL = 'https://mock-api.com/incidencias'; 

    useEffect(() => {
        const fetchIncidencias = async () => {
            setLoading(true);
            setError(null);
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000)); 

                // Mock data
                const mockData = [
                    { id: '001', type: 'Error de Sistema', status: 'Abierta', date: '2023-10-26', priority: 'Alta' },
                    { id: '002', type: 'Fallo de Conexión', status: 'Cerrada', date: '2023-10-25', priority: 'Media' },
                    { id: '003', type: 'Consulta de Datos', status: 'En Progreso', date: '2023-10-27', priority: 'Baja' },
                    { id: '004', type: 'Error de Sistema', status: 'Abierta', date: '2023-10-28', priority: 'Alta' },
                    { id: '005', type: 'Fallo de Conexión', status: 'Cerrada', date: '2023-10-27', priority: 'Media' },
                    { id: '006', type: 'Error de Sistema', status: 'Abierta', date: '2023-10-29', priority: 'Alta' },
                    { id: '007', type: 'Consulta de Datos', status: 'Cerrada', date: '2023-10-28', priority: 'Baja' },
                    { id: '008', type: 'Fallo de Conexión', status: 'En Progreso', date: '2023-10-30', priority: 'Media' },
                    { id: '009', type: 'Error de Sistema', status: 'Abierta', date: '2023-10-31', priority: 'Alta' },
                    { id: '010', type: 'Consulta de Datos', status: 'Cerrada', date: '2023-10-30', priority: 'Baja' },
                ];
                setIncidencias(mockData);
            } catch (err) {
                setError('Error al cargar las incidencias.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchIncidencias();
    }, []);

    // --- Data Processing for Charts and KPIs ---
    const totalIncidencias = incidencias.length;
    const incidenciasAbiertas = incidencias.filter(inc => inc.status === 'Abierta').length;
    const incidenciasCerradas = incidencias.filter(inc => inc.status === 'Cerrada').length;
    const incidenciasEnProgreso = incidencias.filter(inc => inc.status === 'En Progreso').length;

    const incidenciasPorTipo = incidencias.reduce((acc, inc) => {
        acc[inc.type] = (acc[inc.type] || 0) + 1;
        return acc;
    }, {});

    const incidenciasPorEstado = incidencias.reduce((acc, inc) => {
        acc[inc.status] = (acc[inc.status] || 0) + 1;
        return acc;
    }, {});

    // Chart Data
    const barChartData = {
        labels: Object.keys(incidenciasPorTipo),
        datasets: [
            {
                label: 'Número de Incidencias',
                data: Object.values(incidenciasPorTipo),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                borderWidth: 1,
            },
        ],
    };

    const doughnutChartData = {
        labels: Object.keys(incidenciasPorEstado),
        datasets: [
            {
                data: Object.values(incidenciasPorEstado),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#333',
                },
            },
            title: {
                display: true,
                text: 'Incidencias por Tipo',
                color: '#333',
                font: {
                    size: 16,
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: '#666',
                },
                grid: {
                    color: 'rgba(0,0,0,0.05)',
                },
            },
            y: {
                ticks: {
                    color: '#666',
                    beginAtZero: true,
                },
                grid: {
                    color: 'rgba(0,0,0,0.05)',
                },
            },
        },
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: '#333',
                },
            },
            title: {
                display: true,
                text: 'Incidencias por Estado',
                color: '#333',
                font: {
                    size: 16,
                },
            },
        },
    };


    if (loading) return <div className="p-6 text-center text-gray-600">Cargando incidencias...</div>;
    if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

    return (
        <div className="p-2">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel de Incidencias</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* KPI Card: Total Incidencias */}
                <div className="bg-white p-5 rounded-xl shadow-md flex items-center justify-between border border-gray-200">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Incidencias</p>
                        <p className="text-3xl font-bold text-gray-900">{totalIncidencias}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                        <Bug size={24} className="text-blue-600" />
                    </div>
                </div>

                {/* KPI Card: Incidencias Abiertas */}
                <div className="bg-white p-5 rounded-xl shadow-md flex items-center justify-between border border-gray-200">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Incidencias Abiertas</p>
                        <p className="text-3xl font-bold text-gray-900">{incidenciasAbiertas}</p>
                    </div>
                    <div className="p-3 bg-red-100 rounded-full">
                        <AlertCircle size={24} className="text-red-600" />
                    </div>
                </div>

                {/* KPI Card: Incidencias En Progreso */}
                <div className="bg-white p-5 rounded-xl shadow-md flex items-center justify-between border border-gray-200">
                    <div>
                        <p className="text-sm font-medium text-gray-500">En Progreso</p>
                        <p className="text-3xl font-bold text-gray-900">{incidenciasEnProgreso}</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-full">
                        <Clock size={24} className="text-yellow-600" />
                    </div>
                </div>

                {/* KPI Card: Incidencias Cerradas */}
                <div className="bg-white p-5 rounded-xl shadow-md flex items-center justify-between border border-gray-200">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Incidencias Cerradas</p>
                        <p className="text-3xl font-bold text-gray-900">{incidenciasCerradas}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                        <CheckCircle size={24} className="text-green-600" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart: Incidencias por Tipo */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center justify-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Incidencias por Tipo</h2>
                    <div className="relative h-80 w-full">
                        <Bar data={barChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Chart: Incidencias por Estado */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center justify-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Incidencias por Estado</h2>
                    <div className="relative h-80 w-full">
                        <Doughnut data={doughnutChartData} options={doughnutOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Incidencias;
