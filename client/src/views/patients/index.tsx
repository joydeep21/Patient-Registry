import { PatientTable } from "@/features/patientTable/PatientTable"
import { PageContainer } from "@ant-design/pro-components"
import React from "react"

const Patients = () => {
  return (
    <PageContainer title="Patients" >
      <PatientTable />
    </PageContainer>
  )
}

export default Patients
