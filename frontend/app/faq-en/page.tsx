import Link from 'next/link';

export default function FAQEnglish() {
  const faqs = [
    {
      question: "Where are the images stored?",
      answer: "Original images are deleted immediately after processing. Processed images are temporarily stored in your browser (localStorage) and are never sent to any server."
    },
    {
      question: "What image formats are accepted?",
      answer: "We currently accept WEBP, PNG, JPEG and JPG images, with a maximum size of 20MB."
    },
    {
      question: "How does the background removal work?",
      answer: "We use an artificial intelligence model (U2-Net) that automatically identifies the main subject of the image and removes the background, generating a transparent background PNG image."
    },
    {
      question: "Can I use the processed images commercially?",
      answer: "Yes, the processed images are your property and you can use them as you wish, including commercial use."
    },
    {
      question: "Why do some images disappear from the bottom bar?",
      answer: "Images in the bottom bar are stored in your browser. If you clear your browser data or use incognito mode, the images won't be preserved."
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
            Back
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>

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