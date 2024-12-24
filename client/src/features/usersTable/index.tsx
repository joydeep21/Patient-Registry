import { useRef, useState } from "react"
import {
  NUsersTable,
  useAddUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
} from "./usersTableApi"
import {
  ActionType,
  FormInstance,
  ModalForm,
  ProColumns,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components"
import { useNavigate } from "react-router-dom"
import { TableOutlined } from "@ant-design/icons"
import { Badge, Button, Form, Modal, Space, Table, Tag, message } from "antd"
import { useAppSelector } from "@/app/hooks"
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
export default function UsersTable() {
  const [url, setUrl] = useState<string>("")

  const [params, setParams] = useState<Partial<NUsersTable.SearchParams>>({
    page: 1,
    rowsPerPage: 10,
    search: "",
    orderBy: "createdAt",
    order: "desc",
  })

  const navigate = useNavigate()

  const { data, refetch, isLoading, isError } = useGetUsersQuery(url)

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])

  const [filters, setFilters] = useState<Record<string, string>>({})

  const formRef = useRef<FormInstance>()
  const actionRef = useRef<ActionType>()
  const [form] = Form.useForm()
  const { confirm } = Modal

  const user = useAppSelector((state) => state.global.userInfo)

  const [addUser, { isLoading: isAddingUser }] = useAddUserMutation()

  const [deleteUser] = useDeleteUserMutation()

  const onFinishCreate = async (values: any) => {
    await addUser(values)
      .unwrap()
      .then((res) => {
        if (res?.success) {
          message.success("User added successfully")
          form.resetFields()
          refetch()
        } else {
          message.error("Something went wrong")
        }
      })
    return true
  }

  const columns: ProColumns<NUsersTable.User>[] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: 150,
      ellipsis: true,
      search: false,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: true,
      width: 150,
      ellipsis: true,
      search: false,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: true,
      width: 150,
      ellipsis: true,
      search: false,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      sorter: true,
      width: 150,
      ellipsis: true,
      search: false,
      render(_, record) {
        const isSelf = user?.user_id === record._id
        return (
          <Space>
            {
              <Tag
                color={
                  record.role === "admin"
                    ? "volcano"
                    : record.role === "operator"
                      ? "green"
                      : "geekblue"
                }
                style={{ cursor: "pointer" }}
                key={record._id}
              >
                {record.role} {isSelf && "(You)"}
              </Tag>
            }
          </Space>
        )
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      width: 150,
      ellipsis: true,
      search: false,
      valueType: "date",
      fieldProps: {
        format: "DD/MM/YYYY",
      },
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: true,
      width: 150,
      ellipsis: true,
      search: false,
      valueType: "date",
      fieldProps: {
        format: "DD/MM/YYYY",
      },
    },
  ]

  const filterLabels: { [key: string]: { text: string } } = columns.reduce(
    (acc, state) => {
      acc[state.dataIndex as string] = {
        text: state.title as string,
      }
      return acc
    },
    {} as { [key: string]: { text: string } },
  )

  return (
    <div>
      <ProTable<NUsersTable.User, NUsersTable.SearchParams>
        scroll={{
          x: "max-content",
        }}
        onRow={(record) => ({
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
          persistenceKey: "usersTable",
          persistenceType: "localStorage",
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
        rowKey="_id"
        pagination={{
          current: params?.page || 1,
          pageSize: params?.rowsPerPage || 10,
          showQuickJumper: true,
          pageSizeOptions: ["10", "20", "30", "40", "50"],
          defaultCurrent: 1,
          total: data?.totalCount,
          onChange(page, pageSize) {
            const newParams = { ...params, page, rowsPerPage: pageSize }
            setParams(newParams)
            const urlSearchParams = new URLSearchParams(
              newParams as unknown as Record<string, string>,
            )
            const url = urlSearchParams.toString()
            setUrl(url)
          },
          showSizeChanger: true,
        }}
        toolbar={{
          title: `Total (${data?.totalCount})`,
          filter: (
            <Space
              size={[10, "middle"]}
              wrap
              style={{
                marginBottom: 16,
              }}
            >
              {Object.entries(filters).map(([key, value]) => {
                return (
                  <Button
                    type="dashed"
                    key={key}
                    onClick={() => {
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
                    {filterLabels[key].text}: {value}
                  </Button>
                )
              })}
            </Space>
          ),
          multipleLine: true,
          actions: [
            <ModalForm<{
              name: string
              company: string
            }>
              title="New User"
              trigger={
                <Button key={3} type="primary" icon={<PlusOutlined />}>
                  New User
                </Button>
              }
              form={form}
              autoFocusFirstInput
              modalProps={{
                destroyOnClose: true,
                onCancel: () => console.log("run"),
              }}
              submitTimeout={2000}
              onFinish={onFinishCreate}
            >
              <ProForm.Group title="Bio">
                <ProFormText
                  width="md"
                  name="name"
                  label="Full Name"
                  tooltip="Enter your full name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your full name",
                    },
                  ]}
                  placeholder="Full Name"
                />

                <ProFormText
                  width="md"
                  name="username"
                  label="Username"
                  tooltip="Enter your username"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your username",
                    },
                    {
                      min: 6,
                      message: "Username must be at least 6 characters",
                    },
                  ]}
                  placeholder="Username"
                />

                <ProFormText
                  width="md"
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your email",
                    },
                    {
                      type: "email",
                      message: "Please enter a valid email",
                    },
                  ]}
                  placeholder="Enter a valid email address"
                />
                <ProFormSelect
                  width="md"
                  options={[
                    {
                      value: "admin",
                      label: "Admin",
                    },
                    {
                      value: "operator",
                      label: "Operator",
                    },
                    {
                      value: "analytics",
                      label: "Analytics",
                    },
                  ]}
                  rules={[
                    {
                      required: true,
                      message: "Please select a role",
                    },
                  ]}
                  name="role"
                  label="Select a Role"
                />
              </ProForm.Group>
              <ProForm.Group title="Password">
                <ProFormText.Password
                  width="md"
                  name="password"
                  label="Password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your password",
                    },
                  ]}
                  placeholder="Enter a password"
                />
                <ProFormText.Password
                  width="md"
                  name="confirmPassword"
                  label="Confirm Password"
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(
                          new Error(
                            "The two passwords that you entered do not match!",
                          ),
                        )
                      },
                    }),
                  ]}
                  placeholder="Confirm your password"
                />
              </ProForm.Group>
            </ModalForm>,
            selectedRowKeys.length === 1 ? (
              <Button
                key={2}
                type="primary"
                disabled={
                  selectedRowKeys.length !== 1 ||
                  user?.user_id === selectedRowKeys[0]
                }
                onClick={() => {
                  confirm({
                    title: "Do you want to delete this user?",
                    icon: <ExclamationCircleOutlined />,
                    content: "This action cannot be undone",
                    okText: "Yes",
                    okType: "danger",
                    cancelText: "No",
                    onOk() {
                      deleteUser(selectedRowKeys[0])
                        .unwrap()
                        .then((res) => {
                          if (res?.success === true) {
                            message.success("User deleted successfully")
                            refetch()
                          } else {
                            message.error("Something went wrong")
                          }
                        })
                    },
                    onCancel() {
                      console.log("Cancel")
                    },
                  })
                }}
              >
                Delete
              </Button>
            ) : null,
          ],
        }}
        dataSource={data?.users || []}
        loading={isLoading || isAddingUser}
        search={false}
        columnEmptyText="NA"
        dateFormatter="string"
      />
    </div>
  )
}
