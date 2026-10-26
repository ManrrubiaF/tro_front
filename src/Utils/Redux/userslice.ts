import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type User = {
    id: number,
    email: string,
    token: string,
}


type UserState = User | null;
const initialState: UserState = null;
const userSlice = createSlice({
    name: 'User',
    initialState: initialState as UserState,
    reducers: {
        setUser: (_state, action: PayloadAction<User>): UserState => {
            return action.payload;
        },
    }
})

export const {setUser} = userSlice.actions;
export default userSlice.reducer;