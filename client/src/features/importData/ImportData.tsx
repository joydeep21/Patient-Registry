import { Button, List, Upload, message } from "antd"
import { UploadProps } from "antd/lib"
import React from "react"
import { InboxOutlined, DownloadOutlined } from "@ant-design/icons"
import patientTableApi from "../patientTable/patientTableApi"

export default function ImportData() {
  const { Dragger } = Upload

  const { useUploadPatientDataMutation } = patientTableApi

  const [uploadPatientData, uploadPatientDataResponse] =
    useUploadPatientDataMutation()

  const [failedRows, setFailedRows] = React.useState<any[]>([])

  const props: UploadProps = {
    name: "file",
    multiple: false,
    customRequest: async (options) => {
      const { file } = options
      const formData = new FormData()
      formData.append("file", file)
      try {
        const res = await uploadPatientData(formData)?.unwrap()
        message.success({ content: "File uploaded successfully" })
        if (options.onSuccess) {
          options.onSuccess(res)
          if (res.failedRows.length > 0) {
            setFailedRows(res.failedRows)
          }
        }
      } catch (error) {
        message.error({ content: "Something went wrong" })
        if (options.onError) {
          options.onError(error as any, "Error")
        }
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files)
    },
  }

  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibited from uploading
        company data or other banned files.
      </p>
      <Button
        icon={<DownloadOutlined />}
        onClick={() =>
          window.open(
            `${import.meta.env.REACT_PROD_URL}/RGCI%20Import%20Template.xlsx`,
          )
        }
        title="Download Template"
        type="dashed"
      >
        Download Template
      </Button>
      {failedRows.length > 0 && (
        <List
          grid={{ gutter: 16, column: 6 }}
          dataSource={failedRows}
          renderItem={(item: any) => (
            <List.Item>
              <List.Item.Meta title={item} />
            </List.Item>
          )}
        />
      )}
    </Dragger>
  )
}
