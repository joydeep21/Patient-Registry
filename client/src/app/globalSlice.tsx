import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store"

export interface UserInfo {
  user_id: string
  role: string
  name: string
  username: string
  email: string
  iat: number
  exp: number
}

export interface GlobalState {
  token: string | null
  userInfo: UserInfo | null
  breadcrumbList: {
    [propName: string]: any
  }
  isCollapse: boolean
  menuList: Menu.MenuOptions[]
}

const initialState: GlobalState = {
  token: null,
  userInfo: null,
  breadcrumbList: {},
  isCollapse: false,
  menuList: [],
}

const globalSlice = createSlice({
  name: "global",
  initialState: initialState,
  reducers: {
    setToken: (state: GlobalState, { payload }: PayloadAction<string>) => {
      if (payload === "" || payload === null) {
        state.userInfo = null
        state.token = null
      } else {
        state.token = payload
      }
    },
    setUserInfo: (state: GlobalState, { payload }: PayloadAction<any>) => {
      state.userInfo = payload
    },
    setBreadcrumbList: (
      state: GlobalState,
      { payload }: PayloadAction<{ [propName: string]: any }>,
    ) => {
      state.breadcrumbList = payload
    },
    updateCollapse: (
      state: GlobalState,
      { payload }: PayloadAction<boolean>,
    ) => {
      state.isCollapse = payload
    },
    setMenuList: (
      state: GlobalState,
      { payload }: PayloadAction<Menu.MenuOptions[]>,
    ) => {
      state.menuList = payload
    },
    logout: () => {
      return initialState
    },
  },
})

export const selectToken = (state: RootState) => state.global.token
export const selectUserInfo = (state: RootState) => state.global.userInfo

export const {
  logout,
  setToken,
  setBreadcrumbList,
  setMenuList,
  setUserInfo,
  updateCollapse,
} = globalSlice.actions

export default globalSlice.reducer
