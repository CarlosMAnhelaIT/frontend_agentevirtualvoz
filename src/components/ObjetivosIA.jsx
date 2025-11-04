import React from 'react';
import { Bot, BrainCircuit, ClipboardCheck, Smile, BarChart3 } from 'lucide-react';

const FeatureCard = ({ icon, title, description }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            </div>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

const ObjetivosIA = () => {
    const features = [
        {
            icon: <BrainCircuit size={24} className="text-blue-600" />,
            title: "Análisis de Conversación en Tiempo Real",
            description: "El agente utiliza un modelo de lenguaje avanzado para entender la intención y el contexto de la conversación en tiempo real, permitiendo un diálogo fluido y natural."
        },
        {
            icon: <ClipboardCheck size={24} className="text-blue-600" />,
            title: "Creación y Gestión de Incidencias",
            description: "Capacidad para recopilar automáticamente la información necesaria durante la llamada y crear una incidencia estructurada, clasificándola y asignándole una prioridad para una resolución eficiente."
        },
        {
            icon: <Smile size={24} className="text-blue-600" />,
            title: "Análisis de Sentimiento",
            description: "Detecta el estado de ánimo del cliente (Positivo, Neutral, Negativo) en cada turno de la conversación para medir la satisfacción y permitir una respuesta más empática."
        },
        {
            icon: <BarChart3 size={24} className="text-blue-600" />,
            title: "Métricas e Informes Avanzados",
            description: "Proporciona un panel de control con métricas clave sobre las incidencias, como el volumen, la clasificación, la prioridad y el sentimiento general, para una toma de decisiones informada."
        }
    ];

    return (
        <div className="p-8 bg-gray-50 min-h-full">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <Bot size={48} className="mx-auto text-blue-600 mb-4" />
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Capacidades del Agente de IA</h1>
                    <p className="text-lg text-gray-500">Un vistazo a las funcionalidades clave que hacen de este agente una herramienta poderosa para el soporte técnico.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ObjetivosIA;
