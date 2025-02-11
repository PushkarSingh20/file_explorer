import { createSlice } from "@reduxjs/toolkit";

let initialState : {loading: Boolean} = {

    loading : false

}

const Loadingslice = createSlice({
    initialState,

    name: "loadingslice",
    reducers: {

        setLoadingSlice: (state, action) => {

            state.loading = action.payload

        }
        

    }
})

export const { setLoadingSlice } = Loadingslice.actions
export default Loadingslice.reducer