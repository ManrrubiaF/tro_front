import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Product = {
    id: number;
    name: string;
    description: string;
    category: string;
    photos: string[];
    identification: string;
    active: boolean;
}

type ProductState = {
    products: Product[]
    productToShow: Product[] ;
};



const initialState: ProductState = {
    products: [],
    productToShow: []
};

const productSlice = createSlice({
    name: 'products',
    initialState,

    reducers: {
        setProducts: (state, action: PayloadAction<Product[]>) => {
            state.products = action.payload;
        },

        setProductToShow: (state, action: PayloadAction<Product[]>) => {
            state.productToShow = action.payload;
        },

        resetProducts: () => {
            return initialState;
        },

        resetProductToShow: (state) => {
            state.productToShow = [];
        }
    }
});



export const {setProducts, resetProducts, setProductToShow, resetProductToShow} = productSlice.actions;
export default productSlice.reducer;

