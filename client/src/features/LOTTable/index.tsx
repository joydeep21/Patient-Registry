import { ActionType, ProForm } from "@ant-design/pro-components"
import React, { useEffect } from "react"
import patientTableApi, {
  PatientTable as PatientTableT,
} from "../patientTable/patientTableApi"
import { PlusOutlined, EditTwoTone, DeleteTwoTone } from "@ant-design/icons"
import { useNavigate, useParams } from "react-router-dom"
import { Button, Card, Popconfirm, message } from "antd"

import dayjs from "dayjs"

export default function LOTTable({
  isLoading,
  data,
  getPatientLOTs,
  actionRef,
}: {
  isLoading: boolean
  data: PatientTableT.LOT[]
  getPatientLOTs: () => void
  actionRef: React.MutableRefObject<ActionType | undefined>
}) {
  const { useDeleteLOTMutation } = patientTableApi

  const navigate = useNavigate()

  const params = useParams()

  const { id: patientId } = params

  const [deleteLOT, deleteLOTResponse] = useDeleteLOTMutation()

  // const columns: ProColumns<PatientTableT.LOT>[] = [
  //   {
  //     dataIndex: "index",
  //     key: "indexBorder",
  //     valueType: "indexBorder",
  //     width: 48,
  //   },
  //   {
  //     title: "Treatment",
  //     dataIndex: "treatment",
  //   },
  //   {
  //     title: "Drug Name Targeted",
  //     dataIndex: "drug_name_targeted",
  //   },
  //   {
  //     title: "Drug Name Chemo",
  //     dataIndex: "drug_name_chemo",
  //   },
  //   {
  //     title: "Drug name Immuno",
  //     dataIndex: "drug_name_immuno",
  //   },
  //   {
  //     title: "Date of start of treatment",
  //     dataIndex: "date_of_start_of_treatment",
  //     valueType: "date",
  //   },
  //   {
  //     title: "Response pet ct",
  //     dataIndex: "response_pet_ct",
  //   },
  //   {
  //     title: "Intracranial response",
  //     dataIndex: "intracranial_response",
  //   },
  //   {
  //     title: "Progressed on line",
  //     dataIndex: "progressed_on_line",
  //   },
  //   {
  //     title: "Date of progression",
  //     dataIndex: "date_of_progression",
  //     valueType: "date",
  //   },
  //   {
  //     title: "Biopsy line of progression",
  //     dataIndex: "biopsy_progression",
  //   },
  //   {
  //     title: "NGS at progression",
  //     dataIndex: "ngs_at_progression",
  //   },
  //   {
  //     title: "NGS result",
  //     dataIndex: "ngs_result",
  //   },
  //   {
  //     title: "Other remarks",
  //     dataIndex: "other_remarks",
  //   },
  //   {
  //     title: "Action",
  //     valueType: "option",
  //     render: (text, record, _, action) => [
  //       <Button
  //         key="edit"
  //         onClick={() => {
  //           navigate(`/patients/${id}/update-lot/${record._id}`, {
  //             state: { patientLOT: record, isEdit: true },
  //           })
  //         }}
  //       >
  //         Edit
  //       </Button>,
  //       <Button
  //         key="delete"
  //         onClick={async () => {
  //           await deleteLOT(record._id)
  //           if (deleteLOTResponse) {
  //             message.success("LOT deleted successfully")
  //             actionRef.current?.reload()
  //           }
  //         }}
  //       >
  //         Delete
  //       </Button>,
  //     ],
  //   },
  // ]

  //transform data to be displayed in table

  // return (
  //   <ProTable<PatientTableT.LOT>
  //     columns={columns}
  //     rowKey="_id"
  //     scroll={{
  //       x: "max-content",
  //     }}
  //     loading={isLoading}
  //     request={async () => {
  //       const res = await getPatientLOTs()
  //       return {
  //         data: res.data,
  //         success: true,
  //       }
  //     }}
  //     cardBordered
  //     tableLayout="auto"
  //     options={{
  //       setting: {
  //         listsHeight: 500,
  //       },
  //     }}
  //     actionRef={actionRef}
  //     search={false}
  //     pagination={false}
  //     toolBarRender={() => [
  //       <Button
  //         key="button"
  //         icon={<PlusOutlined />}
  //         disabled={data?.length === 5}
  //         onClick={() => {
  //           navigate(`/patients/${id}/add-lot`, {
  //             state: { isEdit: false },
  //           })
  //         }}
  //         type="primary"
  //       >
  //         Add LOT
  //       </Button>,
  //     ]}
  //   />
  // )

  useEffect(() => {
    getPatientLOTs()
  }, [getPatientLOTs])

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
                  {dayjs(item.date_of_start_of_treatment).format("DD/MM/YYYY")}
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
                  {item.date_of_progression}
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
