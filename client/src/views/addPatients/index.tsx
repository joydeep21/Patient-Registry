import { AddPatientForm } from "@/features/addPatientForm/addPatientForm"
import { PageContainer } from "@ant-design/pro-components"
import React from "react"

const AddPatients = () => {
  return (
    <PageContainer
      title="Add Patient"
      onBack={() => {
        window.history.back()
      }}
      fixedHeader
    >
      <AddPatientForm />
    </PageContainer>
  )
}

export default AddPatients
