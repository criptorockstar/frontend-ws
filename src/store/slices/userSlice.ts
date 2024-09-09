import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUserState {
  id?: string;
  username?: string;
  email?: string;
  avatar?: string;
  level?: string;
  exp?: number;
  credits?: number;
}

const initialState: IUserState = {
  id: undefined,
  username: undefined,
  email: undefined,
  avatar: undefined,
  level: undefined,
  exp: undefined,
  credits: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserState: (
      state: IUserState,
      action: PayloadAction<Partial<IUserState>>,
    ): IUserState => {
      return { ...state, ...action.payload };
    },
    clearUserState: (_: IUserState): IUserState => {
      return { ...initialState };
    },
  },
});

export const { setUserState, clearUserState } = userSlice.actions;
export const userReducer = userSlice.reducer;
