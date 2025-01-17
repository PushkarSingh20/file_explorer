import { createSlice } from "@reduxjs/toolkit";


let initialState = {
    username : ""
}


const UserSlice = createSlice({

    name: "username",
    initialState,

    reducers: {
        setname: (state, action) => {
            state.username = action.payload
        }
    }
})

export const {setname} = UserSlice.actions
export default UserSlice.reducer