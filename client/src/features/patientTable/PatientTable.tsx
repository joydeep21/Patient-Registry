import React, { useState } from "react"
import * as XLSX from 'xlsx';
import { RiFileExcel2Line  } from "react-icons/ri";
import patientTableApi, {
  PatientTable as PatientTableT,
} from "@/features/patientTable/patientTableApi"
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProForm,
  ProFormDateRangePicker,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProSchemaValueEnumObj,
  ProTable,
} from "@ant-design/pro-components"

import {
  Badge,
  Button,
  Divider,
  Form,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip,
  message,
} from "antd"
import {
  PlusOutlined,
  ImportOutlined,
  DeleteRowOutlined,
  FilterOutlined,
  TableOutlined,
  CloseCircleTwoTone,
} from "@ant-design/icons"
import ImportData from "../importData/ImportData"
import { useNavigate, useSearchParams } from "react-router-dom"
import "./PatientTable.module.css"
import {
  brainMetastasesOptions,
  brg1Options,
  drugsChemo,
  drugsImmuno,
  drugsTargeted,
  ecogPSOptions,
  extrathoracicMetastasesOptions,
  familyHistoryOptions,
  genderOptions,
  geneOptions,
  histoloyOptions,
  indianStates,
  intracranialResponseOptions,
  leptomeningealMetastasesOptions,
  lmMetsOptions,
  pdl1Options,
  petCetOptions,
  smokingStatusOptions,
  statusAtLastFollowUpOptions,
  treatmentAtRGCIOptions,
  treatmentOptions,
  ttf1Options,
} from "@/utils/constants"
import dayjs from "dayjs"

