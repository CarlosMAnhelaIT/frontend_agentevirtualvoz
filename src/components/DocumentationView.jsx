import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as pdfjsLib from 'pdfjs-dist';
import { UploadCloud, FileText, Loader, CheckCircle, XCircle } from 'lucide-react';

const AWS_EMBEDDINGS_LAMBDA_ENDPOINT = 'https://zmpidrmlv5nrwcz3qvrd7gvab40ksyru.lambda-url.eu-west-1.on.aws/';

// Configurar el worker para pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const DocumentationView = ({ uploadedFiles, setUploadedFiles }) => {
    const [processingStatus, setProcessingStatus] = useState('idle'); // idle, processing

    const handleFileProcessing = async (file) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async () => {
            try {
                const pdf = await pdfjsLib.getDocument(reader.result).promise;
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    fullText += textContent.items.map(item => item.str).join(' ') + '\n';
                }
                
                // Aquí es donde enviarías el texto al backend
                console.log(`Texto extraído de ${file.name}:`, fullText.substring(0, 200) + '...');
                
                try {
                    const response = await fetch(AWS_EMBEDDINGS_LAMBDA_ENDPOINT, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ text: fullText, fileName: file.name }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`Server error: ${response.status} - ${errorData.body}`);
                    }

                    // Actualizar estado en el frontend a completado
                    setUploadedFiles(prev => prev.map(f => f.name === file.name ? { ...f, status: 'completed' } : f));

                } catch (backendError) {
                    console.error("Error enviando texto al backend:", backendError);
                    setUploadedFiles(prev => prev.map(f => f.name === file.name ? { ...f, status: 'failed' } : f));
                }

            } catch (pdfError) {
                console.error("Error procesando el PDF:", pdfError);
                setUploadedFiles(prev => prev.map(f => f.name === file.name ? { ...f, status: 'failed' } : f));
            }
        };
    };

    const onDrop = useCallback(acceptedFiles => {
        setProcessingStatus('processing');
        const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
        
        if (pdfFiles.length === 0) {
            alert("Por favor, sube solo archivos PDF.");
            setProcessingStatus('idle');
            return;
        }

        // Limpiar la lista y empezar de nuevo
        setUploadedFiles([]); 

        const processAllFiles = async () => {
            for (const file of pdfFiles) {
                setUploadedFiles(prev => [...prev, { name: file.name, status: 'processing' }]);
                await handleFileProcessing(file);
            }
            setProcessingStatus('idle');
        };

        processAllFiles();

    }, [setUploadedFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop, 
        accept: { 'application/pdf': ['.pdf'] }
    });

    return (
        <div className="p-2">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Documentación del Agente</h1>

            {/* Zona de Carga */}
            <div {...getRootProps()} className={`p-10 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center text-gray-500">
                    <UploadCloud size={48} className="mb-4" />
                    {isDragActive ?
                        <p className="text-lg font-semibold">Suelta los PDFs aquí...</p> :
                        <p className="text-lg font-semibold">Arrastra y suelta tus archivos PDF aquí, o haz clic para seleccionarlos</p>
                    }
                    <p className="text-sm mt-2">Sube la documentación que tu agente usará como base de conocimiento.</p>
                </div>
            </div>

            {/* Lista de Documentos Subidos */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Documentos Cargados</h2>
                {uploadedFiles.length === 0 ? (
                    <div className="text-center text-gray-400 py-8 bg-white rounded-lg shadow-sm border">
                        <p>Aún no se han cargado documentos.</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {uploadedFiles.map((file, index) => (
                            <li key={index} className="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileText size={20} className="text-gray-500" />
                                    <span className="font-medium text-gray-800">{file.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {file.status === 'processing' && <Loader size={20} className="animate-spin text-blue-500" />}
                                    {file.status === 'completed' && <CheckCircle size={20} className="text-green-500" />}
                                    {file.status === 'failed' && <XCircle size={20} className="text-red-500" />}
                                    <span className="text-sm text-gray-500 capitalize">{file.status}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default DocumentationView;
