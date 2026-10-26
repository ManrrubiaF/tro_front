import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Pagination = {
    currentPage: number;
    elementsPerPage: number;
    totalPage:number;
}

const initialState: Pagination = {
    currentPage: 1,
    elementsPerPage: 12,
    totalPage: 1,
}

const PaginationSlice = createSlice({
    name:'Pagination',
    initialState,
    reducers:{
        setCurrentPage: (state, action: PayloadAction<number>) =>{
            state.currentPage = action.payload
        },
        setPageTotal: (state, action: PayloadAction<number>) =>{
            state.totalPage = action.payload
        },
        resetPagination: (state) => {
            state.currentPage = initialState.currentPage;
            state.totalPage = initialState.totalPage
        }
    }
})

export const { setCurrentPage, setPageTotal, resetPagination } = PaginationSlice.actions;
export default PaginationSlice.reducer;