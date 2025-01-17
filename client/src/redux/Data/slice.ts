import { createSlice } from "@reduxjs/toolkit";
import {ApiThunkFunc} from '../apis/api'


let initialState = {
    
    data :  [],
    loading : true,
    error: ""
}

const DataSlice = createSlice({ 

    name: "dataslice",
    initialState,

    extraReducers: (builder) => {
        builder
            .addCase(ApiThunkFunc.pending , (state) => {
                state.data = []
                state.loading = true
                state.error =  ""
            })
            .addCase(ApiThunkFunc.fulfilled , (state, action) => {
                state.data = action.payload.data
                state.loading = false
                state.error = ""
            })
            .addCase(ApiThunkFunc.rejected , (state ) => {
                state.data = []
                state.loading = false
                state.error =  "An error occured!"
                
            })
        

    },

    reducers: {
        setdata: (state, action) => {
            state.data = action.payload
        }
    }

    
})

export const {setdata} = DataSlice.actions
export default DataSlice.reducer