export function PatientTable() {
  const { useDeletePatientsMutation, useGetPatientsQuery } = patientTableApi

  const [url, setUrl] = useState<string>("")

  const [form] = Form.useForm()

  const [searchParams, setSearchParams] = useSearchParams()

  const { data, error, isLoading, refetch } = useGetPatientsQuery(url, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  })

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const [deletePatients, deletePatientsResponse] = useDeletePatientsMutation()
  const navigate = useNavigate()

  const handleFilterEnums = (
    enums: {
      value: string
      label: string
    }[],
  ) =>
    enums.reduce((acc, state) => {
      acc[state.value] = { text: state.label }
      return acc
    }, {} as ProSchemaValueEnumObj)

  const actionRef = React.useRef<ActionType>()
  const formRef = React.useRef<ProFormInstance>()
  const modalFormRef = React.useRef<ProFormInstance>()

  const [params, setParams] = useState<Partial<PatientTableT.SearchParams>>({
    page: 1,
    rowsPerPage: 10,
    sort: "createdAt",
  })

  const [filters, setFilters] = useState<
    Partial<PatientTableT.SearchParams | Omit<"page", "rowsPerPage">>
  >({})

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [showFilterModal, setShowFilterModal] = useState(false)

  const handleFilterModal = () => {
    setShowFilterModal(!showFilterModal)
  }

  const showUploadModal = () => {
    setIsUploadModalOpen(true)
  }

  const handleUploadOk = () => {
    setIsUploadModalOpen(false)
  }

  const handleUploadCancel = () => {
    setIsUploadModalOpen(false)
  }

  const showDeleteModal = () => {
    setIsDeleteModalOpen(true)
  }

  const handleDeleteOk = () => {
    if (selectedRowKeys.length > 0) {
      deletePatients(selectedRowKeys as string[])
    }
    setIsDeleteModalOpen(false)
    if (deletePatientsResponse) {
      refetch()
      message.success({ content: "Patient deleted successfully" })
    } else {
      message.error({ content: "Patient deletion failed" })
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false)
  }

  const columns: ProColumns<PatientTableT.Patient>[] = [
    {
      title: "#",
      dataIndex: "index",
      valueType: "indexBorder",
      fixed: "left",
      width: 48,
    },
    {
      title: "CR Number",
      dataIndex: "cr_number",
      width: 120,

      sorter: (a, b) => {
        if (a.cr_number && b.cr_number) {
          return a.cr_number.localeCompare(b.cr_number, undefined, {
            numeric: true,
          })
        }
        return 0
      },

      render(dom, entity, index, action, schema) {
        const dot = entity?.is_new ? true : false
        return (
          <Tooltip title="Data recently added">
            <Badge dot={dot}>{dom}</Badge>
          </Tooltip>
        )
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => {
        if (a.name && b.name) {
          return a.name.localeCompare(b.name)
        }
        return 0
      },
    },
    {
      title: "Age",
      dataIndex: "dob",
      sorter: (a, b) => {
        if (a.dob && b.dob) {
          return dayjs(a.dob).diff(dayjs(b.dob), "years")
        } else if (a.dob && !b.dob) {
          return -1 // a.dob is not null, b.dob is null, so a should come before b
        } else if (!a.dob && b.dob) {
          return 1 // a.dob is null, b.dob is not null, so b should come before a
        }
        return 0 // both a.dob and b.dob are null, so no change in order
      },
      render: (_, record) => {
        return record.dob ? dayjs().diff(dayjs(record.dob), "years") : "NA"
      },
    },
    {
      title: "Gender",
      dataIndex: "gender",
      valueType: "select",
      valueEnum: handleFilterEnums(genderOptions),
    },
    {
      title: "State",
      dataIndex: "state",
      valueType: "select",
      valueEnum: handleFilterEnums(indianStates),
    },

    {
      title: "Smoking",
      dataIndex: "smoking",
      valueType: "select",
      valueEnum: handleFilterEnums(smokingStatusOptions),
    },
    {
      title: "Family History",
      dataIndex: "family_history",
      valueType: "select",
      valueEnum: handleFilterEnums(familyHistoryOptions),
    },
    {
      title: "Gene",
      dataIndex: "gene",
      valueType: "select",
      valueEnum: handleFilterEnums(geneOptions),
    },
    {
      title: "Variant",
      dataIndex: "variant",
    },
    {
      title: "Treatment At RGCI",
      dataIndex: "treatment_at_rgci",
      valueType: "select",
      valueEnum: handleFilterEnums(treatmentAtRGCIOptions),
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
    },
    {
      title: "Status at Last Follow Up",
      dataIndex: "status_at_last_follow_up",
      sorter: (a, b) => {
        if (a.status_at_last_follow_up && b.status_at_last_follow_up) {
          return (
            a.status_at_last_follow_up.localeCompare(
              b.status_at_last_follow_up,
            ) || 0
          )
        } else if (a.status_at_last_follow_up) {
          return -1 // a is not null, b is null, so a should come before b
        } else if (b.status_at_last_follow_up) {
          return 1 // b is not null, a is null, so b should come before a
        }
        return 0 // both a and b are null, so they are equal
      },
      render: (_, record) => (
        <Space>
          {
            <Tag
              color={
                record.status_at_last_follow_up === "Alive"
                  ? "green"
                  : "volcano"
              }
              style={{ cursor: "pointer" }}
              key={record.status_at_last_follow_up}
            >
              {record.status_at_last_follow_up}
            </Tag>
          }
        </Space>
      ),
    },
    {
      title: "Date of Last Follow Up",
      dataIndex: "date_of_last_follow_up",
      valueType: "date",
      fieldProps: {
        format: "DD/MM/YYYY",
      },
    },
    {
      title: "Date of HPE Diagnosis",
      dataIndex: "date_of_hpe_diagnosis",
      valueType: "date",
      fieldProps: {
        format: "DD/MM/YYYY",
      },
    },
    {
      title: "ECOG_PS",
      dataIndex: "ecog_ps",
    },
    {
      title: "Extrathoracic Mets",
      dataIndex: "extrathoracic_mets",
      valueEnum: handleFilterEnums(extrathoracicMetastasesOptions),
    },
    {
      title: "Brain Mets",
      dataIndex: "brain_mets",
      valueEnum: handleFilterEnums(brainMetastasesOptions),
    },
    {
      title: "Leptomeningeal Mets",
      dataIndex: "letptomeningeal_mets",
      valueEnum: handleFilterEnums(leptomeningealMetastasesOptions),
    },
    {
      title: "Histology",
      dataIndex: "histology",
      valueEnum: handleFilterEnums(histoloyOptions),
    },
    {
      title: "PDL1",
      dataIndex: "pdl1",
      valueEnum: handleFilterEnums(pdl1Options),
    },
    {
      title: "BRG1",
      dataIndex: "brg1",
      valueEnum: handleFilterEnums(brg1Options),
    },
    {
      title: "TTF1",
      dataIndex: "ttf1",
      valueEnum: handleFilterEnums(ttf1Options),
    },
    {
      title: "Small Cell Transformation Date",
      dataIndex: "small_cell_transformation_date",
      valueType: "date",
      fieldProps: {
        format: "DD/MM/YYYY",
      },
    },
    {
      title: "VAF",
      dataIndex: "vaf",
    },
    {
      title: "Co-Mutation",
      dataIndex: "co_mutation",
    },
  ]

  const filterColumns = [
    { title: "#", dataIndex: "index" },
    { title: "CR Number", dataIndex: "cr_number" },
    { title: "Name", dataIndex: "name" },
    { title: "Gender", dataIndex: "gender" },
    { title: "Date of Birth", dataIndex: "dob" },
    { title: "State", dataIndex: "state" },
    { title: "Smoking", dataIndex: "smoking" },
    { title: "Family History", dataIndex: "family_history" },
    { title: "Gene", dataIndex: "gene" },
    { title: "Variant", dataIndex: "variant" },
    { title: "Treatment At RGCI", dataIndex: "treatment_at_rgci" },
    { title: "Phone Number", dataIndex: "phone_number" },
    {
      title: "Status at Last Follow Up",
      dataIndex: "status_at_last_follow_up",
    },
    { title: "Date of Last Follow Up", dataIndex: "date_of_last_follow_up" },
    { title: "Date of HPE Diagnosis", dataIndex: "date_of_hpe_diagnosis" },
    { title: "ECOG_PS", dataIndex: "ecog_ps" },
    { title: "Extrathoracic Mets", dataIndex: "extrathoracic_mets" },
    { title: "Brain Mets", dataIndex: "brain_mets" },
    { title: "Leptomeningeal Mets", dataIndex: "letptomeningeal_mets" },
    { title: "Histology", dataIndex: "histology" },
    { title: "PDL1", dataIndex: "pdl1" },
    { title: "BRG1", dataIndex: "brg1" },
    { title: "TTF1", dataIndex: "ttf1" },
    {
      title: "Small Cell Transformation Date",
      dataIndex: "small_cell_transformation_date",
    },
    { title: "VAF", dataIndex: "vaf" },
    { title: "Co-Mutation", dataIndex: "co_mutation" },
    { title: "Treatment", dataIndex: "treatment" },
    { title: "Drug Targeted", dataIndex: "drug_name_targeted" },
    { title: "Drug Chemotherapy", dataIndex: "drug_name_chemo" },
    { title: "Drug Immunotherapy", dataIndex: "drug_name_immuno" },
    {
      title: "Date start of Treatment",
      dataIndex: "date_of_start_of_treatment",
    },
    { title: "Response PET CT", dataIndex: "response_pet_ct" },
    { title: "Intracranial Response", dataIndex: "intracranial_response" },
    { title: "Is Progressed", dataIndex: "progressed_on_line" },
    { title: "Date of Progression", dataIndex: "date_of_progression" },
    { title: "Biopsy", dataIndex: "biopsy_progression" },
    { title: "NGS at progression", dataIndex: "ngs_at_progression" },
    { title: "NGS Result", dataIndex: "ngs_result" },
  ]

  const filterLabels = filterColumns.reduce(
    (acc, column) => {
      acc[column.dataIndex as string] = {
        text: column.title as string,
      }
      return acc
    },
    {} as { [key: string]: { text: string } },
  )
// flatten a array of object
  function normalizePatientData(data:any) {
    // Flatten lots into a single object
    const flattenLots = (lots:any) => {
      return lots.reduce((acc:any, lot:any, index:any) => {
        Object.keys(lot).forEach(key => {
          acc[`lot_${index + 1}_${key}`] = lot[key];
        });
        return acc;
      }, {});
    };
  
    const lotsFlattened = flattenLots(data.lots || []);
  
    return {
      age: parseInt(data.age, 10) || null,
      brain_mets: data.brain_mets || null,
      brg1: data.brg1 || null,
      co_mutation: data.co_mutation === '-' ? null : data.co_mutation,
      cr_number: data.cr_number || null,
      createdAt: data.createdAt || null,
      date_of_hpe_diagnosis: data.date_of_hpe_diagnosis || null,
      date_of_last_follow_up: data.date_of_last_follow_up || null,
      ecog_ps: parseInt(data.ecog_ps, 10) || null,
      extrathoracic_mets: data.extrathoracic_mets || null,
      family_history: data.family_history || null,
      gender: data.gender || null,
      gene: data.gene || null,
      histology: data.histology || null,
      is_deleted: data.is_deleted || false,
      is_new: data.is_new || false,
      name: data.name ? data.name.replace(" abc", "") : null,
      pdl1: data.pdl1 || null,
      phone_number: data.phone_number || null,
      smoking: data.smoking || null,
      status_at_last_follow_up: data.status_at_last_follow_up || null,
      treatment_at_rgci: data.treatment_at_rgci || null,
      ttf1: data.ttf1 || null,
      updatedAt: data.updatedAt || null,
      vaf: data.vaf === '-' ? null : data.vaf,
      variant: data.variant || null,
      __v: data.__v || 0,
      _id: data._id || null,
      ...lotsFlattened
    };
  }
  function getCurrentDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
  
    return `${day}${month}${year}${hours}${minutes}`;
  }


