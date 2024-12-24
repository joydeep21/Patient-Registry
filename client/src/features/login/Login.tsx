import { App, Button, Form, Input, message } from "antd"
import {
  UserOutlined,
  LockOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "@/app/store"
import { setToken, setUserInfo } from "@/app/globalSlice"
import jwtDecode from "jwt-decode"
import { type Login as TLogin } from "./loginApi"
import loginApi from "@/features/login/loginApi"

export function Login() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { useLoginMutation } = loginApi
  const [login] = useLoginMutation()

  const onFinish = async (loginForm: TLogin.ReqLoginForm) => {
    try {
      setLoading(true)
      const data = await login(loginForm).unwrap()

      const token = data!.token
      dispatch(setToken(token))
      dispatch(setUserInfo(jwtDecode(token)))
      message.success({ content: "Success" })
      navigate("/patients")
    } finally {
      setLoading(false)
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo)
  }
  return (
    <App>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 5 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        size="large"
        autoComplete="off"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please enter username" }]}
        >
          <Input placeholder="Username" prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter password" }]}
        >
          <Input.Password
            autoComplete="new-password"
            placeholder="Password"
            prefix={<LockOutlined />}
          />
        </Form.Item>
        <Form.Item className="login-btn">
          <div className="flex flex-1 row justify-between gap-2">
            <Button
              size="large"
              className="w-1/2"
              onClick={() => {
                form.resetFields()
              }}
              icon={<CloseCircleOutlined />}
            >
              Reset
            </Button>
            <Button
              className="w-1/2"
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<UserOutlined />}
            >
              Login
            </Button>
          </div>
        </Form.Item>
      </Form>
    </App>
  )
}
