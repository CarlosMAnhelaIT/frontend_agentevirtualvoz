import React, { useState } from 'react';
import { Bot, Save } from 'lucide-react';

const AgentCreationView = ({ agentName, setAgentName, systemPrompt, setSystemPrompt }) => {
    const [localName, setLocalName] = useState(agentName);
    const [localPrompt, setLocalPrompt] = useState(systemPrompt);
    const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved

    const handleSave = () => {
        setSaveStatus('saving');
        setAgentName(localName);
        setSystemPrompt(localPrompt);
        setTimeout(() => {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 1000);
    };

    return (
        <div className="p-2">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Creación del Agente Virtual</h1>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Columna de Configuración */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <label htmlFor="agentName" className="block text-sm font-medium text-gray-700 mb-2">Nombre del Agente</label>
                            <input 
                                type="text"
                                id="agentName"
                                value={localName}
                                onChange={(e) => setLocalName(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                placeholder="Ej: AseguraIA"
                            />
                        </div>
                        <div>
                            <label htmlFor="systemPrompt" className="block text-sm font-medium text-gray-700 mb-2">Prompt del Sistema</label>
                            <textarea 
                                id="systemPrompt"
                                value={localPrompt}
                                onChange={(e) => setLocalPrompt(e.target.value)}
                                rows={12}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow font-mono text-sm"
                                placeholder="Describe la personalidad y el objetivo de tu agente..."
                            />
                        </div>
                        <div className="flex justify-end">
                            <button 
                                onClick={handleSave}
                                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-white font-semibold transition-colors ${
                                    saveStatus === 'saved' ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                <Save size={18} />
                                {saveStatus === 'idle' && 'Guardar Cambios'}
                                {saveStatus === 'saving' && 'Guardando...'}
                                {saveStatus === 'saved' && 'Guardado'}
                            </button>
                        </div>
                    </div>

                    {/* Columna de Preview */}
                    <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Vista Previa del Agente</h3>
                        <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center shadow-xl mb-4">
                            <Bot size={50} className="text-white"/>
                        </div>
                        <h4 className="text-2xl font-bold text-gray-800">{localName || 'Nombre del Agente'}</h4>
                        <p className="text-center text-sm text-gray-500 mt-2 px-4">
                            Este es el nombre que aparecerá en la sección de llamadas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentCreationView;
