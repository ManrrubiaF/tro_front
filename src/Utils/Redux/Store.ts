import { configureStore } from "@reduxjs/toolkit";
import productReducer from './productSlice'
import aboutReducer from './aboutSlice'
import filterReducer from './filterSlice'
import paginationReducer from './paginationSlice'
import userReducer from './userslice'

export const store = configureStore({
    reducer:{
        products: productReducer,
        about: aboutReducer,
        filter: filterReducer,   
        pagination: paginationReducer,
        user: userReducer,     

    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;