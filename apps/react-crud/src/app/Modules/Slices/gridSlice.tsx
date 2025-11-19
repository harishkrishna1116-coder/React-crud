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
  phone?: number;
  website?: string;
  button?: any;
}

export interface Comment {
  postId: number;
  id: string;
  name: string;
  email: string;
  body: string;
  button?: any;
}

export interface Post {
  userId: number;
  id: string;
  title: string;
  body: string;
  button?: any;
}

export type ApiEndPoint = 'users' | 'comments' | 'posts';

// export enum ApiEndPointEnum {
//   Users = 'users',
//   Comments = 'comments',
//   Posts = 'posts',
// }

type BodyMap = {
  users: Partial<User>;
  comments: Partial<Comment>;
  posts: Partial<Post>;
};

export const GridApi = createApi({
  reducerPath: 'gridApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/' }),
  tagTypes: ['User', 'Comment', 'Post'],
  endpoints: (builder) => ({
    getData: builder.query<User[] | Comment[] | Post[], ApiEndPoint>({
      query: (endpoint) => `${endpoint}`,
      providesTags: (result, error, endpoint) => [
        endpoint === 'users'
          ? 'User'
          : endpoint === 'comments'
          ? 'Comment'
          : 'Post',
      ],
    }),
    addData: builder.mutation<
      User[] | Comment[] | Post[],
      { endpoint: ApiEndPoint; body: BodyMap[ApiEndPoint] }
    >({
      query: ({ endpoint, body }) => ({
        url: `/${endpoint}`,
        method: 'POST',
        body,
      }),
    }),
    updateData: builder.mutation<
      User[] | Comment[] | Post[],
      { endpoint: ApiEndPoint; body: BodyMap[ApiEndPoint] }
    >({
      query: ({ endpoint, body }) => ({
        url: `/${endpoint}/${body.id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { endpoint }) => [
        endpoint === 'users'
          ? 'User'
          : endpoint === 'comments'
          ? 'Comment'
          : 'Post',
      ],
    }),
    deleteData: builder.mutation<
      { success: boolean; id: number },
      { endpoint: ApiEndPoint; id: number }
    >({
      query: ({ endpoint, id }) => ({
        url: `/${endpoint}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { endpoint }) => [
        endpoint === 'users'
          ? 'User'
          : endpoint === 'comments'
          ? 'Comment'
          : 'Post',
      ],
    }),
  }),
});

export const {
  useGetDataQuery,
  useAddDataMutation,
  useUpdateDataMutation,
  useDeleteDataMutation,
} = GridApi;
