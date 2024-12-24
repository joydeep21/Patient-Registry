import { prepareHeaders } from "@/utils/util"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export namespace NUsersTable {
  export interface User {
    _id: string
    name: string
    email: string
    password: string
    role: string
    createdAt: string
    updatedAt: string
  }

  export interface SearchParams {
    page: number
    rowsPerPage: number
    search?: string
    orderBy?: string
    order?: string
  }

  export interface ResGetUsers {
    users: User[]
    totalCount: number
  }

  export interface ResGetUserById {
    data: User
  }

  export interface ResAddUser {
    message: string
    success: boolean
  }

  export interface ResUpdateUser {
    message: string
    success: boolean
  }

  export interface ResDeleteUser {
    message: string
    success: boolean
  }
}

const userTableApi = createApi({
  reducerPath: "usersTable",
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.REACT_APP_API_URL}/users`,
    prepareHeaders: prepareHeaders,
  }),
  endpoints: (builder) => ({
    getUsers: builder.query<NUsersTable.ResGetUsers, string>({
      query: (url) => ({
        url: `/get-users?${url}`,
        method: "POST",
      }),
    }),
    getUserById: builder.query<NUsersTable.ResGetUserById, string>({
      query: (userId) => ({
        url: `/${userId}`,
        method: "GET",
      }),
    }),
    addUser: builder.mutation<NUsersTable.ResAddUser, NUsersTable.User>({
      query: (body) => ({
        url: `/add`,
        method: "POST",
        body,
      }),
    }),
    updateUser: builder.mutation<NUsersTable.ResUpdateUser, NUsersTable.User>({
      query(data) {
        const { _id, ...body } = data
        return {
          url: `/update/${_id}`,
          method: "PUT",
          body,
        }
      },
    }),
    deleteUser: builder.mutation<NUsersTable.ResDeleteUser, string>({
      query: (userId) => ({
        url: `/delete/${userId}`,
        method: "DELETE",
      }),
    }),
  }),
})

export default userTableApi

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userTableApi
