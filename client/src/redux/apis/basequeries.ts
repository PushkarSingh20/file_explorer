import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

export const Basequeries = createApi({
  reducerPath: 'basequeries',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/' }),
  endpoints: (builder) => ({
    getUsernamedata: builder.query({ 
      query: (name : string) => `${name}`,
    }),
  }),
});


export const { useGetUsernamedataQuery } = Basequeries; 
export default Basequeries;
