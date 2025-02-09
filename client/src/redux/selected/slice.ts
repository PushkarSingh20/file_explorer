import { createSlice } from "@reduxjs/toolkit";


let initialState = {
    type: null,
    files : []
}

const SliceSelected = createSlice({ 
        name: "sliceselected",
        initialState,
        reducers : {
            setSelectedFiles: (state, action) => {
                
                state.files = action.payload;

            },
            setType: (state, action) => {
                state.type = action.payload;
            }
        }


})

export const {setSelectedFiles , setType} = SliceSelected.actions
export default SliceSelected.reducer; 

