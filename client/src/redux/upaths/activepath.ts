import { createSlice } from "@reduxjs/toolkit";


let initialState = {
    pathname: "This pc"
}

const activepath = createSlice({
    name: "activepath",
    initialState,

    reducers: {
        setactivepath : (state, action) => {
            state.pathname = action.payload
        }   
    }

})


export const {setactivepath} = activepath.actions
export default activepath.reducer