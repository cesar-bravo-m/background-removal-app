import { createAppSlice } from "@/lib/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ProcessedImage } from "@/app/types";

export interface BgremoverSliceState {
  selectImage: ProcessedImage | null;
  selectedFile: File | null;
  previewUrl: string | null;
  processedImageUrl: string | null;
  error: string | null;
  rotation: number;
  isProcessing: boolean;
  progress: number;
}

const initialState: BgremoverSliceState = {
  selectImage: null,
  selectedFile: null,
  previewUrl: null,
  processedImageUrl: null,
  error: null,
  rotation: 0,
  isProcessing: false,
  progress: 0,
};

export const bgremoverSlice = createAppSlice({
  name: "bgremover",
  initialState,
  reducers: (create) => ({
    setSelectImage: create.reducer((state, action: PayloadAction<ProcessedImage | null>) => {
      state.selectImage = action.payload;
    }),
    setSelectedFile: create.reducer((state, action: PayloadAction<File | null>) => {
      state.selectedFile = action.payload;
    }),
    setPreviewUrl: create.reducer((state, action: PayloadAction<string | null>) => {
      state.previewUrl = action.payload;
    }),
    setProcessedImageUrl: create.reducer((state, action: PayloadAction<string | null>) => {
      state.processedImageUrl = action.payload;
    }),
    setError: create.reducer((state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }),
    setRotation: create.reducer((state, action: PayloadAction<number>) => {
      state.rotation = action.payload;
    }),
    setIsProcessing: create.reducer((state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    }),
    setProgress: create.reducer((state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    }),
    reset: create.reducer((state) => {
      state.selectImage = null;
      state.selectedFile = null;
      state.previewUrl = null;
      state.processedImageUrl = null;
      state.error = null;
      state.rotation = 0;
      state.isProcessing = false;
      state.progress = 0;
    }),
  }),
  selectors: {
    selectSelectImage: (bgremover) => bgremover.selectImage,
    selectSelectedFile: (bgremover) => bgremover.selectedFile,
    selectPreviewUrl: (bgremover) => bgremover.previewUrl,
    selectProcessedImageUrl: (bgremover) => bgremover.processedImageUrl,
    selectError: (bgremover) => bgremover.error,
    selectRotation: (bgremover) => bgremover.rotation,
    selectIsProcessing: (bgremover) => bgremover.isProcessing,
    selectProgress: (bgremover) => bgremover.progress,
  },
});

export const {
    setSelectImage,
    setSelectedFile,
    setPreviewUrl,
    setProcessedImageUrl,
    setError,
    setRotation,
    setIsProcessing,
    setProgress,
    reset
} = bgremoverSlice.actions;
export const {
    selectSelectImage,
    selectSelectedFile,
    selectPreviewUrl,
    selectProcessedImageUrl,
    selectError,
    selectRotation,
    selectIsProcessing,
    selectProgress
} = bgremoverSlice.selectors;
