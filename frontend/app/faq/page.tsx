import Link from 'next/link';

export default function FAQ() {
  const faqs = [
    {
      question: "¿Dónde se almacenan las imágenes?",
      answer: "Las imágenes originales se eliminan inmediatamente después del procesamiento. Las imágenes procesadas se almacenan temporalmente en tu navegador (localStorage) y nunca se envían a ningún servidor."
    },
    {
      question: "¿Qué formatos de imagen se aceptan?",
      answer: "Actualmente aceptamos imágenes en formato WEBP, PNG, JPEG y JPG, con un tamaño máximo de 20MB."
    },
    {
      question: "¿Cómo funciona la eliminación del fondo?",
      answer: "Utilizamos un modelo de inteligencia artificial (U2-Net) que identifica automáticamente el sujeto principal de la imagen y elimina el fondo, generando una imagen con fondo transparente en formato PNG."
    },
    {
      question: "¿Puedo usar las imágenes procesadas comercialmente?",
      answer: "Sí, las imágenes procesadas son de tu propiedad y puedes usarlas como desees, incluyendo uso comercial."
    },
    {
      question: "¿Por qué algunas imágenes desaparecen de la barra inferior?",
      answer: "Las imágenes en la barra inferior se almacenan en tu navegador. Si limpias los datos del navegador o usas el modo incógnito, las imágenes no se conservarán."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Volver
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">Preguntas Frecuentes</h1>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-gray-700/50"
            >
              <h2 className="text-xl font-medium mb-3 text-blue-400">
                {faq.question}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 