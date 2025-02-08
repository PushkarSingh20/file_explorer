import { createSlice } from "@reduxjs/toolkit";

let initialState = {
    error : ""
}

const ErrorSlice = createSlice({
    initialState,

    name: "errorslice",
    reducers: {

        setError: (state, action) => {

            state.error = action.payload

        }
        

    }
})

export const { setError } = ErrorSlice.actions
export default ErrorSlice.reducer