import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface LoginState {
  status: "idle" | "loading" | "failed"
}

const initialState: LoginState = {
  status: "idle",
}

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    login: (state: LoginState, { payload }: PayloadAction<any>) => {
      state.status = payload.status
    },
  },
})
