import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  endpoints: (builder) => ({
    getLiveMatches: builder.query({
      query: () => "/matches/live",
    }),
    placeBet: builder.mutation({
      query: (betData) => ({
        url: "/bets/place",
        method: "POST",
        body: betData,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    getUserBets: builder.query({
      query: () => "/bets/my-bets",
    }),
  }),
});

export const { useGetLiveMatchesQuery, usePlaceBetMutation, useGetUserBetsQuery } = apiSlice;

export const apiSlice2 = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  endpoints: (builder) => ({
    getTransactions: builder.query({ query: () => "/wallet/transactions" }),
    addDeposit: builder.mutation({
      query: (data) => ({
        url: "/wallet/deposit",
        method: "POST",
        body: data,
        formData: true,
      }),
    }),
  }),
});

export const { useGetTransactionsQuery, useAddDepositMutation } = apiSlice;

export const apiSlice3 = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  endpoints: (builder) => ({
    getPendingDeposits: builder.query({ query: () => "/wallet/admin/pending" }),
    approveDeposit: builder.mutation({
      query: ({ id, status }) => ({
        url: `/wallet/admin/approve/${id}`,
        method: "PUT",
        body: { status },
      }),
    }),
  }),
});

export const { useGetPendingDepositsQuery, useApproveDepositMutation } = apiSlice;


