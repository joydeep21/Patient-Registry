import {
  PageContainer, ProFormSelect,
  ActionType,
  ModalForm,
  ProColumns,
  ProForm,
  ProFormDateRangePicker,
  ProFormInstance,
  ProFormText,
  ProSchemaValueEnumObj,
  ProTable,
} from "@ant-design/pro-components";
import { PieChart } from "@/features/pieChart/pieChart";
import patientTableApi, {
  PatientTable as PatientTableT,
} from "@/features/patientTable/patientTableApi"
import {
  Card,
  Button,
  Divider,
  Form,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip,
  message, Badge, Row, Col
} from "antd";
import { FilterOutlined, CloseCircleTwoTone } from '@ant-design/icons';
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

import { useNavigate, useSearchParams } from "react-router-dom"
import React, { useState, useEffect } from 'react';

const Analytics = () => {

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
  ];
  const filterLabels = filterColumns.reduce(
    (acc, column) => {
      acc[column.dataIndex as string] = {
        text: column.title as string,
      }
      return acc
    },
    {} as { [key: string]: { text: string } },
  )
  const options = [
    {label:'Bio Section',
      options:[
    { label: "Gender", value: "gender" },
    { label: "Gene", value: "gene" },
    { label: "State", value: "state" },
    { label: "Smoking", value: "smoking" },
    { label: "Variant", value: "variant" },
    { label: "Status", value: "status_at_last_follow_up" },
    { label: "Treatment at RGCI", value: "treatment_at_rgci" },
      ]},
      {label:'Progressive Data',
        options:[
    { label: "ECOG_PS", value: "ecog_ps" },
    { label: "Extrathoracic Mets", value: "extrathoracic_mets" },
    { label: "Brain Mets", value: "brain_mets" },
    { label: "Letptomeningeal Mets", value: "letptomeningeal_mets" },
    { label: "Histology", value: "histology" },
    { label: "PDL1", value: "pdl1" },
    { label: "BRG1", value: "brg1" },
    { label: "TTF1", value: "ttf1" },
    { label: "VAF", value: "vaf" },
    { label: "Co-Mutation", value: "co_mutation" },
  ]}
  ];

  const chartTypeOptions = [
    { label: "Pie Chart", value: "pie" },
    { label: "Bar Chart", value: "bar" },
    { label: "Area Chart", value: "area" },
  ];
  const [selectedField, setSelectedField] = useState<string | undefined>(undefined);
  const [selectedChartType, setSelectedChartType] = useState<string>('pie');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [form] = Form.useForm();
  const modalFormRef = React.useRef()
  const [params, setParams] = useState<Partial<PatientTableT.SearchParams>>();
  const [searchParams, setSearchParams] = useSearchParams()
  const [url, setUrl] = useState<string>("")
  const navigate = useNavigate();

 
  const handleFilterModalShow = () => {
    setShowFilterModal(true);
    form.setFieldsValue(filters);

  };
  // const handleFilterModalapply = () => {
  //   // console.log("fbchgvcvxcv11111111111111111",Form);
  //   form.submit();
  //   setShowFilterModal(false);
  //   const filterKeys = Object.keys(filters);
  //   setAppliedFilters(filterKeys);
  // };
  // const onFinish = (values: any) => {
  //   console.log('Form values:', values);
  //   const changedValues = Object.entries(values).reduce((acc, [key, value]) => {
  //     if (filters[key] !== value) {
  //       acc[key] = value;
  //     }
  //     return acc;
  //   }, {} as Record<string, any>);
  //   const newParams = { ...params, ...changedValues }
  //   setParams(newParams)
  //   console.log('Changed values:', changedValues);
  //   setFilters(prevFilters => ({
  //     ...prevFilters,
  //     ...changedValues
  //   }));
  //   const urlSearchParams = new URLSearchParams(
  //     newParams as unknown as Record<string, string>,
  //   )
  //   const url = urlSearchParams.toString()
  //   setUrl(url)
  //   return true
  // };
  const handleClearFilters = () => {
    setShowFilterModal(false)
    setFilters({}); // Clear all filters
    form.resetFields();
    setAppliedFilters([]);
  };

  // const removeFilter = (key: string) => {
  //   const updatedFilters = { ...filters };
  //   delete updatedFilters[key];
  //   setFilters(updatedFilters);
  //   form.setFieldsValue(updatedFilters);
  //   setAppliedFilters(prev => prev.filter(item => item !== key));
  // };

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
 
  console.log("api data", searchParams, "ghggdggdfv", url);


  return (
    <PageContainer title="">
      <div style={{ height: '100vh' }}>
        {/* Left sidebar for selecting field */}
        {/* <div style={{ flex: '0 0 auto', width: '200px', marginRight: '20px' }}> */}
          <Card style={{  display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <Row  gutter={24}>
              <Col span={12}>
              <ProFormSelect
                name="select"
                label="Select"
                placeholder="Please select"
                onChange={(value: string) => 
                  setSelectedField(value)
                }
                options={options}
              />
              </Col>
              <Col span={12}>
              {/* ProFormSelect for chart type */}
              <ProFormSelect
                name="chartType"
                label="Chart Type"
                placeholder="Please select"
                value={selectedChartType}
                onChange={(value: string) => setSelectedChartType(value)}
                options={chartTypeOptions}
                
              />
              </Col>
              </Row>
            </div>
          </Card>
        {/* </div> */}
<br></br>
        {/* Main content area for displaying charts */}
          <Card
            style={{ flex: 1 }}
            title={<>
            <h1 style={{ fontSize: "1.5rem" }}>Chart  Statistic by {selectedField}</h1>
            {/* Add filter modal in analytics */}
              <ModalForm
                title="Filters"
                formRef={modalFormRef}
                syncToInitialValues
                preserve={false}
                visible={showFilterModal}
                trigger={<div style={{ display: 'flex', marginBottom: 16, marginTop: 5 }}>
                  <Space
                    size={[10, "middle"]}
                    wrap
                    style={{
                      marginBottom: 16,
                      marginRight: 5,
                      justifyContent: 'flex-start',
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
                            setShowFilterModal(false)
                            const newParams: Record<string, any> = { ...params }
                            delete newParams[key]
                            setParams(newParams)
                            const newFilters: Record<string, any> = { ...filters }
                            delete newFilters[key]
                            setFilters(newFilters)
                            console.log("hiiiiiiiiiiii", form, newFilters)

                            const urlSearchParams = new URLSearchParams(
                              newParams as Record<string, string>,
                            )
                            const url = urlSearchParams.toString()
                            setUrl(url)
                          }}
                        >
                          {key} : {filterValue}
                        </Button>
                      )
                    })}
                  </Space>
                  <div style={{ marginLeft: 'auto', justifyContent: 'flex-end', marginRight: "10px" }}>
                    <Button.Group>
                      {/* Show clear filters button if filters are applied */}
                      {Object.keys(filters).length > 0 && (
                        <Tooltip title="Clear Filters">
                          <Button
                            icon={<CloseCircleTwoTone />}
                            onClick={handleClearFilters}
                            type="primary"
                          >
                            Clear
                          </Button>
                        </Tooltip>
                      )}
                      {/* Filter button */}
                      <Tooltip title="Filter">
                        <Badge count={Object.keys(filters).length}>
                          <Button
                            icon={<FilterOutlined />}
                            onClick={handleFilterModalShow}
                            type="primary"
                          />
                        </Badge>
                      </Tooltip>

                    </Button.Group>
                  </div>
                </div>}
                form={form}
                autoFocusFirstInput
                modalProps={{
                  destroyOnClose: true,
                  onCancel: () => {
                    console.log("run"),
                  setShowFilterModal(false)}
                }}
                onFinish={async (values) => {
                  setShowFilterModal(false)
                  const newParams = { ...params, ...values };
                  setParams(newParams);
                  setFilters(values);
                  const urlSearchParams = new URLSearchParams(
                    newParams as unknown as Record<string, string>
                  );
                  const url = urlSearchParams.toString();
                  setUrl(url);
                  return true;
                }}
                submitTimeout={2000}
              >

                {/* Add your filter form items here */}
                <ProForm.Group
                  title="Bio"
                  collapsible
                  defaultCollapsed
                  titleStyle={{
                    cursor: "pointer",
                  }}
                >
                  <ProForm.Group>
                    <Row gutter={24}>
                      <Col span={8}>
                        <ProForm.Item label="CR Number" name="cr_number">
                          <ProFormText width={230} />
                        </ProForm.Item>
                      </Col>
                      <Col span={8}>
                        <ProForm.Item label="Name" name="name">
                          <ProFormText width={230} />
                        </ProForm.Item>
                      </Col>
                      <Col span={8}>
                        <ProForm.Item label="Date of birth" name="dob">
                          <ProFormDateRangePicker
                            width={230}
                            fieldProps={{
                              format: (value) => value.format("DD/MM/YYYY"),
                            }}
                          />
                        </ProForm.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={8}>
                        <ProForm.Item label="Gender" name="gender">
                          <ProFormSelect
                            width={230}
                            options={genderOptions}
                            placeholder="Please select your gender"
                          />
                        </ProForm.Item>
                      </Col>
                      <Col span={8}>
                        <ProForm.Item label="State" name="state">
                          <ProFormSelect
                            width={230}
                            options={indianStates}
                            showSearch
                            placeholder="Please select your state"
                          />
                        </ProForm.Item>
                      </Col>
                      <Col span={8}>
                        <ProForm.Item label="Smoking" name="smoking">
                          <ProFormSelect
                            options={smokingStatusOptions}
                            width={230}
                            placeholder="Please select smoking status"
                          />
                        </ProForm.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={8}>
                        <ProForm.Item label="Family History" name="family_history">
                          <ProFormSelect
                            options={familyHistoryOptions}
                            width={230}
                            placeholder="Please select Family History"
                          />
                        </ProForm.Item>
                      </Col>
                      <Col span={8}>
                        <ProForm.Item label="Gene" name="gene">
                          <ProFormSelect
                            options={geneOptions}
                            width={230}
                            placeholder="Please select the Gene"
                          />
                        </ProForm.Item>
                      </Col>
                      <Col span={8}>
                        <ProForm.Item label="Variant" name="variant">
                          <ProFormText width={230} />
                        </ProForm.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={8}>
                        <ProForm.Item
                          label="Treatment at RGCI"
                          name="treatment_at_rgci"
                        >
                          <ProFormSelect
                            width={230}
                            options={treatmentAtRGCIOptions}
                          />
                        </ProForm.Item>
                      </Col>
                      <Col span={8}>
                        <ProForm.Item label="Phone Number" name="phone_number">
                          <ProFormText width={230} />
                        </ProForm.Item>
                        <ProForm.Item
                          label="Status at Last Follow-up"
                          name="status_at_last_follow_up"
                        >
                          <ProFormSelect
                            width={230}
                            options={statusAtLastFollowUpOptions}
                          />
                        </ProForm.Item>
                      </Col>
                      <Col span={8}>
                        <ProForm.Item
                          label="Date of Last Follow-up"
                          name="date_of_last_follow_up"
                        >
                          <ProFormDateRangePicker
                            width={250}
                            fieldProps={{
                              format: (value) => value.format("DD/MM/YYYY"),
                            }}
                          />
                        </ProForm.Item>
                      </Col>
                    </Row>
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
                    <Row gutter={24}>
                      <Col span={8}>
                        <ProForm.Item
                          label="Date of HPE Diagnosis"
                          name="date_of_hpe_diagnosis"
                        >
                          <ProFormDateRangePicker
                            width={230}
                            fieldProps={{
                              format: (value) => value.format("DD/MM/YYYY"),
                            }}
                          />
                        </ProForm.Item>
                      </Col>
                      <Col span={8}>
                        <ProForm.Item label="ECOG_PS" name="ecog_ps">
                          <ProFormSelect width={230} options={ecogPSOptions} />
                        </ProForm.Item>
                      </Col>
                      <Col span={8}>
                        <ProForm.Item
                          label="Extrathoracic Mets"
                          name="extrathoracic_mets"
                        >
                          <ProFormSelect
                            width={230}
                            options={extrathoracicMetastasesOptions}
                          />
                        </ProForm.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={8}>
                        <ProForm.Item label="Brain Mets" name="brain_mets">
                          <ProFormSelect
                            width={230}
                            options={brainMetastasesOptions}
                          />
                        </ProForm.Item>
                      </Col>
                      <Col span={8}>
                        <ProForm.Item
                          label="Letptomeningeal Mets"
                          name="letptomeningeal_mets"
                        >
                          <ProFormSelect
                            width={230}
                            options={leptomeningealMetastasesOptions}
                          />
                        </ProForm.Item>
                      </Col>
                      <Col span={8}>
                        <ProForm.Item label="Histology" name="histology">
                          <ProFormSelect width={230} options={histoloyOptions} />
                        </ProForm.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={8}>
                        <ProForm.Item label="PDL1" name="pdl1">
                          <ProFormSelect width={230} options={pdl1Options} />
                        </ProForm.Item>
                      </Col>
                      <Col span={8}>
                        <ProForm.Item label="BRG1" name="brg1">
                          <ProFormSelect width={230} options={brg1Options} />
                        </ProForm.Item>
                      </Col>
                      <Col span={8}>
                        <ProForm.Item label="TTF1" name="ttf1">
                          <ProFormSelect width={230} options={ttf1Options} />
                        </ProForm.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={8}>
                        <ProForm.Item
                          label="Small Cell Transformation Date"
                          name="small_cell_transformation_date"
                        >
                          <ProFormDateRangePicker
                            fieldProps={{
                              format: (value) => value.format("DD/MM/YYYY"),
                            }}
                            width={230}
                          />
                        </ProForm.Item>
                      </Col>
                      <Col span={8}>
                        <ProForm.Item label="VAF" name="vaf">
                          <ProFormText width={230} />
                        </ProForm.Item>
                      </Col>
                      <Col span={8}>
                        <ProForm.Item label="Co-Mutation" name="co_mutation">
                          <ProFormText width={230} />
                        </ProForm.Item>
                      </Col>
                    </Row>
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
                  <Row gutter={24}>
                    <Col span={8}>
                      <ProForm.Item label="Treatment" name="treatment">
                        <ProFormSelect
                          width={230}
                          showSearch
                          options={treatmentOptions}
                          placeholder="Please select your treatment"
                        />
                      </ProForm.Item>
                    </Col>
                    <Col span={8}>
                      <ProForm.Item label="Drug Targeted" name="drug_name_targeted">
                        <ProFormSelect
                          options={drugsTargeted}
                          width={230}
                          showSearch
                          placeholder="Please select the drug"
                        />
                      </ProForm.Item>
                    </Col>
                    <Col span={8}>
                      <ProForm.Item
                        label="Drug Name Chemotherapy"
                        name="drug_name_chemo"
                      >
                        <ProFormSelect
                          options={drugsChemo}
                          width={230}
                          showSearch
                          placeholder="Please select the drug"
                        />
                      </ProForm.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={8}>
                      <ProForm.Item label="Drug Immunotherapy" name="drug_name_immuno">
                        <ProFormSelect
                          options={drugsImmuno}
                          width={230}
                          showSearch
                          placeholder="Please select the drug"
                        />
                      </ProForm.Item>
                    </Col>
                    <Col span={8}>
                      <ProForm.Item
                        label="Date start of Treatment"
                        name="date_of_start_of_treatment"
                      >
                        <ProFormDateRangePicker
                          width={230}
                          fieldProps={{
                            format: (value) => value.format("DD/MM/YYYY"),
                          }}
                        />
                      </ProForm.Item>
                    </Col>
                    <Col span={8}>
                      <ProForm.Item label="Response PET CT" name="response_pet_ct">
                        <ProFormSelect
                          options={petCetOptions}
                          width={230}
                          showSearch
                          placeholder="Please select response PET CT"
                        />
                      </ProForm.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={8}>
                      <ProForm.Item
                        label="Intracranial Response"
                        name="intracranial_response"
                      >
                        <ProFormSelect
                          options={intracranialResponseOptions}
                          width={230}
                          showSearch
                          placeholder="Please select response PET CT"
                        />
                      </ProForm.Item>
                    </Col>
                    <Col span={8}>
                      <ProForm.Item label="Is Progressed" name="progressed_on_line">
                        <ProFormSelect
                          width={230}
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
                    </Col>
                    <Col span={8}>
                      <ProForm.Item
                        label="Date of Progression"
                        name="date_of_progression"
                      >
                        <ProFormDateRangePicker
                          width={230}
                          fieldProps={{
                            format: (value) => value.format("DD/MM/YYYY"),
                          }}
                        />
                      </ProForm.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={8}>
                      <ProForm.Item label="Biopsy" name="biopsy_progression">
                        <ProFormSelect
                          width={230}
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
                    </Col>
                    <Col span={8}>
                      <ProForm.Item
                        label="NGS at progression"
                        name="ngs_at_progression"
                      >
                        <ProFormSelect
                          width={230}
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
                    </Col>
                    <Col span={8}>
                      <ProForm.Item label="NGS Result" name="ngs_result">
                        <ProFormText width={230} placeholder="NGS result" />
                      </ProForm.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={8}>
                      <ProForm.Item label="Other Remarks" name="other_remarks">
                        <ProFormText width={230} placeholder="Other Remarks" />
                      </ProForm.Item>
                    </Col>
                  </Row>
                </ProForm.Group>

              </ModalForm>
            </>}

          >
            {selectedField && selectedChartType && (
              <PieChart field={selectedField} chartType={selectedChartType} filter={filters} />
            )}
          </Card>
        </div>


    </PageContainer>
  );
};

export default Analytics;
