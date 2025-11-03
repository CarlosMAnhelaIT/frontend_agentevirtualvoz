import React, { useState, useRef, useEffect } from 'react';
import { Phone, Mic, PhoneOff, Bot } from 'lucide-react';

const AWS_LAMBDA_ENDPOINT = 'https://bgcqzdreehrcyr5yb4kb7ojueq0uhprn.lambda-url.eu-west-1.on.aws/';

// Polyfill para la API de Reconocimiento de Voz
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
} 

const Llamadas = () => {
    const [callStatus, setCallStatus] = useState('idle'); // idle, active, connecting, ended
    const [isListening, setIsListening] = useState(false);
    const [agentStatus, setAgentStatus] = useState('Ready'); // Ready, Listening, Speaking, Thinking, Error
    const audioPlayerRef = useRef(new Audio());

    useEffect(() => {
        if (!SpeechRecognition) {
            setAgentStatus('API no soportada');
            return;
        }

        recognition.onstart = () => {
            setIsListening(true);
            setAgentStatus('Listening...');
        };

        recognition.onend = () => {
            setIsListening(false);
            if (callStatus === 'active') {
                 setAgentStatus('Ready to talk');
            }
        };

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim();
            if (transcript) {
                setAgentStatus('Thinking...');
                sendTextToBackend(transcript);
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setAgentStatus('Error de Mic');
        };

    }, [callStatus]);

    const handleCall = () => {
        if (!SpeechRecognition) {
            alert("Tu navegador no soporta la API de reconocimiento de voz. Por favor, usa Chrome o Edge.");
            return;
        }
        setCallStatus('active');
        setAgentStatus('Ready to talk');
    };

    const handleHangUp = () => {
        if (isListening) {
            recognition.stop();
        }
        setCallStatus('ended');
        setAgentStatus('Call Ended');
        setTimeout(() => {
            setCallStatus('idle');
            setAgentStatus('Ready');
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
        console.log(`Sending text: ${text}`);
        try {
            const response = await fetch(AWS_LAMBDA_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text }),
            });

            if (!response.ok) throw new Error(`Server error: ${response.status}`);

            const responseAudioBlob = await response.blob();
            playAgentResponse(responseAudioBlob);

        } catch (error) {
            console.error("Error sending/receiving audio:", error);
            setAgentStatus('Error');
        }
    };

    const playAgentResponse = (audioBlob) => {
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioPlayer = audioPlayerRef.current;
        
        audioPlayer.src = audioUrl;
        audioPlayer.play();
        
        setAgentStatus('Speaking...');

        audioPlayer.onended = () => {
            setAgentStatus('Ready to talk');
        };
    };

    if (!SpeechRecognition) {
        return (
             <div className="p-4 m-4 border rounded-lg shadow-lg max-w-md mx-auto bg-red-800 text-white flex flex-col items-center justify-center h-96">
                <h2 className="text-2xl font-bold">Navegador no Soportado</h2>
                <p className="mt-4 text-center">Tu navegador no es compatible con la API de Reconocimiento de Voz. Por favor, utiliza Google Chrome o Microsoft Edge.</p>
            </div>
        )
    }

    return (
        <div className="p-4 m-4 border rounded-lg shadow-lg max-w-md mx-auto bg-gray-800 text-white flex flex-col items-center justify-center h-96">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Agente de Voz</h2>
                <div className="flex items-center justify-center space-x-2 mt-2 p-2 bg-gray-700 rounded-full min-w-[150px]">
                    <Bot size={20} className={agentStatus === 'Speaking...' ? 'text-green-400 animate-pulse' : 'text-gray-400'}/>
                    <p className="font-mono text-lg">{agentStatus}</p>
                </div>
            </div>

            <div className="flex-grow flex items-center justify-center">
                {callStatus === 'active' && (
                    <button
                        onClick={toggleListening}
                        className={`rounded-full w-24 h-24 flex items-center justify-center shadow-xl transition-all duration-200 ${
                            isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-500 text-white'
                        }`}
                        >
                        <Mic size={40} />
                    </button>
                )}
            </div>

            <div className="flex justify-center space-x-8 w-full mt-4">
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
            <div className="mt-4 text-xs text-gray-400 text-center h-5">
                <p>
                    {callStatus === 'active' 
                    ? 'Haz clic en el micrófono para hablar.'
                    : 'Presiona el teléfono para iniciar.'
                    }
                </p>
            </div>
        </div>
    );
};

export default Llamadas;