import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Filter = {
    order: string;
    category:string;
}

const initialState: Filter = {
    order: '',
    category: '',
}

const filterSlice = createSlice({
    name: 'Filter',
    initialState,
    reducers: {
        setOrder: (state, action: PayloadAction<string>) => {
            state.order = action.payload
        },
        setCategory: (state, action: PayloadAction<string>) => {
            state.category = action.payload
        },
        resetState: (state) => {
            state.order = initialState.order;
            state.category = initialState.category
        }
    }
})

export const { setOrder, setCategory, resetState } = filterSlice.actions;
export default filterSlice.reducer;