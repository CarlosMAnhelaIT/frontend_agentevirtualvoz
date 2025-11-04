import React, { useState, useRef, useEffect } from 'react';
import { Phone, Mic, PhoneOff, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AWS_LAMBDA_ENDPOINT = 'https://bgcqzdreehrcyr5yb4kb7ojueq0uhprn.lambda-url.eu-west-1.on.aws/';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
}

// --- Componente de Burbuja de Chat ---
const ChatBubble = ({ role, text }) => {
    const isUser = role === 'user';

    return (
        <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && <div className="flex-shrink-0 w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center"><Bot size={22} className="text-white"/></div>}
            <div className={`p-3 rounded-2xl max-w-xs md:max-w-md transition-all duration-300 ${isUser ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
                <ReactMarkdown className="text-sm">{text}</ReactMarkdown>
            </div>
            {isUser && <div className="flex-shrink-0 w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center"><User size={22} className="text-gray-600"/></div>}
        </div>
    );
};

// --- Componente Principal de Llamadas ---
const Llamadas = ({ agentName, systemPrompt, setLiveSentiment }) => {
    const [callStatus, setCallStatus] = useState('idle');
    const [isListening, setIsListening] = useState(false);
    const [agentStatus, setAgentStatus] = useState('Lista');
    const [history, setHistory] = useState([]);
    const [isCreatingIncident, setIsCreatingIncident] = useState(false);
    const [incidentCreated, setIncidentCreated] = useState(false);
    const audioPlayerRef = useRef(new Audio());
    const transcriptContainerRef = useRef(null);

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
            if (callStatus === 'active') setAgentStatus('Lista para hablar');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim();
            if (transcript) {
                setAgentStatus('Pensando...');
                const newUserMessage = { role: 'user', text: transcript };
                const newHistory = [...history, newUserMessage];
                setHistory(newHistory);
                sendTextToBackend(transcript, newHistory);
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setAgentStatus('Error de Mic');
        };

    }, [callStatus, history]);

    const handleCall = () => {
        if (!SpeechRecognition) {
            alert("Tu navegador no soporta la API de reconocimiento de voz. Por favor, usa Chrome o Edge.");
            return;
        }
        setHistory([]);
        setCallStatus('active');
        setAgentStatus('Lista para hablar');
        setLiveSentiment('Neutral'); // Reset sentiment on new call
    };

    const handleHangUp = () => {
        if (isListening) recognition.stop();
        setCallStatus('ended');
        setAgentStatus('Llamada finalizada');
        setTimeout(() => {
            setCallStatus('idle');
            setAgentStatus('Lista');
        }, 2000);
    };

    const toggleListening = () => {
        if (isListening) recognition.stop();
        else recognition.start();
    };

    const sendTextToBackend = async (text, currentHistory) => {
        try {
            const response = await fetch(AWS_LAMBDA_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, history: currentHistory, systemPrompt }),
            });

            if (!response.ok) throw new Error(`Server error: ${response.status}`);

            const responseData = await response.json();

            // Lift the sentiment state up to the parent component
            if (responseData.sentiment) {
                setLiveSentiment(responseData.sentiment);
            }

            if (responseData.text && responseData.audio) {
                const modelResponse = { role: 'model', text: responseData.text };
                setHistory(prev => [...prev, modelResponse]);
                
                const audioBlob = await (await fetch(`data:audio/mpeg;base64,${responseData.audio}`)).blob();
                playAgentResponse(audioBlob);

                if (responseData.incidencia_creada === true) {
                    setHistory(prev => {
                        createIncident(prev);
                        return prev;
                    });
                }
            } else {
                throw new Error("Respuesta inválida del servidor");
            }

        } catch (error) {
            console.error("Error en la comunicación con el backend:", error);
            setAgentStatus('Error');
        }
    };

    const createIncident = async (conversationHistory) => {
        setIsCreatingIncident(true);
        setAgentStatus('Creando Incidencia...');
        try {
            const response = await fetch('https://fqhjig3ughucnttbt53a5gqbie0xxvdt.lambda-url.eu-west-1.on.aws/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversationHistory }),
            });

            if (!response.ok) throw new Error(`Server error: ${response.status}`);

            const responseData = await response.json();
            console.log("Incidencia creada:", responseData);
            setIncidentCreated(true);
            setAgentStatus('Incidencia Creada');
        } catch (error) {
            console.error("Error al crear la incidencia:", error);
            setAgentStatus('Error al crear');
        } finally {
            setIsCreatingIncident(false);
        }
    };

    const playAgentResponse = (audioBlob) => {
        const audioUrl = URL.createObjectURL(audioBlob);
        audioPlayerRef.current.src = audioUrl;
        audioPlayerRef.current.play();
        setAgentStatus('Hablando...');
        audioPlayerRef.current.onended = () => setAgentStatus('Lista para hablar');
    };

    if (!SpeechRecognition) {
        return (
            <div className="p-6 m-4 border rounded-lg shadow-lg max-w-lg mx-auto bg-white text-gray-800 flex flex-col items-center justify-center h-[650px]">
                <h2 className="text-2xl font-bold text-red-600">Navegador no Soportado</h2>
                <p className="mt-4 text-center text-gray-600">Tu navegador no es compatible con la API de Reconocimiento de Voz. <br/> Por favor, utiliza Google Chrome o Microsoft Edge.</p>
            </div>
        )
    }

    const getStatusIndicator = () => {
        switch(agentStatus) {
            case 'Escuchando...':
                return <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>;
            case 'Hablando...':
                return <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>;
            case 'Pensando...':
            case 'Creando Incidencia...':
                return <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>;
            default:
                return <div className="w-3 h-3 rounded-full bg-gray-400"></div>;
        }
    };

    return (
        <div className="p-4 sm:p-6 border rounded-2xl shadow-2xl max-w-lg mx-auto bg-gray-100 flex flex-col h-[700px] font-sans">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center"><Bot size={26} className="text-white"/></div>
                    <div>
                <h2 className="text-2xl font-bold">{agentName}</h2>
                        <div className="flex items-center gap-2">
                            {getStatusIndicator()}
                            <p className="text-sm text-gray-500">{agentStatus}</p>
                        </div>
                    </div>
                </div>
                {callStatus === 'active' && (
                    <button onClick={handleHangUp} className="p-2 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors">
                        <PhoneOff size={22} />
                    </button>
                )}
            </div>

            {/* Pantalla de Transcripción */}
            <div ref={transcriptContainerRef} className="flex-grow p-4 my-4 overflow-y-auto">
                {history.length === 0 && callStatus === 'active' && (
                    <div className="text-center text-gray-400 mt-16">
                        <p>Haz clic en el micrófono para empezar.</p>
                    </div>
                )}
                {history.map((entry, index) => <ChatBubble key={index} role={entry.role} text={entry.text} />)}
                {incidentCreated && (
                    <div className="text-center text-green-600 font-semibold my-4 p-2 bg-green-100 rounded-lg">
                        <p>Incidencia Creada. Puede revisarla en el panel de Incidencias.</p>
                    </div>
                )}
            </div>

            {/* Footer de Controles */}
            <div className="flex items-center justify-center pt-4">
                {callStatus === 'active' ? (
                    <button
                        onClick={toggleListening}
                        className={`w-20 h-20 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${isListening ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
                        <Mic size={32} />
                    </button>
                ) : (
                    <button onClick={handleCall} className="w-20 h-20 flex items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform transform hover:scale-110">
                        <Phone size={32} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Llamadas;