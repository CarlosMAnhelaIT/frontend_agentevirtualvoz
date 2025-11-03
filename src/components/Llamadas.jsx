
import React, { useState, useRef, useEffect } from 'react';
import { Phone, Mic, PhoneOff, Bot } from 'lucide-react';

// URL del endpoint de tu backend (Lambda). Reemplázala por tu URL real.
const AWS_LAMBDA_ENDPOINT = 'https://bgcqzdreehrcyr5yb4kb7ojueq0uhprn.lambda-url.eu-west-1.on.aws/';

const Llamadas = () => {
  const [callStatus, setCallStatus] = useState('idle'); // idle, active, connecting, ended
  const [isRecording, setIsRecording] = useState(false);
  const [agentStatus, setAgentStatus] = useState('Ready'); // Ready, Listening, Speaking, Thinking, Error

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayerRef = useRef(new Audio());

  // --- Lógica de la Llamada ---

  const handleCall = async () => {
    if (callStatus === 'active') return;

    setCallStatus('connecting');
    setAgentStatus('Connecting...');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];
        sendAudioToBackend(audioBlob);
      };

      mediaRecorderRef.current = recorder;
      setCallStatus('active');
      setAgentStatus('Ready to talk');

    } catch (error) {
      console.error("Error accessing microphone:", error);
      setAgentStatus('Mic error');
      setCallStatus('idle');
    }
  };

  const handleHangUp = () => {
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

  const startRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      setIsRecording(true);
      setAgentStatus('Listening...');
      mediaRecorderRef.current.start();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAgentStatus('Thinking...');
    }
  };

  const sendAudioToBackend = async (audioBlob) => {
    if (audioBlob.size === 0) {
        setAgentStatus('Ready to talk');
        return;
    }
    try {
      const response = await fetch(AWS_LAMBDA_ENDPOINT, {
        method: 'POST',
        body: audioBlob,
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const responseAudioBlob = await response.blob();
      playAgentResponse(responseAudioBlob);

    } catch (error) {
      console.error("Error sending/receiving audio:", error);
      setAgentStatus('Error');
    }
  };

  // --- Lógica de Reproducción ---

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

  // --- Renderizado del Componente ---

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
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className={`rounded-full w-24 h-24 flex items-center justify-center shadow-xl transition-all duration-200 ${
                    isRecording ? 'bg-green-500 text-white scale-110' : 'bg-blue-500 text-white'
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
              ? 'Mantén presionado el botón para hablar.'
              : 'Presiona el teléfono para iniciar.'
            }
          </p>
      </div>
    </div>
  );
};

export default Llamadas;
