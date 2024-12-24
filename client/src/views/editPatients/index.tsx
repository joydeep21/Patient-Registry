import { PageContainer } from "@ant-design/pro-components"
import React from "react"

export const EditPatients = () => {
  return (
    <PageContainer
      title="Edit Patient"
      onBack={() => window.history.back()}
      fixedHeader
    >
      <div>Edit Patient</div>
    </PageContainer>
  )
}
