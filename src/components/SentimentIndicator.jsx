import React from 'react';
import { Smile, Meh, Frown } from 'lucide-react';

const SentimentIndicator = ({ sentiment }) => {

    const sentimentConfig = {
        Positivo: {
            icon: <Smile size={64} className="text-white" />,
            text: "Positivo",
            bgClass: "bg-green-500",
            description: "El cliente parece satisfecho y receptivo."
        },
        Negativo: {
            icon: <Frown size={64} className="text-white" />,
            text: "Negativo",
            bgClass: "bg-red-500",
            description: "El cliente muestra signos de frustración o enfado."
        },
        Neutral: {
            icon: <Meh size={64} className="text-white" />,
            text: "Neutral",
            bgClass: "bg-gray-500",
            description: "El cliente mantiene un tono neutral."
        }
    };

    const config = sentimentConfig[sentiment] || sentimentConfig.Neutral;

    return (
        <div className={`p-6 rounded-2xl shadow-2xl text-white transition-all duration-500 ${config.bgClass}`}>
            <h2 className="text-2xl font-bold text-center mb-4">Sentimiento en Vivo</h2>
            <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                    {config.icon}
                </div>
                <p className="text-4xl font-extrabold mb-2">{config.text}</p>
                <p className="text-sm opacity-80">{config.description}</p>
            </div>
        </div>
    );
};

export default SentimentIndicator;
