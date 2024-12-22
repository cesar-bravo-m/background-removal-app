import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
    selectImages,
    deleteImage
} from "@/lib/features/images/imagesSlice";
import {
    setSelectImage
} from "@/lib/features/bgremover/bgremoverSlice";
import { t } from '@/app/translations';

export default function BottomBar() {
    const dispatch = useAppDispatch();
    const images = useAppSelector(selectImages);
    console.log("### images", images);
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-4 overflow-x-auto pb-2 pt-2 flex-grow">
              {/* New Upload Button */}
              <button
                // onClick={handleReset}
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
              {images.map((img) => (
                <div key={img.id} className="flex-shrink-0 relative group">
                  <button
                    onClick={() => dispatch(setSelectImage(img))}
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
                      dispatch(deleteImage(img.id));
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
          </div>
        </div>
      </div>
    )
}