// Download  Excel export functionlity
  const handleDownload = () => {
    // check if data is present
    if (!data || !data.patients || data.patients.length === 0) {
      alert('No data available to download'); // Alert box
      return;
    }

   const  normalizeData=data.patients.map((items)=>{
    return normalizePatientData(items);
   })
  
    // Assuming headers is dynamically fetched or defined elsewhere
    const headers = Object.keys(normalizeData[0])
  
    const worksheetData = normalizeData.map(item => {
      const newItem:any = {};
      headers.forEach(header => {
        if (Object.prototype.hasOwnProperty.call(item, header)) {
          if (Array.isArray(item[header]) && item[header].every(obj => typeof obj === 'object' && obj !== null)) {
              // Handle array of objects
              newItem[header] = item[header].map(obj => JSON.stringify(obj));
          } else if (typeof item[header] === 'object' && item[header] !== null) {
              // Handle nested object by converting to JSON string
              newItem[header] = JSON.stringify(item[header]);
          } else {
              // Handle other types like string, number, etc.
              newItem[header] = item[header];
          }
      } else {
          newItem[header] = ''; // Set empty string for missing fields
      }
    })
      return newItem;
    });
    console.error('No data available to download',worksheetData);
  
    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Patients");
    XLSX.writeFile(wb, `patients_data${getCurrentDateTime()}.xlsx`);
  };
  
  console.log("hhhghjghbbvvg",data)
