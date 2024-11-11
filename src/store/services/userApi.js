import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => 'user'
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: 'user',
        method: 'PUT',
        body: data
      })
    })
  })
});

export const { useGetUserQuery, useUpdateUserMutation } = userApi;