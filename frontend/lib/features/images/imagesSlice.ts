import { createAppSlice } from "@/lib/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ProcessedImage } from "@/app/types";

export interface ImagesSliceState {
  images: ProcessedImage[];
}

const initialState: ImagesSliceState = {
  images: [],
};

export const imagesSlice = createAppSlice({
  name: "images",
  initialState,
  reducers: (create) => ({
    addImage: create.reducer((state, action: PayloadAction<ProcessedImage>) => {
      state.images.push(action.payload);
    }),
    deleteImage: create.reducer((state, action: PayloadAction<string>) => {
      state.images = state.images.filter((img) => img.id !== action.payload);
    }),
    setImages: create.reducer((state, action: PayloadAction<ProcessedImage[]>) => {
      state.images = action.payload;
    }),
  }),
  selectors: {
    selectImages: (images) => images.images,
  },
});

export const { addImage, deleteImage, setImages } = imagesSlice.actions;
export const { selectImages } = imagesSlice.selectors;
