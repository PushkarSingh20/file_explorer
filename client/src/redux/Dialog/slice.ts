import { createSlice } from "@reduxjs/toolkit";

let initialState = {
    dialogType: "",
    state: false,
}

const DialogSlice = createSlice({
    initialState,

    name: "dialogslice",
    reducers: {

        setDialogType: (state, action) => {

            state.dialogType = action.payload

        },

        
        setState: (state, action) => {

            state.state = action.payload

        },



    }
})

export const { setDialogType , setState } = DialogSlice.actions
export default DialogSlice.reducer