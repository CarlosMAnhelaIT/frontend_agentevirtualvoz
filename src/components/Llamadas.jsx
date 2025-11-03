import React, { useState, useRef } from 'react';
import { Phone, Mic, MicOff, PhoneOff, Bot } from 'lucide-react';

// URL del endpoint de tu backend (Lambda). Reemplázala por tu URL real.
const AWS_LAMBDA_ENDPOINT = 'https://tu-endpoint-de-lambda.amazonaws.com/prod/audio-handler';

const Llamadas = () => {
  const [callStatus, setCallStatus] = useState('idle'); // idle, active, connecting, ended
  const [isListening, setIsListening] = useState(false);
  const [agentStatus, setAgentStatus] = useState('Ready'); // Ready, Listening, Speaking

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayerRef = useRef(new Audio());

  // --- Lógica de la Llamada ---

  const handleCall = async () => {
    if (callStatus === 'active') return;

    setCallStatus('connecting');
    setAgentStatus('Connecting...');

    try {
      // 1. Pedir permiso y obtener el stream de audio
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // 2. Iniciar MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      // 3. Definir qué hacer cuando hay datos de audio disponibles
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      // 4. Definir qué hacer cuando se para de grabar
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = []; // Limpiar para la próxima grabación
        sendAudioToBackend(audioBlob);
      };

      setCallStatus('active');
      setAgentStatus('Ready');
      // Iniciar la escucha automáticamente al conectar
      startListening();

    } catch (error) {
      console.error("Error accessing microphone:", error);
      setAgentStatus('Mic error');
      setCallStatus('idle');
    }
  };

  const handleHangUp = () => {
    stopListening();
    if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setCallStatus('ended');
    setAgentStatus('Call Ended');
    setTimeout(() => {
        setCallStatus('idle');
        setAgentStatus('Ready');
    }, 2000);
  };

  // --- Lógica de Grabación y Envío ---

  const startListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      mediaRecorderRef.current.start();
      setIsListening(true);
      setAgentStatus('Listening...');
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      setAgentStatus('Thinking...'); // El agente está "pensando" mientras procesa
    }
  };

  const sendAudioToBackend = async (audioBlob) => {
    try {
      const response = await fetch(AWS_LAMBDA_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'audio/webm',
        },
        body: audioBlob,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      // Recibir la respuesta de audio y reproducirla
      const responseAudioBlob = await response.blob();
      playAgentResponse(responseAudioBlob);

    } catch (error) {
      console.error("Error sending audio to backend:", error);
      setAgentStatus('Error');
      // En caso de error, volver a escuchar
      startListening();
    }
  };

  // --- Lógica de Reproducción ---

  const playAgentResponse = (audioBlob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    const audioPlayer = audioPlayerRef.current;
    
    audioPlayer.src = audioUrl;
    audioPlayer.play();
    
    setAgentStatus('Speaking...');

    // Cuando el agente termine de hablar, vuelve a escuchar al usuario
    audioPlayer.onended = () => {
      setAgentStatus('Ready');
      startListening();
    };
  };


  // --- Renderizado del Componente ---

  const CallButton = () => (
    <button
      onClick={handleCall}
      className="bg-green-500 hover:bg-green-600 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg transition-transform transform hover:scale-110"
    >
      <Phone size={32} />
    </button>
  );

  const HangUpButton = () => (
    <button
      onClick={handleHangUp}
      className="bg-red-500 hover:bg-red-600 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg transition-transform transform hover:scale-110"
    >
      <PhoneOff size={32} />
    </button>
  );

  const MicButton = () => (
    <button
      onMouseDown={startListening}
      onMouseUp={stopListening}
      onTouchStart={startListening}
      onTouchEnd={stopListening}
      className={`rounded-full w-24 h-24 flex items-center justify-center shadow-xl transition-all duration-200 ${
        isListening ? 'bg-red-500 text-white scale-110' : 'bg-blue-500 text-white'
      }`}
    >
      <Mic size={40} />
    </button>
  );

  return (
    <div className="p-4 m-4 border rounded-lg shadow-lg max-w-md mx-auto bg-gray-800 text-white flex flex-col items-center justify-center h-96">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Agente de Voz</h2>
        <div className="flex items-center justify-center space-x-2 mt-2 p-2 bg-gray-700 rounded-full">
            <Bot size={20} className={agentStatus === 'Speaking...' ? 'text-green-400 animate-pulse' : 'text-gray-400'}/>
            <p className="font-mono text-lg">{agentStatus}</p>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center">
        {callStatus === 'active' && <MicButton />}
      </div>

      <div className="flex justify-center space-x-8 w-full">
        {callStatus !== 'active' ? <CallButton /> : <HangUpButton />}
      </div>
       <div className="mt-4 text-xs text-gray-400 text-center">
          <p>
            {callStatus === 'active' 
              ? 'Mantén presionado el botón del micrófono para hablar.'
              : 'Presiona el teléfono para iniciar la llamada.'
            }
          </p>
      </div>
    </div>
  );
};

export default Llamadas;