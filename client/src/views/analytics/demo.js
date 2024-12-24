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
    const [selectedChartType, setSelectedChartType] = useState<any | undefined>({ label: "Pie Chart", value: "pie" });
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
    const [showFilterModal, setShowFilterModal] = useState(false)
    const [form] = Form.useForm();
    const modalFormRef = React.useRef()
    const [params, setParams] = useState<Partial<PatientTableT.SearchParams>>();
    const [searchParams, setSearchParams] = useSearchParams()
    const [url, setUrl] = useState<string>("")
    const navigate = useNavigate();
  
   
    
  
    
   
   
    console.log("api data", searchParams, "ghggdggdfv", url);
  
  
    return (
      <PageContainer title="Analytics">
        <div style={{ display: 'flex', height: '100vh' }}>
          {/* Left sidebar for selecting field */}
          <div style={{ flex: '0 0 auto', width: '200px', marginRight: '20px' }}>
            <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <ProFormSelect
                  name="select"
                  label="Select"
                  placeholder="Please select"
                  onChange={(value: string) => setSelectedField(value)}
                  options={options}
                />
                {/* ProFormSelect for chart type */}
                <ProFormSelect
                  name="chartType"
                  label="Chart Type"
                  placeholder="Please select"
                  onChange={(value: string) => setSelectedChartType(value)}
                  options={chartTypeOptions}
                   initialValue="pie"
                />
              </div>
            </Card>
          </div>
  
          {/* Main content area for displaying charts */}
          <div style={{ flex: '1 1 auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Card
              style={{ flex: 1 }}
              title={<>
              <h1 style={{ fontSize: "1.5rem" }}>Chart  Statistic by {selectedField}</h1>
              {/* Add filter modal in analytics */}
              
              </>}
  
            >
              {selectedField && selectedChartType && (
                <PieChart field={selectedField} chartType={selectedChartType} filter={filters} />
              )}
            </Card>
          </div>
        </div>
  
  
      </PageContainer>
    );
  };
  
  export default Analytics;
  