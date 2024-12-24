import { prepareHeaders } from "@/utils/util"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export namespace Login {
  export interface ReqLoginForm {
    username: string
    password: string
  }
  export interface ResLogin {
    token: string
  }
  export interface ResAuthButtons {
    [propName: string]: any
  }
}

const loginApi = createApi({
  reducerPath: "login",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.REACT_APP_API_URL}/auth`,
    prepareHeaders: prepareHeaders,
  }),
  endpoints: (builder) => ({
    login: builder.mutation<Login.ResLogin, Login.ReqLoginForm>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
    getAuthorButtons: builder.query<Login.ResAuthButtons, {}>({
      query: () => ({
        url: "/get-auth-buttons",
        method: "GET",
      }),
    }),
  }),
})

export default loginApi
