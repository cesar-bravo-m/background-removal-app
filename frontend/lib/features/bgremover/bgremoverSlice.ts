import { createAppSlice } from "@/lib/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ProcessedImage } from "@/app/types";

export interface BgremoverSliceState {
  selectImage: ProcessedImage | null;
}

const initialState: BgremoverSliceState = {
  selectImage: null,
};

export const bgremoverSlice = createAppSlice({
  name: "bgremover",
  initialState,
  reducers: (create) => ({
    setSelectImage: create.reducer((state, action: PayloadAction<ProcessedImage>) => {
      state.selectImage = action.payload;
    }),
  }),
  selectors: {
    selectSelectImage: (bgremover) => bgremover.selectImage,
  },
});

export const { setSelectImage } = bgremoverSlice.actions;
export const { selectSelectImage } = bgremoverSlice.selectors;
