'use client'
import { useTokens } from '../contexts/TokenContext'

interface Props {
  onClose: () => void;
  language: 'en' | 'es';
}

export default function BuyTokensModal({ onClose, language }: Props) {
  const { tokens, addTokens } = useTokens();

  const handlePurchase = (amount: number) => {
    // Here you would integrate with a payment provider
    // For now, just add the tokens directly
    addTokens(amount);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-md w-full overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-xl text-white font-medium">
            {language === 'en' ? 'Get More Tokens' : 'Obtener Más Tokens'}
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-gray-300">
            {language === 'en' 
              ? `You have ${tokens} tokens remaining.` 
              : `Te quedan ${tokens} tokens.`}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => handlePurchase(10)}
              className="p-4 rounded-lg border border-gray-700 hover:border-blue-500 
                       transition-colors text-center space-y-2"
            >
              <div className="text-2xl font-bold text-white">10</div>
              <div className="text-sm text-gray-400">$4.99</div>
            </button>
            <button
              onClick={() => handlePurchase(25)}
              className="p-4 rounded-lg border border-gray-700 hover:border-blue-500 
                       transition-colors text-center space-y-2"
            >
              <div className="text-2xl font-bold text-white">25</div>
              <div className="text-sm text-gray-400">$9.99</div>
            </button>
          </div>
        </div>
        <div className="p-4 border-t border-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            {language === 'en' ? 'Close' : 'Cerrar'}
          </button>
        </div>
      </div>
    </div>
  );
} 