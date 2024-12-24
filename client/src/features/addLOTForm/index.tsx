import {
  ProCard,
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components"
import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import patientTableApi from "../patientTable/patientTableApi"
import { message } from "antd"
import {
  drugsChemo,
  drugsImmuno,
  drugsTargeted,
  intracranialResponseOptions,
  petCetOptions,
  treatmentOptions,
} from "@/utils/constants"

const AddLOTForm = ({ isEdit }: { isEdit?: boolean }) => {
  const params = useParams()

  const { id } = params

  const [form] = ProForm.useForm()
  const [selectedTreatment, setSelectedTreatment] = useState<
    string | undefined
  >(undefined)

  const onFinishFailed = (errorInfo: any) => {
    message.error({
      content: `
        Failed to ${isEdit ? "update" : "add"} LOT
      `,
    })
  }

  const { useAddLOTMutation } = patientTableApi

  const [addLOT, { isLoading }] = useAddLOTMutation()
  const navigate = useNavigate()

  const onFinish = async (values: any) => {
    addLOT({
      patientId: id,
      ...values,
    })
    message.success({ content: "LOT added successfully" })
    navigate(`/patients/${id}/update-patient`)
  }

  const handleTreatmentChange = (value: string) => {
    setSelectedTreatment(value)
  }

  return (
    <ProCard>
      <ProForm
        name="Add LOT"
        layout="vertical"
        form={form}
        onFinish={onFinish}
        loading={isLoading}
        labelAlign="left"
        labelCol={{
          style: {
            fontWeight: 600,
          },
        }}
        onFinishFailed={onFinishFailed}
        initialValues={{ remember: true }}
        submitter={{
          searchConfig: {
            submitText: "Save",
            resetText: "Cancel",
          },
          onReset: () => {
            navigate(`/patients/${id}/update-patient`, {
              state: {
                patientId: id,
                isEdit: false,
              },
            })
          },
        }}
      >
        <ProForm.Group>
          <ProFormSelect
            label="Treatment"
            name="treatment"
            width={"sm"}
            showSearch
            options={treatmentOptions}
            placeholder="Please select your treatment"
            onChange={handleTreatmentChange}
          />

          <ProFormSelect
            label="Drug Targeted"
            name="drug_name_targeted"
            options={drugsTargeted}
            width={"sm"}
            showSearch
            placeholder="Please select the drug"
            disabled={selectedTreatment !== "Targeted"}
          />
          <ProFormSelect
            options={drugsChemo}
            label="Drug Name Chemotherapy"
            name="drug_name_chemo"
            width={"sm"}
            showSearch
            placeholder="Please select the drug"
            disabled={
              selectedTreatment !== "Chemotherapy" &&
              selectedTreatment !== "Chemo-immuno"
            }
          />

          <ProFormSelect
            label="Drug Immunotherapy"
            name="drug_name_immuno"
            options={drugsImmuno}
            width={"sm"}
            showSearch
            placeholder="Please select the drug"
            disabled={
              selectedTreatment !== "Immunotherapy" &&
              selectedTreatment !== "Chemo-immuno"
            }
          />

          <ProFormDatePicker
            label="Date start of Treatment"
            name="date_of_start_of_treatment"
            width={"sm"}
            fieldProps={{
              format: (value) => value.format("DD/MM/YYYY"),
            }}
          />

          <ProFormSelect
            label="Response PET CT"
            name="response_pet_ct"
            options={petCetOptions}
            width={"sm"}
            showSearch
            placeholder="Please select response PET CT"
          />

          <ProFormSelect
            label="Intracranial Response"
            name="intracranial_response"
            options={intracranialResponseOptions}
            width={"md"}
            showSearch
            placeholder="Please select response PET CT"
          />

          <ProFormSelect
            label="Is Progressed"
            name="progressed_on_line"
            width={"sm"}
            options={[
              {
                value: "Progressed",
                label: "Progressed",
              },
              {
                value: "Not_progressed",
                label: "Not Progressed",
              },
              {
                value: "LFU",
                label: "LFU",
              },
            ]}
            showSearch
            placeholder="Has the patient progressed ?"
          />

          <ProFormDatePicker
            width={"sm"}
            label="Date of Progression"
            name="date_of_progression"
            fieldProps={{
              format: (value) => value.format("DD/MM/YYYY"),
            }}
          />

          <ProFormSelect
            label="Biopsy"
            name="biopsy_progression"
            width={"sm"}
            options={[
              {
                value: "Yes",
                label: "Yes",
              },
              {
                value: "No",
                label: "No",
              },
            ]}
            showSearch
            placeholder="Biopsy"
          />

          <ProFormSelect
            label="NGS at progression"
            name="ngs_at_progression"
            width={"sm"}
            options={[
              {
                value: "Yes",
                label: "Yes",
              },
              {
                value: "No",
                label: "No",
              },
            ]}
            showSearch
            placeholder="NGS at progression"
          />

          <ProFormText
            label="NGS Result"
            name="ngs_result"
            width={"sm"}
            placeholder="NGS result"
          />

          <ProFormText
            label="Other Remarks"
            name="other_remarks"
            width={"md"}
            placeholder="Other Remarks"
          />
        </ProForm.Group>
      </ProForm>
    </ProCard>
  )
}

export default AddLOTForm
