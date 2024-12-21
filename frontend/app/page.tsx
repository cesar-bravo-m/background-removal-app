'use client'
import { useState } from "react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    
    if (file) {
      // Check file type
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        setError('Por favor, selecciona solo archivos PNG, JPEG o JPG');
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }

      setSelectedFile(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Por favor, selecciona un archivo primero');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      
      // First, upload the file to our API
      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      // const uploadData = await uploadResponse.json();
      // if (!uploadResponse.ok) {
      //   throw new Error(uploadData.error || 'Error uploading file');
      // }
      
      const processedUrl = URL.createObjectURL(await uploadResponse.blob());
      setProcessedImageUrl(processedUrl);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al procesar la imagen');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProcessedImageUrl(null);
    setError(null);
    setRotation(0);
  };

  const rotateClockwise = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const rotateCounterclockwise = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-gray-50 dark:bg-gray-900">
      <main className="w-full max-w-7xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:px-8 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
              Eliminador de Fondos
            </h1>
            <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
              Sube una imagen para eliminar su fondo instantáneamente
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {!processedImageUrl ? (
              // Upload Section
              <div className="max-w-md mx-auto">
                <div 
                  className={`relative group rounded-xl overflow-hidden ${
                    !previewUrl ? 'border-2 border-dashed border-gray-300 dark:border-gray-600 p-8' : ''
                  } transition-colors hover:border-blue-500 dark:hover:border-blue-400 
                  bg-gray-50 dark:bg-gray-800/50`}
                >
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileInput"
                  />
                  {!previewUrl ? (
                    <label
                      htmlFor="fileInput"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <svg 
                        className="w-12 h-12 text-gray-400 group-hover:text-blue-500 transition-colors" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors">
                        Haz clic para subir o arrastra y suelta
                      </p>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                        PNG, JPG o JPEG (máx. 10MB)
                      </p>
                    </label>
                  ) : (
                    <div className="relative group">
                      <img
                        src={previewUrl}
                        alt="Vista previa"
                        className="w-full h-[50vh] object-contain rounded-xl"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label
                          htmlFor="fileInput"
                          className="cursor-pointer px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-colors"
                        >
                          Elegir Otra Imagen
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {selectedFile && (
                  <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
                    Seleccionado: {selectedFile.name}
                  </p>
                )}

                {error && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400 text-center">
                      {error === 'Por favor, selecciona un archivo primero' ? 'Por favor, selecciona un archivo primero' :
                       error === 'Por favor, selecciona solo archivos PNG, JPEG o JPG' ? 'Por favor, selecciona solo archivos PNG, JPEG o JPG' :
                       error === 'Error al subir el archivo' ? 'Error al subir el archivo' :
                       error === 'Error al procesar la imagen' ? 'Error al procesar la imagen' :
                       error}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || isProcessing}
                  className="w-full mt-6 px-6 py-3 rounded-xl bg-blue-500 text-white font-medium
                           hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed
                           transition-all duration-200 transform hover:scale-[1.02]
                           disabled:hover:scale-100 shadow-lg hover:shadow-xl
                           disabled:shadow-none"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </span>
                  ) : 'Eliminar Fondo'}
                </button>
              </div>
            ) : (
              // Results Section
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Original Image */}
                  <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800/50">
                    <img
                      src={previewUrl!}
                      alt="Original"
                      className="w-full h-[50vh] object-contain"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="text-white text-center font-medium">Original</p>
                    </div>
                  </div>

                  {/* Processed Image */}
                  <div className="relative rounded-xl overflow-hidden bg-[url('/grid.png')] bg-repeat">
                    <img
                      src={processedImageUrl}
                      alt="Resultado procesado"
                      className="w-full h-[50vh] object-contain transition-transform duration-300"
                      style={{ transform: `rotate(${rotation}deg)` }}
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={rotateCounterclockwise}
                        className="p-3 bg-white/90 dark:bg-black/90 rounded-full 
                                  hover:bg-white dark:hover:bg-black 
                                  transition-all duration-200 shadow-lg hover:shadow-xl 
                                  transform hover:scale-110 backdrop-blur-sm"
                        title="Rotar en sentido antihorario"
                      >
                        <svg 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="text-gray-800 dark:text-gray-200"
                        >
                          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                          <path d="M3 3v5h5"/>
                        </svg>
                      </button>
                      <button
                        onClick={rotateClockwise}
                        className="p-3 bg-white/90 dark:bg-black/90 rounded-full 
                                  hover:bg-white dark:hover:bg-black 
                                  transition-all duration-200 shadow-lg hover:shadow-xl 
                                  transform hover:scale-110 backdrop-blur-sm"
                        title="Rotar en sentido horario"
                      >
                        <svg 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="text-gray-800 dark:text-gray-200"
                        >
                          <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                          <path d="M21 3v5h-5"/>
                        </svg>
                      </button>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <a
                        href={processedImageUrl}
                        download="imagen-procesada.png"
                        className="flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-black/90 
                                  rounded-lg hover:bg-white dark:hover:bg-black 
                                  transition-all duration-200 shadow-lg hover:shadow-xl 
                                  transform hover:scale-105 backdrop-blur-sm
                                  text-gray-800 dark:text-gray-200 font-medium"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Descargar
                      </a>
                    </div>
                  </div>
                </div>

                {/* Process Another Image Button */}
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium
                             hover:bg-gray-200 dark:hover:bg-gray-600
                             transition-all duration-200 transform hover:scale-[1.02]
                             shadow-lg hover:shadow-xl"
                  >
                    Procesar Otra Imagen
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
