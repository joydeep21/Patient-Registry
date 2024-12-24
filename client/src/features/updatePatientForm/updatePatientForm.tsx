import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  
} from "@ant-design/pro-components"
import { App, Button, Card, Divider, Popconfirm, message,Switch,Modal } from "antd"
import patientTableApi, {
  PatientTable,
  useDeleteLOTMutation,
} from "../patientTable/patientTableApi"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect,useState } from "react"
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
import { ArrowLeftIcon } from "lucide-react"

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

export function UpdatePatientForm() {
  const [form] = ProForm.useForm()
  const [isEditable, setIsEditable] = useState(false); //handel state for toggle
  const [confirmVisible, setConfirmVisible] = useState(false);

  const params = useParams()

  const { id } = params

  const { message } = App.useApp()

  const onFinishFailed = (errorInfo: any) => {
    message.error({
      content: "Something went wrong",
    })
  }

  const { useUpdatePatientMutation, useGetPatientByIdQuery } = patientTableApi

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

    if (data) {
      form.setFieldsValue(data?.patient)
    }

    if (error) {
      message.error({
        content: "Something went wrong",
      })
    }
  }, [form, data, refetch, id, error, message])

  const [updatePatient, { isLoading: isPatientMutating, isError }] =
    useUpdatePatientMutation()

  const onFinish = async (values: any) => {
    const { _id, ...rest } = values
    updatePatient({
      _id: id,
      ...rest,
    })
    if (isError) {
      message.error({
        content: "Something went wrong",
      })
    } else {
      setIsEditable(false)
      message.success({ content: "Patient updated successfully" })
    }
  }

  const navigate = useNavigate()

  const handleToggle = () => {
    if (isEditable) {
      setIsEditable(false); // Directly set to frozen state if editable
    } else {
      setConfirmVisible(true); // Show confirmation if switching from frozen to freeze
    }
  };

  const handleConfirmOk = () => {
    setIsEditable(true); // Set to freeze if user confirms
    setConfirmVisible(false); // Close modal
  };

  const handleConfirmCancel = () => {
    setConfirmVisible(false); // Close modal without changing state
  };

  return (
    <>
    <Modal
        title="Confirmation"
        visible={confirmVisible}
        onOk={handleConfirmOk}
        onCancel={handleConfirmCancel}
        okText="Confirm"
        cancelText="Cancel"
      >
        Please confirm if u want to edit the Bio Parameters
      </Modal>
    
    <PageContainer
      // title={
      //   data?.patient.name + " (" + data?.patient.cr_number + ")" ||
      //   "Patient Details"
      // }
      header={{
        children: (
          <div className="flex gap-4 items-center">
            <Button
              key="button"
              type="text"
              icon={<ArrowLeftIcon />}
              onClick={() => window.history.back()}
            />
            <div className="flex flex-col">
              <div className="font-semibold text-xl">
                {data?.patient.name} {"("}
                {data?.patient.cr_number}
                {")"}
              </div>
            </div>
            <div className="flex flex-1 flex-row gap-4 justify-end">
              <div className="flex flex-col">
                <div className="font-semibold">Date of Last Follow Up</div>
                <div>
                  {data?.patient.date_of_last_follow_up
                    ? dayjs(data?.patient.date_of_last_follow_up).format(
                        "DD/MM/YYYY",
                      )
                    : "N/A"}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="font-semibold">Status at Last Follow Up</div>
                <div>{data?.patient.status_at_last_follow_up || "N/A"}</div>
              </div>
            </div>
          </div>
        ),
      }}
      fixedHeader
    >
      <div className="flex flex-col gap-4">
        <ProCard
          collapsible
          defaultCollapsed
          title="Line of Treatments"
          extra={
            <Button
              key="button"
              type="primary"
              icon={<PlusOutlined />}
              disabled={data?.patient?.lots?.length === 5}
              onClick={() => {
                navigate(`/patients/${id}/add-lot`)
              }}
            >
              Add LOT
            </Button>
          }
        >
          <LOTTable
            patientId={id!}
            data={data?.patient?.lots || []}
            getPatientLOTs={refetch}
            deleteLOT={deleteLOT}
            deleteLOTResponse={deleteLOTResponse}
          />
        </ProCard>
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
          >
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

            <Divider />
           
            <ProForm.Group
        title="Bio"
        collapsible
        titleStyle={{
          cursor: 'pointer',
        }}
        labelLayout="inline"
        extra={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '16px' }}>{isEditable ? 'Lock Bio' : 'Edit Bio'}</div>
            {/* Add the toggle button  to toggle the field editable or non editable */}
            <Switch checked={isEditable} onChange={handleToggle} />
          </div>
        }
      >
               {/* <div style={{ justifyContent: 'right', alignItems: 'right' }}>
             
             <Switch checked={isEditable} onChange={(checked) => handleToggle(checked)} />
           </div> */}
             <ProFormText
        label="CR Number"
        name="cr_number"
        width={"sm"}
        disabled={!isEditable} // Disable field based on isEditable state
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
        disabled={!isEditable} // Disable field based on isEditable state
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
        disabled={!isEditable} // Disable field based on isEditable state
        fieldProps={{
          format: (value) => value.format("DD/MM/YYYY"),
        }}
      />
      <ProFormSelect
        label="Gender"
        name="gender"
        width={"sm"}
        disabled={!isEditable} // Disable field based on isEditable state
        options={genderOptions}
        placeholder="Please select your gender"
      />
      <ProFormSelect
        label="State"
        name="state"
        width={"sm"}
        disabled={!isEditable} // Disable field based on isEditable state
        options={indianStates}
        showSearch
        placeholder="Please select your state"
      />

      <ProFormSelect
        label="Smoking"
        name="smoking"
        disabled={!isEditable} // Disable field based on isEditable state
        options={smokingStatusOptions}
        width={"sm"}
        placeholder="Please select smoking status"
      />

      <ProFormSelect
        label="Family History"
        name="family_history"
        disabled={!isEditable} // Disable field based on isEditable state
        options={familyHistoryOptions}
        width={"sm"}
        placeholder="Please select Family History"
      />

      <ProFormSelect
        label="Gene"
        name="gene"
        disabled={!isEditable} // Disable field based on isEditable state
        options={geneOptions}
        width={"sm"}
        placeholder="Please select the Gene"
      />

      <ProFormText label="Variant" name="variant" width={"sm"} disabled={!isEditable} />

      <ProFormSelect
        label="Treatment at RGCI"
        name="treatment_at_rgci"
        disabled={!isEditable} // Disable field based on isEditable state
        width={"sm"}
        options={treatmentAtRGCIOptions}
      />

      <ProFormText
        label="Phone Number"
        name="phone_number"
        width={"sm"}
        disabled={!isEditable} // Disable field based on isEditable state
      />

      <ProFormSelect
        label="Status at Last Follow-up"
        name="status_at_last_follow_up"
        width={"sm"}
        disabled={!isEditable} // Disable field based on isEditable state
        options={statusAtLastFollowUpOptions}
      />

      <ProFormDatePicker
        label="Date of Last Follow-up"
        name="date_of_last_follow_up"
        width={"sm"}
        disabled={!isEditable} // Disable field based on isEditable state
        fieldProps={{
          format: (value) => value.format("DD/MM/YYYY"),
        }}
      />
            </ProForm.Group>
          </ProForm>
        </ProCard>
      </div>
    </PageContainer>
    </>
  )
}
