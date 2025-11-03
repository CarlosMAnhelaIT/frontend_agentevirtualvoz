import React, { useState, useRef, useEffect } from 'react';
import { Phone, Mic, PhoneOff, Bot } from 'lucide-react';

const AWS_LAMBDA_ENDPOINT = 'https://bgcqzdreehrcyr5yb4kb7ojueq0uhprn.lambda-url.eu-west-1.on.aws/';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
} 

const Llamadas = () => {
    const [callStatus, setCallStatus] = useState('idle');
    const [isListening, setIsListening] = useState(false);
    const [agentStatus, setAgentStatus] = useState('Lista');
    const [history, setHistory] = useState([]);
    const audioPlayerRef = useRef(new Audio());
    const transcriptContainerRef = useRef(null);

    // Scroll automático del historial
    useEffect(() => {
        if (transcriptContainerRef.current) {
            transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
        }
    }, [history]);

    useEffect(() => {
        if (!SpeechRecognition) {
            setAgentStatus('API no soportada');
            return;
        }

        recognition.onstart = () => {
            setIsListening(true);
            setAgentStatus('Escuchando...');
        };

        recognition.onend = () => {
            setIsListening(false);
            if (callStatus === 'active') {
                 setAgentStatus('Lista para hablar');
            }
        };

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim();
            if (transcript) {
                setAgentStatus('Pensando...');
                // Añadir el texto del usuario al historial inmediatamente
                setHistory(prev => [...prev, { role: 'user', text: transcript }]);
                sendTextToBackend(transcript);
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setAgentStatus('Error de Mic');
        };

    }, [callStatus, history]); // Añadimos history a las dependencias

    const handleCall = () => {
        if (!SpeechRecognition) {
            alert("Tu navegador no soporta la API de reconocimiento de voz. Por favor, usa Chrome o Edge.");
            return;
        }
        setHistory([]); // Limpiar historial al iniciar nueva llamada
        setCallStatus('active');
        setAgentStatus('Lista para hablar');
    };

    const handleHangUp = () => {
        if (isListening) {
            recognition.stop();
        }
        setCallStatus('ended');
        setAgentStatus('Llamada finalizada');
        setTimeout(() => {
            setCallStatus('idle');
            setAgentStatus('Lista');
        }, 2000);
    };

    const toggleListening = () => {
        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    const sendTextToBackend = async (text) => {
        try {
            const response = await fetch(AWS_LAMBDA_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text, history: history }), // Enviar historial
            });

            if (!response.ok) throw new Error(`Server error: ${response.status}`);

            const responseData = await response.json(); // Esperar respuesta JSON

            if (responseData.text && responseData.audio) {
                // Añadir la respuesta del agente al historial
                setHistory(prev => [...prev, { role: 'model', text: responseData.text }]);
                
                // Convertir base64 a blob y reproducir
                const audioBlob = await (await fetch(`data:audio/mpeg;base64,${responseData.audio}`)).blob();
                playAgentResponse(audioBlob);
            } else {
                throw new Error("Respuesta inválida del servidor");
            }

        } catch (error) {
            console.error("Error en la comunicación con el backend:", error);
            setAgentStatus('Error');
        }
    };

    const playAgentResponse = (audioBlob) => {
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioPlayer = audioPlayerRef.current;
        
        audioPlayer.src = audioUrl;
        audioPlayer.play();
        
        setAgentStatus('Hablando...');

        audioPlayer.onended = () => {
            setAgentStatus('Lista para hablar');
        };
    };

    if (!SpeechRecognition) {
        return (
             <div className="p-4 m-4 border rounded-lg shadow-lg max-w-md mx-auto bg-red-800 text-white flex flex-col items-center justify-center h-[500px]">
                <h2 className="text-2xl font-bold">Navegador no Soportado</h2>
                <p className="mt-4 text-center">Tu navegador no es compatible con la API de Reconocimiento de Voz. Por favor, utiliza Google Chrome o Microsoft Edge.</p>
            </div>
        )
    }

    return (
        <div className="p-4 m-4 border rounded-lg shadow-lg max-w-md mx-auto bg-gray-800 text-white flex flex-col h-[600px]">
            {/* Pantalla de Transcripción */}
            <div ref={transcriptContainerRef} className="flex-grow bg-gray-900/50 rounded-lg p-4 mb-4 overflow-y-auto h-64">
                {history.map((entry, index) => (
                    <div key={index} className={`mb-2 ${entry.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <span className={`inline-block p-2 rounded-lg ${entry.role === 'user' ? 'bg-blue-600' : 'bg-gray-600'}`}>
                            {entry.text}
                        </span>
                    </div>
                ))}
                 {isListening && <div className="text-center text-gray-400">...</div>}
            </div>

            <div className="text-center mb-4">
                <div className="flex items-center justify-center space-x-2 p-2 bg-gray-700 rounded-full min-w-[150px]">
                    <Bot size={20} className={agentStatus === 'Hablando...' ? 'text-green-400 animate-pulse' : 'text-gray-400'}/>
                    <p className="font-mono text-lg">{agentStatus}</p>
                </div>
            </div>

            <div className="flex items-center justify-center mb-4">
                {callStatus === 'active' && (
                    <button
                        onClick={toggleListening}
                        className={`rounded-full w-20 h-20 flex items-center justify-center shadow-xl transition-all duration-200 ${
                            isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-500 text-white'
                        }`}
                        >
                        <Mic size={32} />
                    </button>
                )}
            </div>

            <div className="flex justify-center space-x-8 w-full mt-auto">
                {callStatus !== 'active' ? (
                    <button onClick={handleCall} className="bg-green-500 hover:bg-green-600 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg transition-transform transform hover:scale-110">
                        <Phone size={32} />
                    </button>
                ) : (
                    <button onClick={handleHangUp} className="bg-red-500 hover:bg-red-600 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg transition-transform transform hover:scale-110">
                        <PhoneOff size={32} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Llamadas;
