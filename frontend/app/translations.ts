type Translations = {
  [key: string]: {
    [key: string]: string;
  };
};

export const translations: Translations = {
  en: {
    title: "Background Remover",
    subtitle: "Upload an image to instantly remove its background",
    uploadText: "Drag and drop or click to upload",
    fileTypes: "WEBP, PNG, JPG or JPEG (max. 20MB)",
    sampleImagesText: "Or choose one of our sample images",
    selectedFile: "Selected",
    processing: "Processing...",
    removeBackground: "Remove Background",
    analyzing: "Analyzing image...",
    detectingBackground: "Detecting background...",
    removingBackground: "Removing background...",
    finishing: "Finishing...",
    original: "Original",
    processed: "Processed",
    downloadAll: "Download all",
    chooseAnother: "Choose Another Image",
    processAnother: "Process Another Image",
    select: "Select",
    view: "View",
    download: "Download",
    delete: "Delete",
    deleteFromMemory: "Delete from memory",
    noProcessedImages: "No processed images",
    error_selectFile: "Please select a file first",
    error_invalidType: "Please select only WEBP, PNG, JPEG or JPG files",
    error_uploadError: "Error uploading file",
    error_processingError: "Error processing image",
    error_sampleError: "Error loading sample image"
  },
  es: {
    title: "Eliminador de Fondos",
    subtitle: "Sube una imagen para eliminar su fondo instantáneamente",
    uploadText: "Arrastra y suelta o haz clic para subir",
    fileTypes: "WEBP, PNG, JPG o JPEG (máx. 20MB)",
    sampleImagesText: "O elige una de las imágenes de muestra",
    selectedFile: "Seleccionado",
    processing: "Procesando...",
    removeBackground: "Eliminar Fondo",
    analyzing: "Analizando imagen...",
    detectingBackground: "Detectando fondo...",
    removingBackground: "Removiendo fondo...",
    finishing: "Finalizando...",
    original: "Original",
    processed: "Procesada",
    downloadAll: "Descargar todos",
    chooseAnother: "Elegir Otra Imagen",
    processAnother: "Procesar Otra Imagen",
    select: "Seleccionar",
    view: "Ver",
    download: "Descargar",
    delete: "Eliminar",
    deleteFromMemory: "Eliminar de la memoria",
    noProcessedImages: "No hay imágenes procesadas",
    error_selectFile: "Por favor, selecciona un archivo primero",
    error_invalidType: "Por favor, selecciona solo archivos WEBP, PNG, JPEG o JPG",
    error_uploadError: "Error al subir el archivo",
    error_processingError: "Error al procesar la imagen",
    error_sampleError: "Error al cargar la imagen de muestra"
  }
}; 