import { createSlice } from "@reduxjs/toolkit";


let initialState = {
    files : []
}

const SliceSelected = createSlice({ 
        name: "sliceselected",
        initialState,
        reducers : {
            setSelectedFiles: (state, action) => {
                state.files = action.payload;

            }
        }


})

export const {setSelectedFiles} = SliceSelected.actions
export default SliceSelected.reducer; 

