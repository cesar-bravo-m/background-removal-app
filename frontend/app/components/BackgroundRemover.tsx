'use client'
import { t } from '@/app/translations';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { selectPreviewUrl, selectProcessedImageUrl, selectIsProcessing, selectProgress, selectRotation, reset, setError, setSelectedFile, setPreviewUrl, selectSelectedFile, selectError, setIsProcessing, setProcessedImageUrl, setRotation } from '@/lib/features/bgremover/bgremoverSlice';
import { ProcessedImage } from '../types';
import { addImage } from '@/lib/features/images/imagesSlice';

const sampleImages = [
  { src: '/samples/1.webp', name: 'Muestra 1' },
  { src: '/samples/2.webp', name: 'Muestra 2' },
  { src: '/samples/3.jpg', name: 'Muestra 3' },
  { src: '/samples/4.webp', name: 'Muestra 4' },
  { src: '/samples/5.jpg', name: 'Muestra 5' },
  { src: '/samples/6.jpg', name: 'Muestra 6' },
];

export default function BackgroundRemover() {
    const dispatch = useAppDispatch();
    const selectedFile = useAppSelector(selectSelectedFile);
    const previewUrl = useAppSelector(selectPreviewUrl);
    const processedImageUrl = useAppSelector(selectProcessedImageUrl);
    const error = useAppSelector(selectError);
    const isProcessing = useAppSelector(selectIsProcessing);
    const rotation = useAppSelector(selectRotation);
    const progress = useAppSelector(selectProgress);

    // TOPO: Fake Progress bar

  const rotateClockwise = () => {
    dispatch(setRotation((rotation + 90) % 360));
  };

  const rotateCounterclockwise = () => {
    dispatch(setRotation((rotation - 90 + 360) % 360));
  };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

  const handleUpload = async () => {
    if (!selectedFile) {
      dispatch(setError(t('error_selectFile')));
      return;
    }

    try {
      dispatch(setIsProcessing(true));
      dispatch(setError(null));
      
      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const processedUrl = URL.createObjectURL(await uploadResponse.blob());
      dispatch(setProcessedImageUrl(processedUrl));
      
      // Save to history
      saveToHistory(previewUrl!, processedUrl);
      
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : t('error_processingError')));
    } finally {
      dispatch(setIsProcessing(false));
    }
  };

  const saveToHistory = async (original: string, processed: string) => {
    try {
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

      dispatch(addImage(newImage));
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Check file type
      if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
        dispatch(setError('Por favor, selecciona solo archivos WEBP, PNG, JPEG o JPG'));
        dispatch(setSelectedFile(null));
        dispatch(setPreviewUrl(null));
        return;
      }

      dispatch(setSelectedFile(file));
      const url = URL.createObjectURL(file);
      dispatch(setPreviewUrl(url));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    dispatch(setError(null));
    
    if (file) {
      // Check file type
      if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
        dispatch(setError('Por favor, selecciona solo archivos WEBP, PNG, JPEG o JPG'));
        dispatch(setSelectedFile(null));
        dispatch(setPreviewUrl(null));
        return;
      }

      dispatch(setSelectedFile(file));
      // Create preview URL
      const url = URL.createObjectURL(file);
      dispatch(setPreviewUrl(url));
    }
  };

  const handleSampleSelect = async (sampleSrc: string) => {
    try {
      const response = await fetch(sampleSrc);
      const blob = await response.blob();
      const file = new File([blob], sampleSrc.split('/').pop() || 'sample.jpg', { type: blob.type });
      
      dispatch(setSelectedFile(file));
      const url = URL.createObjectURL(blob);
      dispatch(setPreviewUrl(url));
    } catch (error) {
      console.error('Error al cargar la imagen de muestra:', error);
      setError('Error al cargar la imagen de muestra');
    }
  };

    return (
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
                      onClick={() => dispatch(reset())}
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
    )
}