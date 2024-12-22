export default function LanguageSelector({ language, setLanguage }: { language: string, setLanguage: (language: string) => void }) {
    return (
        <div className="flex items-center gap-2">
        <button
            onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded ${
                language === 'en' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
            >
                EN
            </button>
            <button
                onClick={() => setLanguage('es')}
                className={`px-2 py-1 rounded ${
                language === 'es' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
            >
                ES
            </button>
        </div>
    )
}