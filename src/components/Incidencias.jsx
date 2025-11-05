import React, { useState, useEffect } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { Bug, Clock, CheckCircle, AlertCircle, Smile, Meh, Frown } from 'lucide-react';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

const Incidencias = () => {
    const [incidencias, setIncidencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const LAMBDA_URL = 'https://d772jbrxa2xlfgeqn2b3rky6p40vfprt.lambda-url.eu-west-1.on.aws/';

    useEffect(() => {
        const fetchIncidencias = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(LAMBDA_URL);
                if (!response.ok) {
                    throw new Error('Error al cargar los datos desde la Lambda.');
                }
                const data = await response.json();
                setIncidencias(data);
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
    const incidenciasPorPrioridad = incidencias.reduce((acc, inc) => {
        const priority = inc.prioridad || 'N/A';
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
    }, {});

    const incidenciasPorSentimiento = incidencias.reduce((acc, inc) => {
        const sentiment = inc.overallSentiment || 'Neutral';
        acc[sentiment] = (acc[sentiment] || 0) + 1;
        return acc;
    }, {});

    const incidenciasPorClasificacion = incidencias.reduce((acc, inc) => {
        const clasificacion = inc.clasificacion || 'N/A';
        acc[clasificacion] = (acc[clasificacion] || 0) + 1;
        return acc;
    }, {});

    const incidenciasPorFecha = incidencias.reduce((acc, inc) => {
        const fecha = new Date(inc.createdAt).toLocaleDateString() || 'N/A';
        acc[fecha] = (acc[fecha] || 0) + 1;
        return acc;
    }, {});

    // Chart Data
    const priorityChartData = {
        labels: Object.keys(incidenciasPorPrioridad),
        datasets: [
            {
                label: 'Número de Incidencias',
                data: Object.values(incidenciasPorPrioridad),
                backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB'],
            },
        ],
    };

    const sentimentChartData = {
        labels: Object.keys(incidenciasPorSentimiento),
        datasets: [
            {
                data: Object.values(incidenciasPorSentimiento),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Red, Green, Yellow
            },
        ],
    };

    const classificationChartData = {
        labels: Object.keys(incidenciasPorClasificacion),
        datasets: [
            {
                label: 'Número de Incidencias',
                data: Object.values(incidenciasPorClasificacion),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const dateChartData = {
        labels: Object.keys(incidenciasPorFecha),
        datasets: [
            {
                label: 'Número de Incidencias',
                data: Object.values(incidenciasPorFecha),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                pointBorderColor: '#fff',
                pointHoverRadius: 5,
                tension: 0.1
            },
        ],
    };

    const doughnutChartOptions = (titleText) => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'bottom' },
            title: {
                display: true,
                text: titleText,
                color: '#333',
                font: { size: 16 },
            },
        },
    });

    const barAndLineChartOptions = (titleText) => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: titleText,
                color: '#333',
                font: { size: 16 },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
                grid: {
                    drawBorder: false,
                },
            },
            x: {
                grid: {
                    display: false,
                }
            }
        }
    });

    const getSentimentIcon = (sentiment) => {
        switch (sentiment) {
            case 'Positivo': return <Smile className="text-green-500" />;
            case 'Negativo': return <Frown className="text-red-500" />;
            default: return <Meh className="text-yellow-500" />;
        }
    };

    if (loading) return <div className="p-6 text-center text-gray-600">Cargando incidencias...</div>;
    if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

    return (
        <div className="p-4 md:p-8 bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel Avanzado de Incidencias</h1>
            
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KpiCard title="Total Incidencias" value={totalIncidencias} icon={<Bug size={24} className="text-blue-600" />} />
                <KpiCard title="Prioridad Alta" value={incidenciasPorPrioridad['Alta'] || 0} icon={<AlertCircle size={24} className="text-red-600" />} />
                <KpiCard title="Prioridad Media" value={incidenciasPorPrioridad['Media'] || 0} icon={<Clock size={24} className="text-yellow-600" />} />
                <KpiCard title="Sentimiento Negativo" value={incidenciasPorSentimiento['Negativo'] || 0} icon={<Frown size={24} className="text-red-600" />} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ChartCard title="Incidencias por Prioridad">
                    <Doughnut data={priorityChartData} options={doughnutChartOptions('Distribución por Prioridad')} />
                </ChartCard>
                <ChartCard title="Análisis de Sentimiento Global">
                    <Doughnut data={sentimentChartData} options={doughnutChartOptions('Distribución de Sentimiento')} />
                </ChartCard>
                <ChartCard title="Incidencias por Clasificación">
                    <Bar data={classificationChartData} options={barAndLineChartOptions('Distribución por Clasificación')} />
                </ChartCard>
                <ChartCard title="Incidencias por Fecha">
                    <Line data={dateChartData} options={barAndLineChartOptions('Distribución por Fecha')} />
                </ChartCard>
            </div>

            {/* Incidents Table */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalle de Incidencias</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">Resumen</th>
                                <th scope="col" className="px-6 py-3">Clasificación</th>
                                <th scope="col" className="px-6 py-3">Prioridad</th>
                                <th scope="col" className="px-6 py-3">Sentimiento</th>
                                <th scope="col" className="px-6 py-3">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incidencias.map(inc => (
                                <tr key={inc.incidentId} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{inc.resumenIncidencia}</td>
                                    <td className="px-6 py-4">{inc.clasificacion}</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${inc.prioridad === 'Alta' ? 'bg-red-100 text-red-800' : inc.prioridad === 'Media' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{inc.prioridad}</span></td>
                                    <td className="px-6 py-4">{getSentimentIcon(inc.overallSentiment)}</td>
                                    <td className="px-6 py-4">{new Date(inc.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const KpiCard = ({ title, value, icon }) => (
    <div className="bg-white p-5 rounded-xl shadow-md flex items-center justify-between border border-gray-200">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
    </div>
);

const ChartCard = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
        <div className="relative h-64 w-full">{children}</div>
    </div>
);

export default Incidencias;