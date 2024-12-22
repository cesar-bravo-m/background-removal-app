'use client'
import { selectSelectImage, setSelectImage } from "@/lib/features/bgremover/bgremoverSlice";
import { deleteImage } from "@/lib/features/images/imagesSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { t } from "@/app/translations";

export default function SelectedImageModal() {
    const dispatch = useAppDispatch();
    const selectedImage = useAppSelector(selectSelectImage);
    if (!selectedImage) return <></>;
    return (
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
                  onClick={() => dispatch(setSelectImage(null))}
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
    )
}