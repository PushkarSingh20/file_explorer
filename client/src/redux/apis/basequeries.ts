import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

export const Basequeries = createApi({
  reducerPath: 'basequeries',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/' }),
  endpoints: (builder) => ({
    getBaseQuery: builder.query({ 
      query: (name : string) => `${name}`,
    }),

    getdata: builder.mutation({ 
        query: ({ path , method , data }) => ({
          url: path,
          method: method,
          headers: {
            "Content-Type": "application/json",

          },
          body : JSON.stringify(data)


        })
    }),

  }),
});


export const { useGetBaseQueryQuery , useGetdataMutation } = Basequeries; 
export default Basequeries;
