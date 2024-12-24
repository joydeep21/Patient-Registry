import UpdateLOTForm from "@/features/updateLOTForm"
import { PageContainer } from "@ant-design/pro-components"
import React from "react"

const UpdateLOT = () => {
  return (
    <PageContainer
      title={"Update LOT"}
      fixedHeader
      onBack={() => window.history.back()}
    >
      <UpdateLOTForm />
    </PageContainer>
  )
}

export default UpdateLOT
