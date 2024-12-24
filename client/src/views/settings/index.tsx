import { useGetProfileQuery } from "@/features/profile/profileApi"
import { PageContainer, ProDescriptions } from "@ant-design/pro-components"
import { Card } from "antd"
import PhoneInput from "antd-phone-input"
import React from "react"

const Settings = () => {
  const {
    data: profile,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetProfileQuery()

  return (
    <PageContainer title="Settings" fixedHeader>
      <Card>
        <ProDescriptions
          dataSource={profile?.user}
          column={2}
          title="Profile"
          editable={{
            onSave: async (key, row) => {
              console.log(key, row)
            },
          }}
          loading={isLoading}
        >
          <ProDescriptions.Item label="Name" dataIndex="name" />
          <ProDescriptions.Item label="Email" dataIndex="email" />
          <ProDescriptions.Item
            label="Role"
            dataIndex="role"
            valueType="select"
            valueEnum={{
              admin: { text: "Admin" },
              operator: { text: "Operator" },
              analytics: { text: "Analytics" },
            }}
          />
          <ProDescriptions.Item
            label="Mobile"
            dataIndex="mobileNumber"
            renderFormItem={() => {
              return (
                <PhoneInput enableSearch disableDropdown={false} country="in" />
              )
            }}
          />
        </ProDescriptions>
      </Card>
    </PageContainer>
  )
}

export default Settings
