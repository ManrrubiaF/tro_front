import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type About = {
    id: number,
    text: string
}

const initialState: About[] = []
const aboutSlice = createSlice({
    name: 'About',
    initialState,
    reducers: {
        setAbout: (_, action: PayloadAction<About[]>)=>{
            return action.payload;
        },
    }
})

export const {setAbout} = aboutSlice.actions;
export default aboutSlice.reducer;