import { createSlice } from "@reduxjs/toolkit";

let initialState = {
    message : ""
}

const MessageSlice = createSlice({
    initialState,

    name: "messageslice",
    reducers: {

        setMessage: (state, action) => {

            state.message = action.payload

        }
        

    }
})

export const { setMessage } = MessageSlice.actions
export default MessageSlice.reducer