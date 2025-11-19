import {
  createApi,
  fetchBaseQuery,
  fakeBaseQuery,
} from '@reduxjs/toolkit/query/react';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  button?: any;
}

export interface Comment {
  postId: number;
  id: string;
  name: string;
  email: string;
  button?: any;
}

export interface Post {
  userId: number;
  id: string;
  title: string;
  body: string;
  button?: any;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/' }),
  tagTypes: ['User', 'Comment', 'Post'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => 'users',
      providesTags: ['User'],
    }),
    updateUsers: builder.mutation<User, Partial<User>>({
      query: (body) => ({
        url: `/users/${body.id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
      // invalidatesTags:(result,error,{id}) = [{type:'Users',id}]
    }),
    deleteUsers: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
    }),
    getComments: builder.query<Comment[], void>({
      query: () => 'comments',
    }),
    updateComments: builder.mutation<Comment, Partial<Comment>>({
      query: (body) => ({
        url: `/comments/${body.id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Comment'],
    }),
    deleteComments: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/comments/${id}`,
        method: 'DELETE',
      }),
    }),
    getPosts: builder.query<Post[], void>({
      query: () => 'posts',
      providesTags: ['Post'],
    }),
    addPosts: builder.mutation({
      query: (newUser) => ({
        url: '/posts',
        method: 'POST',
        body: newUser,
      }),
    }),
    updatePosts: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({
        url: `/posts/${body.id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Post'],
    }),
    updateMultiplePosts: builder.mutation<Post[], Post[]>({
      query: (body) => ({
        url: `/posts/batch`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Post'],
    }),
    deletePosts: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useUpdateUsersMutation,
  useDeleteUsersMutation,
  useGetCommentsQuery,
  useUpdateCommentsMutation,
  useDeleteCommentsMutation,
  useGetPostsQuery,
  useAddPostsMutation,
  useUpdatePostsMutation,
  useUpdateMultiplePostsMutation,
  useDeletePostsMutation,
} = api;
