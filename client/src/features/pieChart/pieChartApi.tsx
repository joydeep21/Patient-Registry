import { prepareHeaders } from "@/utils/util"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export namespace PieChartApi {
  export interface PieChartRes {
    message: string
    chartData: [
      {
        type: string
        value: number
      },
    ]
  }

  export interface PieChartReq {
    field: string,
    filter:any
  }
}

const pieChartApi = createApi({
  reducerPath: "pieChart",
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.REACT_APP_API_URL}/charts`,
    prepareHeaders: prepareHeaders,
  }),
  endpoints: (builder) => ({
    getPieChart: builder.query<
      PieChartApi.PieChartRes,
      PieChartApi.PieChartReq
    >({
      query: (data) => ({
        url: `/pie-chart`,
        method: "POST",
        body: data,
      }),
    }),
  }),
})

export default pieChartApi

export const { useGetPieChartQuery } = pieChartApi
