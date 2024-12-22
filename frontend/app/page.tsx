'use client'
import { useState, useEffect } from "react";
import JSZip from 'jszip';
import { t } from '@/app/translations';
import CookieConsent from '@/app/components/CookieConsent'
import { ProcessedImage } from '@/app/types';
import { validateImage } from '@/app/utils';
import Topbar from "./components/Topbar";

const sampleImages = [
  { src: '/samples/1.webp', name: 'Muestra 1' },
  { src: '/samples/2.webp', name: 'Muestra 2' },
  { src: '/samples/3.jpg', name: 'Muestra 3' },
  { src: '/samples/4.webp', name: 'Muestra 4' },
  { src: '/samples/5.jpg', name: 'Muestra 5' },
  { src: '/samples/6.jpg', name: 'Muestra 6' },
];

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [progress, setProgress] = useState(0);
  const [previousImages, setPreviousImages] = useState<ProcessedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<ProcessedImage | null>(null);
  const [language,] = useState<'en' | 'es'>('en');

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    if (isProcessing) {
      setProgress(0);
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev;
          const increment = Math.random() * 15;
          return Math.min(prev + increment, 95);
        });
      }, 500);
    } else {
      setProgress(100);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isProcessing]);

  useEffect(() => {
    const loadAndValidateImages = async () => {
      const stored = localStorage.getItem('processedImages');
      if (!stored) return;

      const storedImages: ProcessedImage[] = JSON.parse(stored);
      const validatedImages = await Promise.all(
        storedImages.map(async (img) => {
          const [originalValid, processedValid] = await Promise.all([
            validateImage(img.originalUrl),
            validateImage(img.processedUrl)
          ]);
          return { img, isValid: originalValid && processedValid };
        })
      );

      const validImages = validatedImages
        .filter(({ isValid }) => isValid)
        .map(({ img }) => img);

      if (validImages.length !== storedImages.length) {
        localStorage.setItem('processedImages', JSON.stringify(validImages));
      }

      setPreviousImages(validImages);
    };

    loadAndValidateImages();
  }, []);

  const saveToHistory = async (original: string, processed: string) => {
    try {
      // Convert blob URLs to base64
      const [originalBlob, processedBlob] = await Promise.all([
        fetch(original).then(r => r.blob()),
        fetch(processed).then(r => r.blob())
      ]);

      const [originalBase64, processedBase64] = await Promise.all([
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(originalBlob);
        }),
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(processedBlob);
        })
      ]);

      const newImage: ProcessedImage = {
        id: crypto.randomUUID(),
        originalUrl: originalBase64,
        processedUrl: processedBase64,
        timestamp: Date.now()
      };

      const updatedImages = [newImage, ...previousImages].slice(0, 10);
      setPreviousImages(updatedImages);
      localStorage.setItem('processedImages', JSON.stringify(updatedImages));
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    
    if (file) {
      // Check file type
      if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
        setError('Por favor, selecciona solo archivos WEBP, PNG, JPEG o JPG');
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
      setError(t('error_selectFile'));
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const processedUrl = URL.createObjectURL(await uploadResponse.blob());
      setProcessedImageUrl(processedUrl);
      
      // Save to history
      saveToHistory(previewUrl!, processedUrl);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : t('error_processingError'));
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

  const deleteImage = (id: string) => {
    setPreviousImages(prev => {
      const newImages = prev.filter(img => img.id !== id);
      localStorage.setItem('processedImages', JSON.stringify(newImages));
      return newImages;
    });
    // If the deleted image is currently selected in modal, close the modal
    if (selectedImage?.id === id) {
      setSelectedImage(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Check file type
      if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
        setError('Por favor, selecciona solo archivos WEBP, PNG, JPEG o JPG');
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const downloadAllImages = async () => {
    const zip = new JSZip();
    
    // Create a folder for originals and processed images
    const originalsFolder = zip.folder("originales");
    const processedFolder = zip.folder("procesados");

    // Function to fetch and add file to zip
    const addFileToZip = async (url: string, filename: string, folder: JSZip) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        folder.file(filename, blob);
      } catch (error) {
        console.error(`Error adding file ${filename}:`, error);
      }
    };

    // Add all images to zip
    const promises = previousImages.map(async (img, index) => {
      const originalExt = img.originalUrl.split('.').pop() || 'jpg';
      const processedExt = img.processedUrl.split('.').pop() || 'png';
      
      await Promise.all([
        addFileToZip(
          img.originalUrl, 
          `imagen_${index + 1}.${originalExt}`, 
          originalsFolder!
        ),
        addFileToZip(
          img.processedUrl, 
          `imagen_${index + 1}.${processedExt}`, 
          processedFolder!
        )
      ]);
    });

    await Promise.all(promises);

    // Generate and download zip
    const content = await zip.generateAsync({ type: "blob" });
    const downloadUrl = URL.createObjectURL(content);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = "imagenes_procesadas.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  };

  const handleSampleSelect = async (sampleSrc: string) => {
    try {
      const response = await fetch(sampleSrc);
      const blob = await response.blob();
      const file = new File([blob], sampleSrc.split('/').pop() || 'sample.jpg', { type: blob.type });
      
      setSelectedFile(file);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (error) {
      console.error('Error al cargar la imagen de muestra:', error);
      setError('Error al cargar la imagen de muestra');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Topbar />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4" style={{ paddingBottom: '10rem' }}>
        <main className="w-full max-w-7xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-4 py-4 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                {t('title')}
              </h1>
              <p className="mt-1 text-center text-gray-600 dark:text-gray-400 text-sm">
                {t('subtitle')}
              </p>
            </div>

            <div className="p-4 sm:p-6">
              {!processedImageUrl ? (
                // Upload Section
                <div className="max-w-md mx-auto">
                  <div 
                    className={`relative group rounded-xl overflow-hidden ${
                      !previewUrl ? 'border-2 border-dashed border-gray-300 dark:border-gray-600 p-6' : ''
                    } transition-colors hover:border-blue-500 dark:hover:border-blue-400 
                    bg-gray-50 dark:bg-gray-800/50`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
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
                          {t('uploadText')}
                        </p>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                          {t('fileTypes')}
                        </p>
                      </label>
                    ) : (
                      <div className="relative group">
                        <img
                          src={previewUrl}
                          alt="Vista previa"
                          className="w-full h-[40vh] object-contain rounded-xl"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label
                            htmlFor="fileInput"
                            className="cursor-pointer px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-colors"
                          >
                            {t('chooseAnother')}
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {!previewUrl && (
                    <div className="mt-4">
                      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {t('sampleImagesText')}
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                        {sampleImages.map((sample, index) => (
                          <button
                            key={index}
                            onClick={() => handleSampleSelect(sample.src)}
                            className="relative group aspect-square rounded-lg overflow-hidden"
                          >
                            <img
                              src={sample.src}
                              alt={sample.name}
                              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-xs font-medium">
                                {t('select')}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedFile && (
                    <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
                      {t('selectedFile')}: {selectedFile.name}
                    </p>
                  )}

                  {error && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400 text-center">
                        {error === t('error_selectFile') ? t('error_selectFile') :
                         error === t('error_invalidType') ? t('error_invalidType') :
                         error === t('error_uploadError') ? t('error_uploadError') :
                         error === t('error_processingError') ? t('error_processingError') :
                         error}
                      </p>
                    </div>
                  )}

                  <div className="relative">
                    <button
                      onClick={handleUpload}
                      disabled={!selectedFile || isProcessing}
                      className="w-full mt-6 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium
                               hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed
                               transition-all duration-200 transform hover:scale-[1.02]
                               disabled:hover:scale-100 shadow-lg hover:shadow-xl
                               disabled:shadow-none"
                    >
                      {isProcessing ? t('processing') : t('removeBackground')}
                    </button>

                    {isProcessing && (
                      <div className="mt-4 space-y-2">
                        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>
                            {progress < 30 ? t('analyzing') :
                             progress < 60 ? t('detectingBackground') :
                             progress < 90 ? t('removingBackground') :
                             t('finishing')}
                          </span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Results Section
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Original Image */}
                    <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800/50">
                      <img
                        src={previewUrl!}
                        alt="Original"
                        className="w-full h-[40vh] object-contain"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <p className="text-white text-center font-medium">
                          {t('original')}
                        </p>
                      </div>
                    </div>

                    {/* Processed Image */}
                    <div className="relative rounded-xl overflow-hidden bg-[url('/grid.png')] bg-repeat">
                      <img
                        src={processedImageUrl}
                        alt="Resultado procesado"
                        className="w-full h-[40vh] object-contain transition-transform duration-300"
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
                          {t('download')}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Process Another Image Button */}
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium
                               hover:bg-gray-200 dark:hover:bg-gray-600
                               transition-all duration-200 transform hover:scale-[1.02]
                               shadow-lg hover:shadow-xl"
                    >
                      {t('processAnother')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Bottom bar remains the same */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-4 overflow-x-auto pb-2 pt-2 flex-grow">
              {/* New Upload Button */}
              <button
                onClick={handleReset}
                className="flex-shrink-0 h-20 w-20 rounded-lg border-2 border-dashed border-gray-700 
                         hover:border-blue-500 transition-colors flex items-center justify-center
                         group bg-gray-800/50 hover:bg-gray-800"
              >
                <svg 
                  className="w-8 h-8 text-gray-500 group-hover:text-blue-500 transition-colors" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 4v16m8-8H4" 
                  />
                </svg>
              </button>

              {/* Previous Images */}
              {previousImages.map((img) => (
                <div key={img.id} className="flex-shrink-0 relative group">
                  <button
                    onClick={() => setSelectedImage(img)}
                    className="relative"
                  >
                    <img
                      src={img.processedUrl}
                      alt="Processed thumbnail"
                      className="h-20 w-20 object-cover rounded-lg border border-gray-700 hover:border-blue-500 transition-colors"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs">
                        {t('view')}
                      </span>
                    </div>
                  </button>
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteImage(img.id);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 
                               transition-opacity flex items-center justify-center hover:bg-red-600"
                    title={t('delete')}
                  >
                    <svg 
                      className="w-4 h-4 text-white" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M6 18L18 6M6 6l12 12" 
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            
            {/* Download All Button */}
            <button
              onClick={downloadAllImages}
              disabled={previousImages.length === 0}
              className="ml-4 flex-shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-500 
                        text-white rounded-lg transition-colors flex items-center gap-2
                        shadow-lg hover:shadow-xl disabled:bg-gray-700 disabled:cursor-not-allowed
                        disabled:hover:bg-gray-700 disabled:text-gray-400"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span className="hidden sm:inline">
                {t('downloadAll')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-white font-medium">
                {t('processed')}
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => deleteImage(selectedImage.id)}
                  className="text-red-500 hover:text-red-400 transition-colors flex items-center gap-2"
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                    />
                  </svg>
                  <span>{t('deleteFromMemory')}</span>
                </button>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">
                    {t('original')}
                  </p>
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={selectedImage.originalUrl}
                      alt="Original"
                      className="w-full h-[50vh] object-contain"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">
                    {t('processed')}
                  </p>
                  <div className="bg-[url('/grid.png')] bg-repeat rounded-lg overflow-hidden">
                    <img
                      src={selectedImage.processedUrl}
                      alt="Processed"
                      className="w-full h-[50vh] object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <CookieConsent language={language} />

    </div>
  );
}
