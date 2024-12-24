import AddLOTForm from "@/features/addLOTForm"
import { PageContainer } from "@ant-design/pro-components"
import React from "react"

const AddLOT = () => {
  return (
    <PageContainer
      title={"Add LOT"}
      fixedHeader
      onBack={() => window.history.back()}
    >
      <AddLOTForm />
    </PageContainer>
  )
}

export default AddLOT