console.log("api data",searchParams,"ghggdggdfv",url);


  return (
    <>
      <ProTable<PatientTableT.Patient, PatientTableT.SearchParams>
        
        scroll={{
          x: "max-content",
        }}
        onRow={(record) => ({
          onClick: () => {
            navigate(`/patients/${record._id}/update-patient`)
          },
          style: { cursor: "pointer", whiteSpace: "nowrap" },
        })}
        tableLayout="auto"
        options={{
          setting: {
            checkable: true,
            draggable: true,
            listsHeight: 150,
            settingIcon: <TableOutlined />,
          },
          density: false,
          reload: () => {
            refetch()
          },
        }}
        columnsState={{
          persistenceKey: "patientTable",
          persistenceType: "localStorage",
          defaultValue: {
            cr_number: { show: true, fixed: "left" },
            name: { show: true },
            dob: { show: true },
            // age: { show: true },
            gender: { show: true },
          },
        }}
        actionRef={actionRef}
        formRef={formRef}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRowKeys(selectedRows.map((row) => row._id))
          },
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
        }}
        columns={columns}
        rowKey="cr_number"
        pagination={{
          current: parseInt(searchParams.get("page") || "1"),
          pageSize: parseInt(searchParams.get("rowsPerPage") || "10"),
          showQuickJumper: true,
          pageSizeOptions: ["10", "20", "30", "40", "50", "100"],
          defaultCurrent: 1,
          total: data?.totalCount,
          onChange(page, pageSize) {
            const newParams = { ...params, page, rowsPerPage: pageSize }
            setParams(newParams)
            const urlSearchParams = new URLSearchParams(
              newParams as unknown as Record<string, string>,
            )
            const url = urlSearchParams.toString()
            setSearchParams(url)
            setUrl(url)
          },
          showSizeChanger: true,
        }}
        toolbar={{
          title:(
            <Space>{ data?.totalCount ? (
            `Total Count: ${data?.totalCount}`
          ) : (
            <span style={{ color: "gray" }}>No Data</span>
          )}
          {/* render the download button */}
           <Button
           key="download"
           icon={<RiFileExcel2Line  />}
           onClick={handleDownload}
           type="primary"
         >
          Export 
         </Button>
          </Space>
          ),
          
          search: {
            onSearch: (value) => {
              const newParams = { ...params, search: value }
              setParams(newParams)
              const urlSearchParams = new URLSearchParams(
                newParams as unknown as Record<string, string>,
              )
              const url = urlSearchParams.toString()
              setUrl(url)
            },
            allowClear: true,
            placeholder: "CR Number/Name",
          },
        
          filter: (
            <Space
              size={[10, "middle"]}
              wrap
              style={{
                marginBottom: 16,
              }}
            >
              {Object.entries(filters).map(([key, value]) => {
                const filterValue =
                  key === "date_of_last_follow_up" ||
                  key === "date_of_hpe_diagnosis" ||
                  key === "small_cell_transformation_date" ||
                  key === "date_of_start_of_treatment" ||
                  key === "date_of_progression" ||
                  key === "dob" ? (
                    <span>
                      {typeof value !== "string"
                        ? `${dayjs(value[0]).format("DD/MM/YYYY")}-${dayjs(
                            value[1],
                          ).format("DD/MM/YYYY")}`
                        : value}
                    </span>
                  ) : (
                    value
                  )

                return (
                  <Button
                    type="dashed"
                    key={key}
                    onClick={() => {
                      console.log("i am clicked ");
                      const newParams: Record<string, any> = { ...params }
                      delete newParams[key]
                      setParams(newParams)
                      const newFilters: Record<string, any> = { ...filters }
                      delete newFilters[key]
                      setFilters(newFilters)
                      const urlSearchParams = new URLSearchParams(
                        newParams as Record<string, string>,
                      )
                      const url = urlSearchParams.toString()
                      setUrl(url)
                    }}
                  >
                    {filterLabels[key].text} : {filterValue}
                  </Button>
                )
              })}
            </Space>
          ),
          multipleLine: true,
         
        }}
        dataSource={data?.patients}
        loading={isLoading}
        search={false}
        columnEmptyText="NA"
        toolBarRender={() => [
          <ModalForm<PatientTableT.Patient>
            title="Filters"
            formRef={modalFormRef}
            syncToInitialValues
            preserve={false}
            trigger={
              <Button.Group>
                {Object.entries(filters).length > 0 && (
                  <Tooltip title={"Clear Filters"}>
                    <Button
                      key="button"
                      icon={<CloseCircleTwoTone />}
                      onClick={(e) => {
                        e?.stopPropagation()
                        const newParams: Record<string, any> = { ...params }
                        Object.keys(filters).forEach((key) => {
                          delete newParams[key]
                        })
                        setParams(newParams)
                        setFilters({})
                        const urlSearchParams = new URLSearchParams(
                          newParams as Record<string, string>,
                        )
                        const url = urlSearchParams.toString()
                        setUrl(url)
                      }}
                      type="primary"
                    >
                      Clear
                    </Button>
                  </Tooltip>
                )}
                <Tooltip title={"Filter"}>
                  <Badge count={Object.entries(filters).length}>
                    <Button
                      key="button"
                      icon={<FilterOutlined />}
                      onClick={() => {
                        handleFilterModal()
                        form?.setFieldsValue(filters)
                      }}
                      type="primary"
                    />
                  </Badge>
                </Tooltip>
              </Button.Group>
            }
            form={form}
            autoFocusFirstInput
            modalProps={{
              destroyOnClose: true,
              onCancel: () => console.log("run"),
            }}
            onFinish={async (values) => {
              const newParams = { ...params, ...values }
              setParams(newParams)
              setFilters(values)
              const urlSearchParams = new URLSearchParams(
                newParams as unknown as Record<string, string>,
              )
              const url = urlSearchParams.toString()
              setUrl(url)
              return true
            }}
            submitTimeout={2000}
          >
            <ProForm.Group
              title="Bio"
              collapsible
              defaultCollapsed
              titleStyle={{
                cursor: "pointer",
              }}
              labelLayout="inline"
            >
              <ProForm.Group>
                <ProForm.Item label="CR Number" name="cr_number">
                  <ProFormText width={"sm"} />
                </ProForm.Item>
                <ProForm.Item label="Name" name="name">
                  <ProFormText width={"sm"} />
                </ProForm.Item>
                <ProForm.Item label="Date of birth" name="dob">
                  <ProFormDateRangePicker
                    width={"sm"}
                    fieldProps={{
                      format: (value) => value.format("DD/MM/YYYY"),
                    }}
                  />
                </ProForm.Item>
                <ProForm.Item label="Gender" name="gender">
                  <ProFormSelect
                    width={"sm"}
                    options={genderOptions}
                    placeholder="Please select your gender"
                  />
                </ProForm.Item>

                <ProForm.Item label="State" name="state">
                  <ProFormSelect
                    width={"sm"}
                    options={indianStates}
                    showSearch
                    placeholder="Please select your state"
                  />
                </ProForm.Item>
                <ProForm.Item label="Smoking" name="smoking">
                  <ProFormSelect
                    options={smokingStatusOptions}
                    width={"sm"}
                    placeholder="Please select smoking status"
                  />
                </ProForm.Item>
                <ProForm.Item label="Family History" name="family_history">
                  <ProFormSelect
                    options={familyHistoryOptions}
                    width={"sm"}
                    placeholder="Please select Family History"
                  />
                </ProForm.Item>
                <ProForm.Item label="Gene" name="gene">
                  <ProFormSelect
                    options={geneOptions}
                    width={"sm"}
                    placeholder="Please select the Gene"
                  />
                </ProForm.Item>

                <ProForm.Item label="Variant" name="variant">
                  <ProFormText width={"sm"} />
                </ProForm.Item>
                <ProForm.Item
                  label="Treatment at RGCI"
                  name="treatment_at_rgci"
                >
                  <ProFormSelect
                    width={"sm"}
                    options={treatmentAtRGCIOptions}
                  />
                </ProForm.Item>
                <ProForm.Item label="Phone Number" name="phone_number">
                  <ProFormText width={"sm"} />
                </ProForm.Item>
                <ProForm.Item
                  label="Status at Last Follow-up"
                  name="status_at_last_follow_up"
                >
                  <ProFormSelect
                    width={"sm"}
                    options={statusAtLastFollowUpOptions}
                  />
                </ProForm.Item>
                <ProForm.Item
                  label="Date of Last Follow-up"
                  name="date_of_last_follow_up"
                >
                  <ProFormDateRangePicker
                    width={"sm"}
                    fieldProps={{
                      format: (value) => value.format("DD/MM/YYYY"),
                    }}
                  />
                </ProForm.Item>
              </ProForm.Group>
            </ProForm.Group>

            <Divider />

            <ProForm.Group
              title="Progressive Data"
              collapsible
              defaultCollapsed
              titleStyle={{
                cursor: "pointer",
              }}
              labelLayout="inline"
            >
              <ProForm.Group>
                <ProForm.Item
                  label="Date of HPE Diagnosis"
                  name="date_of_hpe_diagnosis"
                >
                  <ProFormDateRangePicker
                    width={"sm"}
                    fieldProps={{
                      format: (value) => value.format("DD/MM/YYYY"),
                    }}
                  />
                </ProForm.Item>
                <ProForm.Item label="ECOG_PS" name="ecog_ps">
                  <ProFormSelect width={"sm"} options={ecogPSOptions} />
                </ProForm.Item>
                <ProForm.Item
                  label="Extrathoracic Mets"
                  name="extrathoracic_mets"
                >
                  <ProFormSelect
                    width={"sm"}
                    options={extrathoracicMetastasesOptions}
                  />
                </ProForm.Item>
                <ProForm.Item label="Brain Mets" name="brain_mets">
                  <ProFormSelect
                    width={"sm"}
                    options={brainMetastasesOptions}
                  />
                </ProForm.Item>
                <ProForm.Item
                  label="Letptomeningeal Mets"
                  name="letptomeningeal_mets"
                >
                  <ProFormSelect
                    width={"sm"}
                    options={leptomeningealMetastasesOptions}
                  />
                </ProForm.Item>
                <ProForm.Item label="Histology" name="histology">
                  <ProFormSelect width={"md"} options={histoloyOptions} />
                </ProForm.Item>
                <ProForm.Item label="PDL1" name="pdl1">
                  <ProFormSelect width={"sm"} options={pdl1Options} />
                </ProForm.Item>
                <ProForm.Item label="BRG1" name="brg1">
                  <ProFormSelect width={"sm"} options={brg1Options} />
                </ProForm.Item>
                <ProForm.Item label="TTF1" name="ttf1">
                  <ProFormSelect width={"sm"} options={ttf1Options} />
                </ProForm.Item>
                <ProForm.Item
                  label="Small Cell Transformation Date"
                  name="small_cell_transformation_date"
                >
                  <ProFormDateRangePicker
                    fieldProps={{
                      format: (value) => value.format("DD/MM/YYYY"),
                    }}
                    width={"sm"}
                  />
                </ProForm.Item>
                <ProForm.Item label="VAF" name="vaf">
                  <ProFormText width={"sm"} />
                </ProForm.Item>
                <ProForm.Item label="Co-Mutation" name="co_mutation">
                  <ProFormText width={"sm"} />
                </ProForm.Item>
              </ProForm.Group>
            </ProForm.Group>

            <Divider />

            <ProForm.Group
              title="Line of Treatments"
              collapsible
              defaultCollapsed
              titleStyle={{
                cursor: "pointer",
              }}
              labelLayout="inline"
            >
              <ProForm.Item label="Treatment" name="treatment">
                <ProFormSelect
                  width={"sm"}
                  showSearch
                  options={treatmentOptions}
                  placeholder="Please select your treatment"
                />
              </ProForm.Item>

              <ProForm.Item label="Drug Targeted" name="drug_name_targeted">
                <ProFormSelect
                  options={drugsTargeted}
                  width={"sm"}
                  showSearch
                  placeholder="Please select the drug"
                />
              </ProForm.Item>
              <ProForm.Item
                label="Drug Name Chemotherapy"
                name="drug_name_chemo"
              >
                <ProFormSelect
                  options={drugsChemo}
                  width={"sm"}
                  showSearch
                  placeholder="Please select the drug"
                />
              </ProForm.Item>
              <ProForm.Item label="Drug Immunotherapy" name="drug_name_immuno">
                <ProFormSelect
                  options={drugsImmuno}
                  width={"sm"}
                  showSearch
                  placeholder="Please select the drug"
                />
              </ProForm.Item>
              <ProForm.Item
                label="Date start of Treatment"
                name="date_of_start_of_treatment"
              >
                <ProFormDateRangePicker
                  width={"sm"}
                  fieldProps={{
                    format: (value) => value.format("DD/MM/YYYY"),
                  }}
                />
              </ProForm.Item>
              <ProForm.Item label="Response PET CT" name="response_pet_ct">
                <ProFormSelect
                  options={petCetOptions}
                  width={"sm"}
                  showSearch
                  placeholder="Please select response PET CT"
                />
              </ProForm.Item>
              <ProForm.Item
                label="Intracranial Response"
                name="intracranial_response"
              >
                <ProFormSelect
                  options={intracranialResponseOptions}
                  width={"md"}
                  showSearch
                  placeholder="Please select response PET CT"
                />
              </ProForm.Item>
              <ProForm.Item label="Is Progressed" name="progressed_on_line">
                <ProFormSelect
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
              </ProForm.Item>
              <ProForm.Item
                label="Date of Progression"
                name="date_of_progression"
              >
                <ProFormDateRangePicker
                  width={"sm"}
                  fieldProps={{
                    format: (value) => value.format("DD/MM/YYYY"),
                  }}
                />
              </ProForm.Item>
              <ProForm.Item label="Biopsy" name="biopsy_progression">
                <ProFormSelect
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
              </ProForm.Item>
              <ProForm.Item
                label="NGS at progression"
                name="ngs_at_progression"
              >
                <ProFormSelect
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
              </ProForm.Item>
              <ProForm.Item label="NGS Result" name="ngs_result">
                <ProFormText width={"sm"} placeholder="NGS result" />
              </ProForm.Item>
              <ProForm.Item label="Other Remarks" name="other_remarks">
                <ProFormText width={"md"} placeholder="Other Remarks" />
              </ProForm.Item>
            </ProForm.Group>
          </ModalForm>,
          
          <Tooltip title={"Add Patient"}>
            <Button
              key="button"
              icon={<PlusOutlined />}
              onClick={() => {
                navigate("/patients/add-patient")
              }}
              type="primary"
            />
          </Tooltip>,
          selectedRowKeys && selectedRowKeys.length > 0 && (
            <Tooltip title={"Delete"}>
              <Button
                key="button"
                icon={<DeleteRowOutlined />}
                onClick={() => {
                  showDeleteModal()
                }}
                type="primary"
                danger
              />
            </Tooltip>
          ),
          <Tooltip title={"Import"}>
            <Button
              key="button"
              icon={<ImportOutlined />}
              onClick={() => {
                showUploadModal()
              }}
              type="dashed"
            />
          </Tooltip>,
        ]}
      />
      <Modal
        title="Import Patient Data"
        open={isUploadModalOpen}
        onOk={handleUploadOk}
        onCancel={handleUploadCancel}
        footer={null}
        width={1000}
      >
        <ImportData />
        
      </Modal>
      <Modal
        title="Delete Patient"
        open={isDeleteModalOpen}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        width={500}
      >
        <p>Are you sure you want to delete this patient data?</p>
      </Modal>
    </>
  )
}
