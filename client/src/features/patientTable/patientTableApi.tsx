import { prepareHeaders } from "@/utils/util"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export namespace PatientTable {
  export interface LOT {
    biopsy_progression: string
    _id: string
    treatment: string
    drug_name_targeted: string
    drug_name_chemo: string
    drug_name_immuno: string
    date_of_start_of_treatment: string // Assuming this is a date string
    response_pet_ct: string
    intracranial_response: string
    progressed_on_line: string
    date_of_progression: string // Assuming this is a date string
    biopsy_line_of_progression: string
    ngs_at_progression: string
    ngs_result: string
    other_remarks: string
    patientId: string // Assuming this is a patient id
  }

  export interface SearchParams {
    order: string
    search: string
    page: number
    rowsPerPage: number
    sort: string
    cr_number: string
    name: string
    age: number
    gender: string
    state: string
    smoking: string
    family_history: string
    gene: string
    variant: string
    treatment_at_rgci: string
    phone_number: string
    status_at_last_follow_up: string
    date_of_last_follow_up: Date
    date_of_hpe_diagnosis: Date
    ecog_ps: string
    extrathoracic_mets: string
    brain_mets: string
    letptomeningeal_mets: string
    histology: string
    pdl1: string
    brg1: string
    ttf1: string
    small_cell_transformation_date: string
    vaf: string
    co_mutation: string
    biopsy_progression: string
    treatment: string
    drug_name_targeted: string
    drug_name_chemo: string
    drug_name_immuno: string
    date_of_start_of_treatment: string // Assuming this is a date string
    response_pet_ct: string
    intracranial_response: string
    progressed_on_line: string
    date_of_progression: string // Assuming this is a date string
    biopsy_line_of_progression: string
    ngs_at_progression: string
    ngs_result: string
    other_remarks: string
    patientId: string // Assuming this is a patient id
  }

  export interface Patient {
    _id: string
    cr_number: string
    name: string
    dob: Date
    gender: string
    state: string
    smoking: string
    family_history: string
    gene: string
    variant: string
    treatment_at_rgci: string
    phone_number: string
    status_at_last_follow_up: string
    date_of_last_follow_up: Date
    date_of_hpe_diagnosis: Date
    ecog_ps: string
    extrathoracic_mets: string
    brain_mets: string
    letptomeningeal_mets: string
    histology: string
    pdl1: string
    brg1: string
    ttf1: string
    small_cell_transformation_date: string
    vaf: string
    co_mutation: string
    lots?: LOT[]
    createdAt: Date
    updatedAt: Date
    is_new: boolean
  }

  export interface ReqGetPatientTable {
    page: number
    rowsPerPage: number
    sort: string
    order: string
    search: string
  }

  export interface ResGetPatientTable {
    patients: Patient[]
    totalCount: number
    success: boolean
  }

  export interface ResGetPatientById {
    patient: Patient
    success: boolean
  }

  export interface ResDeletePatient {
    success: boolean
    message: string
  }

  export interface ResUploadPatientData {
    success: boolean
    totalRows: number
    insertedRows: number
    failedRows: Array<number>
  }
}

const patientTableApi = createApi({
  reducerPath: "patientTable",
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.REACT_APP_API_URL}/patients`,
    prepareHeaders: prepareHeaders,
  }),
  endpoints: (builder) => ({
    getPatients: builder.query<PatientTable.ResGetPatientTable, string>({
      query: (url) => ({
        url: `get-patients?${url}`,
        method: "POST",
      }),
    }),
    getPatientById: builder.query<PatientTable.ResGetPatientById, string>({
      query: (patientId) => ({
        url: `/${patientId}`,
        method: "GET",
      }),
    }),
    addPatient: builder.mutation<PatientTable.Patient, PatientTable.Patient>({
      query: (body) => ({
        url: `/add-patient`,
        method: "POST",
        body,
      }),
    }),
    updatePatient: builder.mutation<PatientTable.Patient, PatientTable.Patient>(
      {
        query(data) {
          const { _id, ...body } = data
          return {
            url: `/update-patient/${_id}`,
            method: "PUT",
            body,
          }
        },
      },
    ),
    addLOT: builder.mutation<PatientTable.LOT, PatientTable.LOT>({
      query(data) {
        const { patientId, ...body } = data
        return {
          url: `${patientId}/add-lot`,
          method: "POST",
          body,
        }
      },
    }),
    updateLOT: builder.mutation<PatientTable.LOT, PatientTable.LOT>({
      query(data) {
        const { patientId, _id, ...body } = data
        return {
          url: `${patientId}/update-lot/${_id}`,
          method: "PUT",
          body,
        }
      },
    }),
    deleteLOT: builder.mutation<{}, string>({
      query: (id) => ({
        url: `/delete-lot/${id}`,
        method: "DELETE",
      }),
    }),
    getLOTs: builder.query<PatientTable.LOT[], string>({
      query: (patientId) => ({
        url: `${patientId}/get-lots/`,
        method: "GET",
      }),
    }),
    getLOT: builder.query<PatientTable.LOT, string>({
      query: (id) => ({
        url: `/get-lot/${id}`,
        method: "GET",
      }),
    }),
    deletePatients: builder.mutation<PatientTable.ResDeletePatient, string[]>({
      query: (ids) => ({
        url: `/delete-patients`,
        method: "DELETE",
        body: {
          patientIds: ids,
        },
      }),
    }),
    uploadPatientData: builder.mutation<
      PatientTable.ResUploadPatientData,
      FormData
    >({
      query: (data) => ({
        url: `/upload-patient-data`,
        method: "POST",
        body: data,
      }),
    }),
  }),
})

export default patientTableApi

export const {
  useGetPatientsQuery,
  useGetPatientByIdQuery,
  useAddPatientMutation,
  useUpdatePatientMutation,
  useAddLOTMutation,
  useUpdateLOTMutation,
  useDeleteLOTMutation,
  useGetLOTsQuery,
  useDeletePatientsMutation,
  useUploadPatientDataMutation,
} = patientTableApi
