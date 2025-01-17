import { createSlice } from "@reduxjs/toolkit";


let initialState = {
    paths: []
}

const upaths = createSlice({
    name: "upaths",
    initialState,

    reducers: {
        setpaths : (state, action) => {
            state.paths = action.payload
        }   
    }

})


export const {setpaths} = upaths.actions
export default upaths.reducer