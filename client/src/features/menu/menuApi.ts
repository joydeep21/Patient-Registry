import { prepareHeaders } from "@/utils/util"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export namespace Menus {
  export interface ResMenu {
    menus: Menu.MenuOptions[]
    success: boolean
    totalCount: number
  }

  export interface Meta {
    key: string
    title: string
    icon: string
    isLink: string
    isHide: boolean
    isFull: boolean
    isAffix: boolean
  }
  export interface PostReqMenu {
    path: string
    element: string
    meta: Meta
    role: string[]
    children?: PostReqMenu[]
  }
}

const menuApi = createApi({
  reducerPath: "menu",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.REACT_APP_API_URL}/menu`,
    prepareHeaders: prepareHeaders,
  }),
  endpoints: (builder) => ({
    getMenuList: builder.query<Menus.ResMenu, {}>({
      query: () => ({
        url: "/get-menus",
        method: "GET",
      }),
    }),
    addMenu: builder.mutation<Menus.ResMenu, Menus.PostReqMenu>({
      query: (body) => ({
        url: "/add-menu",
        method: "POST",
        body,
      }),
    }),
    updateMenu: builder.mutation<Menus.ResMenu, Menus.PostReqMenu>({
      query: (body) => ({
        url: "/update-menu",
        method: "PUT",
        body,
      }),
    }),
    deleteMenu: builder.mutation<Menus.ResMenu, string>({
      query: (id) => ({
        url: `/delete-menu/${id}`,
        method: "DELETE",
      }),
    }),
  }),
})

export default menuApi
