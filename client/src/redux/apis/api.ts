
import { createAsyncThunk } from '@reduxjs/toolkit'


export const ApiThunkFunc = createAsyncThunk('apidata/fetchMainData', async (path: string, ThunkApi) => {
  try {
    const response = await fetch(`http://localhost:5000${path}`);
    if (!response.ok) {
      
      return ThunkApi.rejectWithValue("An error occurred!");
    }
    const data = await response.json();
    return ThunkApi.fulfillWithValue(data) ;
  } catch (error) {
    console.log(error)
    return ThunkApi.rejectWithValue(error);
  }
});

