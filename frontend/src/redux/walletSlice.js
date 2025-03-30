import { createSlice } from "@reduxjs/toolkit";

const walletSlice = createSlice({
  name: "wallet",
  initialState: { transactions: [], loading: false },
  reducers: {
    setTransactions: (state, action) => { state.transactions = action.payload; },
  },
});

export const { setTransactions } = walletSlice.actions;
export default walletSlice.reducer;
