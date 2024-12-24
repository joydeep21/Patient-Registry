import { PageContainer } from "@ant-design/pro-components"
import { useNavigate } from "react-router-dom"
import UpdatePatients from "../updatePatients"

const PatientDetails = () => {
  const navigate = useNavigate()

  return (
    <PageContainer
      title="Patient Details"
      onBack={() => navigate("/patients")}
      fixedHeader
    >
      <UpdatePatients />
    </PageContainer>
  )
}

export default PatientDetails
