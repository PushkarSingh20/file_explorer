import { createSlice } from "@reduxjs/toolkit";


let initialState = {
    paths: ["this pc"],
    activepathindex:0
}

const upaths = createSlice({
    name: "upaths",
    initialState,

    reducers: {
        setpaths : (state, action) => {
            state.paths = action.payload
           
        },   

        setactiveindex : (state, action) => {
            state.activepathindex = action.payload
           
        } 

    }

})


export const {setpaths , setactiveindex} = upaths.actions
export default upaths.reducer