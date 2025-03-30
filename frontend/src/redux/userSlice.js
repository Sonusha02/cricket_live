import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  balance: 0,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.balance = action.payload.balance;
    },
    logout: (state) => {
      state.user = null;
      state.balance = 0;
    },
    updateBalance: (state, action) => {
      state.balance = action.payload;
    },
  },
});

export const { loginSuccess, logout, updateBalance } = userSlice.actions;
export default userSlice.reducer;
