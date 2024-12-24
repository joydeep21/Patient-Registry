import React, { useRef } from 'react';
import { Pie, Bar, Area } from "@ant-design/plots";
import { useGetPieChartQuery } from "./pieChartApi";
import { Card, Button } from "antd";
import html2canvas from 'html2canvas';
import '../../index.css'; // Import the custom CSS

interface PieChartProps {
  field: string;
  chartType: string;// Add chart type props
  filter: any;//Add filter props
}

export const PieChart =({ field, chartType,filter }: PieChartProps) => {
  const { data } = useGetPieChartQuery({
    field,
    filter,
  })as { data: { chartData: { name: string; count: number; }[] } };// pass the filter props  to the api backend
  
  console.log("data",data);
  
  const chartRef = useRef(null);
  function getCurrentDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
  
    return `${day}${month}${year}${hours}${minutes}`;
  }

  // download the chart image function
  const handleDownload = () => {
    console.log("hiii",data);
    
    if ( !data || !data.chartData || data.chartData.length === 0) {
      alert("No data available to download.");
      return;
    }
    if(chartRef.current){
    html2canvas(chartRef.current).then((canvas) => {
      const timeNow=  getCurrentDateTime();
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${chartType}-chart${timeNow}.png`;
      link.click();
    });
  }
  };
  const pieConfig = {
    data: data?.chartData ,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
   
    label: {
      type: 'spider',
      content: '{type}\n{percentage}',
      offset: 30, // Adjust the offset for label distance from the pie chart
      style: {
        lineWidth: 1,
        stroke: 'rgba(0, 0, 0, 0.15)',
        r:50
      },
    },
   
    
    // itemName: {
    //   style: {
    //     fontSize: 30, // Font size
    //     fontWeight: 'bold', // Font weight
    //   },
    // },
    // itemValue: {
    //   style: {
    //     fontSize: 30, // Font size
    //   },
    // },
    // marker: {
    //   style: {
    //     r: 100, // Marker size
    //   },
    // },
    interactions: [
      { type: 'element-selected' },
      { type: 'element-active' },
    ],
  
  }
  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        return <Pie {...pieConfig} />;
      case 'bar':
        return (
          <Bar
            data={data?.chartData}
            xField="type"
            yField="value"
            meta={{ type: { alias: "type" }, value: { alias: "value" } }}
          />
        );
      case 'area':
        return <Area data={data?.chartData} xField="type" yField="value" />;
      default:
        return null;
    }
  };

  return (
    <Card
      // title={`Statistic by ${field}`}
      extra={<Button onClick={handleDownload}>Download Chart</Button>}
    >
      <div ref={chartRef} style={{ height: '100%', textAlign: 'center' }}>
        <h1 style={{ fontSize: "1.7rem" }}>Statistic by {field}</h1>
        {renderChart()}
      </div>
    </Card>
  );
};

export default PieChart;
