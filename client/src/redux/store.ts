import {configureStore} from '@reduxjs/toolkit'
import DataSlice from './Data/slice'
import UserSlice from './user/slice'
import Basequeries from './apis/basequeries'
import upaths from './upaths/slice'
import activepath from './upaths/activepath'
import  SliceSelected  from './selected/slice'
import ErrorSlice from './Errors/slice'
import MessageSlice from './Message/slice'
import DialogSlice from './Dialog/slice'


export const store = configureStore({

    reducer : {
        
        DataSlice : DataSlice,
        UserSlice: UserSlice,
        upaths: upaths,
        activepath: activepath,
        SliceSelected: SliceSelected,
        ErrorSlice : ErrorSlice,
        MessageSlice: MessageSlice,
        DialogSlice: DialogSlice,
        [Basequeries.reducerPath] : Basequeries.reducer
        
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(Basequeries.middleware)
    
})

    
export type RootState = ReturnType<typeof store.getState>;