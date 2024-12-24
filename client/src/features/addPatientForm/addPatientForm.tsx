import {
  ProCard,
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components"
import { App, Button, Card, Divider, Popconfirm, message } from "antd"
import patientTableApi, {
  PatientTable,
  useDeleteLOTMutation,
} from "../patientTable/patientTableApi"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import {
  brainMetastasesOptions,
  brg1Options,
  ecogPSOptions,
  extrathoracicMetastasesOptions,
  familyHistoryOptions,
  genderOptions,
  geneOptions,
  histoloyOptions,
  indianStates,
  leptomeningealMetastasesOptions,
  lmMetsOptions,
  pdl1Options,
  smokingStatusOptions,
  statusAtLastFollowUpOptions,
  treatmentAtRGCIOptions,
  ttf1Options,
} from "@/utils/constants"

import { PlusOutlined, EditTwoTone, DeleteTwoTone } from "@ant-design/icons"
import dayjs from "dayjs"

function LOTTable({
  patientId,
  data,
  getPatientLOTs,
  deleteLOT,
  deleteLOTResponse,
}: {
  patientId: string
  data: PatientTable.LOT[]
  getPatientLOTs: () => void
  deleteLOT: (id: string) => void
  deleteLOTResponse: any
}) {
  const navigate = useNavigate()

  function parseHeader(index: number) {
    switch (index) {
      case 0:
        return "1st"
      case 1:
        return "2nd"
      case 2:
        return "3rd"
      case 3:
        return "4th"
      case 4:
        return "5th"
    }
  }

  return (
    <ProForm.Group
      titleStyle={{
        cursor: "pointer",
      }}
      labelLayout="inline"
      extra={
        <Button
          key="button"
          type="primary"
          icon={<PlusOutlined />}
          disabled={data?.length === 5}
          onClick={() => {
            navigate(`/patients/${patientId}/add-lot`, {
              state: { isEdit: false },
            })
          }}
        >
          Add LOT
        </Button>
      }
    >
      <Card className="overflow-x-auto">
        <table className="table-auto border-none border-gray-700">
          <tbody className="flex justify-between">
            <tr className="flex justify-between border-b flex-col bg-blue-50">
              <th className="px-4 py-2 border text-xs text-black-500 uppercase tracking-wider font-bold">
                <Button key="button" type="text">
                  LINE OF TREATMENT
                </Button>
              </th>
              <th className="text-left border px-4 py-2">Treatment</th>
              <th className="text-left border px-4 py-2">Drug Name Targeted</th>
              <th className="text-left border px-4 py-2">Drug Name Chemo</th>
              <th className="text-left border px-4 py-2">Drug name Immuno</th>
              <th className="text-left border px-4 py-2">
                Date of start of treatment
              </th>
              <th className="text-left border px-4 py-2">Response pet ct</th>
              <th className="text-left border px-4 py-2">
                Intracranial response
              </th>
              <th className="text-left border px-4 py-2">Progressed on line</th>
              <th className="text-left border px-4 py-2">
                Date of progression
              </th>
              <th className="text-left border px-4 py-2">
                Biopsy line of progression
              </th>
              <th className="text-left border px-4 py-2">NGS at progression</th>
              <th className="text-left border px-4 py-2">NGS result</th>
            </tr>
            {data?.map((item, index) => (
              <tr
                key={index}
                className="flex justify-between border-b flex-col"
              >
                <th
                  key={index}
                  className="px-4 py-2 border text-left text-xs text-black-500 uppercase tracking-wider font-bold items-center flex justify-between"
                >
                  {parseHeader(index)}
                  <Button
                    type="text"
                    style={{
                      fontWeight: 700,
                    }}
                    onClick={() => {
                      navigate(
                        `/patients/${patientId}/update-lot/${item._id}`,
                        {
                          state: { patientLOT: item, isEdit: true },
                        },
                      )
                    }}
                    icon={<EditTwoTone />}
                  />
                  {index === data.length - 1 ? (
                    <Popconfirm
                      title="Delete the LOT"
                      description="Are you sure to delete this LOT?"
                      onConfirm={() => {
                        deleteLOT(item._id)
                        if (deleteLOTResponse) {
                          message.success({
                            content: "LOT deleted successfully",
                          })
                          getPatientLOTs()
                        }
                      }}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        type="text"
                        style={{
                          fontWeight: 700,
                        }}
                        disabled={index !== data.length - 1}
                        danger
                        icon={<DeleteTwoTone twoToneColor="red" />}
                      />
                    </Popconfirm>
                  ) : null}
                </th>
                <td className="border px-4 py-2 flex-1">{item.treatment}</td>
                <td className="border px-4 py-2 flex-1">
                  {item.drug_name_targeted}
                </td>
                <td className="border px-4 py-2 flex-1">
                  {item.drug_name_chemo}
                </td>
                <td className="border px-4 py-2 flex-1">
                  {item.drug_name_immuno}
                </td>
                <td className="border px-4 py-2 flex-1">
                  {item.date_of_start_of_treatment ? (
                    <span>
                      {dayjs(item.date_of_start_of_treatment).format(
                        "DD/MM/YYYY",
                      )}
                    </span>
                  ) : null}{" "}
                </td>
                <td className="border px-4 py-2 flex-1">
                  {item.response_pet_ct}
                </td>
                <td className="border px-4 py-2 flex-1">
                  {item.intracranial_response}
                </td>
                <td className="border px-4 py-2 flex-1">
                  {item.progressed_on_line}
                </td>
                <td className="border px-4 py-2 flex-1">
                  {item.date_of_progression ? (
                    <span>
                      {dayjs(item.date_of_progression).format("DD/MM/YYYY")}
                    </span>
                  ) : null}
                </td>
                <td className="border px-4 py-2 flex-1">
                  {item.biopsy_progression}
                </td>
                <td className="border px-4 py-2 flex-1">
                  {item.ngs_at_progression}
                </td>
                <td className="border px-4 py-2 flex-1">{item.ngs_result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </ProForm.Group>
  )
}

export function AddPatientForm() {
  const [form] = ProForm.useForm()

  const params = useParams()

  const { id } = params

  const { message } = App.useApp()

  const onFinishFailed = (errorInfo: any) => {
    message.error({
      content: "Something went wrong",
    })
  }

  const { useAddPatientMutation, useGetPatientByIdQuery } = patientTableApi

  const [deleteLOT, deleteLOTResponse] = useDeleteLOTMutation()

  const {
    data,
    error,
    isLoading: isPatientLoading,
    refetch,
  } = useGetPatientByIdQuery(id!, {
    skip: !id,
  })

  useEffect(() => {
    if (id) {
      refetch()
    }
    if (data?.patient) {
      form.setFieldsValue(data?.patient)
    }

    if (error) {
      message.error({
        content: "Something went wrong",
      })
    }
  }, [form, data, refetch, id, error, message])

  const [addPatient, { isLoading: isPatientMutating }] = useAddPatientMutation()

  const onFinish = async (values: any) => {
    const { _id, ...body } = values
    addPatient(body)
    message.success({ content: "Patient added successfully" })
  }

  return (
    <div className="flex flex-col gap-4">
      <ProCard>
        <ProForm<PatientTable.Patient>
          layout="vertical"
          form={form}
          dateFormatter="string"
          onFinish={onFinish}
          labelAlign="left"
          labelCol={{
            style: {
              fontWeight: 600,
            },
          }}
          loading={isPatientLoading || isPatientMutating}
          onFinishFailed={onFinishFailed}
          submitter={{
            searchConfig: {
              submitText: "Save",
            },
            render: (_, dom) => dom.pop(),
          }}
          // initialValues={{ remember: true }}
        >
          <ProForm.Group
            title="Bio"
            collapsible
            titleStyle={{
              cursor: "pointer",
            }}
            labelLayout="inline"
          >
            <ProFormText
              label="CR Number"
              name="cr_number"
              width={"sm"}
              validateFirst
              rules={[
                {
                  required: true,
                  message: "Please enter the CR Number",
                },
                {
                  pattern: /^[0-9]*$/,
                  message: "Please enter a valid CR Number",
                },
              ]}
            />
            <ProFormText
              label="Name"
              name="name"
              width={"sm"}
              rules={[
                {
                  required: true,
                  message: "Please enter the name",
                },
                {
                  pattern: /^[a-zA-Z\s]*$/,
                  message: "Please enter a valid name",
                },
                {
                  min: 3,
                  message: "Please enter a valid name",
                },
              ]}
            />
            <ProFormDatePicker
              label="Date of Birth"
              name="dob"
              width={"sm"}
              fieldProps={{
                format: (value) => value.format("DD/MM/YYYY"),
              }}
            />
            <ProFormSelect
              label="Gender"
              name="gender"
              width={"sm"}
              options={genderOptions}
              placeholder="Please select your gender"
            />
            <ProFormSelect
              label="State"
              name="state"
              width={"sm"}
              options={indianStates}
              showSearch
              placeholder="Please select your state"
            />

            <ProFormSelect
              label="Smoking"
              name="smoking"
              options={smokingStatusOptions}
              width={"sm"}
              placeholder="Please select smoking status"
            />

            <ProFormSelect
              label="Family History"
              name="family_history"
              options={familyHistoryOptions}
              width={"sm"}
              placeholder="Please select Family History"
            />

            <ProFormSelect
              label="Gene"
              name="gene"
              options={geneOptions}
              width={"sm"}
              placeholder="Please select the Gene"
            />

            <ProFormText label="Variant" name="variant" width={"sm"} />

            <ProFormSelect
              label="Treatment at RGCI"
              name="treatment_at_rgci"
              width={"sm"}
              options={treatmentAtRGCIOptions}
            />

            <ProFormText
              label="Phone Number"
              name="phone_number"
              width={"sm"}
            />

            <ProFormSelect
              label="Status at Last Follow-up"
              name="status_at_last_follow_up"
              width={"sm"}
              options={statusAtLastFollowUpOptions}
            />

            <ProFormDatePicker
              label="Date of Last Follow-up"
              name="date_of_last_follow_up"
              width={"sm"}
              fieldProps={{
                format: (value) => value.format("DD/MM/YYYY"),
              }}
            />
          </ProForm.Group>

          <Divider />

          <ProForm.Group
            title="Progressive Data"
            collapsible
            titleStyle={{
              cursor: "pointer",
            }}
            labelLayout="inline"
          >
            <ProForm.Group>
              <ProFormDatePicker
                label="Date of HPE Diagnosis"
                name="date_of_hpe_diagnosis"
                width={"sm"}
                fieldProps={{
                  format: (value) => value.format("DD/MM/YYYY"),
                }}
              />
              <ProFormSelect
                label="ECOG_PS"
                name="ecog_ps"
                width={"sm"}
                options={ecogPSOptions}
              />
              <ProFormSelect
                label="Extrathoracic Mets"
                name="extrathoracic_mets"
                width={"sm"}
                options={extrathoracicMetastasesOptions}
              />
              <ProFormSelect
                label="Brain Mets"
                name="brain_mets"
                width={"sm"}
                options={brainMetastasesOptions}
              />
              <ProFormSelect
                label="Letptomeningeal Mets"
                name="letptomeningeal_mets"
                width={"sm"}
                options={leptomeningealMetastasesOptions}
              />
              <ProFormSelect
                label="Histology"
                name="histology"
                width={"md"}
                options={histoloyOptions}
              />
              <ProFormSelect
                label="PDL1"
                name="pdl1"
                width={"sm"}
                options={pdl1Options}
              />
              <ProFormSelect
                label="BRG1"
                name="brg1"
                width={"sm"}
                options={brg1Options}
              />
              <ProFormSelect
                label="TTF1"
                name="ttf1"
                width={"sm"}
                options={ttf1Options}
              />
              <ProFormDatePicker
                label="Small Cell Transformation Date"
                name="small_cell_transformation_date"
                fieldProps={{
                  format: (value) => value.format("DD/MM/YYYY"),
                }}
                width={"sm"}
              />
              <ProFormText label="VAF" name="vaf" width={"sm"} />
              <ProFormText
                label="Co-Mutation"
                name="co_mutation"
                width={"sm"}
              />
            </ProForm.Group>
          </ProForm.Group>
        </ProForm>
      </ProCard>

      <ProCard>
        <LOTTable
          patientId={id!}
          data={data?.patient?.lots || []}
          getPatientLOTs={refetch}
          deleteLOT={deleteLOT}
          deleteLOTResponse={deleteLOTResponse}
        />
      </ProCard>
    </div>
  )
}
