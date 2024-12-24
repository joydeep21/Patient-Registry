import { useEffect } from "react"
import { Dropdown, theme } from "antd"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "@/app/store"
import {
  UserOutlined,
  LogoutOutlined,
  UserAddOutlined,
} from "@ant-design/icons"
import {
  LucidePieChart,
  LucideUserSquare2,
  Settings2,
  Users2,
} from "lucide-react"
import { logout, selectUserInfo, updateCollapse } from "@/app/globalSlice"
import { useAppSelector } from "@/app/hooks"
import { MenuProps } from "antd/lib"
import { ProLayout } from "@ant-design/pro-components"
import { themeConfig } from "@/utils/themeConfig"

const LayoutIndex = () => {
  const navigate = useNavigate()

  const location = useLocation()

  const userInfo = useAppSelector(selectUserInfo)

  const isLoggedIn = useAppSelector((state) => state.global.userInfo)
  const isCollapsed = useAppSelector((state) => state.global.isCollapse)

  const role = userInfo?.role

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login")
    }
  }, [isLoggedIn, navigate])

  const dispatch = useDispatch()

  const menuItems: MenuProps["items"] = [
    {
      key: "1",
      label: "Profile",
      icon: <UserOutlined />,
      onClick: () => {
        navigate("/settings")
      },
    },
    {
      key: "2",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: () => {
        dispatch(logout())
      },
    },
  ]

  return (
    <ProLayout
      title="RGCI"
      fixSiderbar
      fixedHeader
      logo="https://play-lh.googleusercontent.com/LbZ7BQqFOaWeEewm18KR1UszhpfOMb3X5qPv0vLk3TDEqEnyLw2NjRHbkQ96wpn8OBA"
      breakpoint={false}
      collapsed={isCollapsed}
      onMenuHeaderClick={() => {
        navigate("/patients")
      }}
      onCollapse={(collapsed) => {
        dispatch(updateCollapse(collapsed))
      }}
      token={{
        header: {
          colorBgHeader: "#fff",
        },
        sider: {
          colorMenuBackground: "#fff",
        },
      }}
      // headerContentRender={() => {
      //   return (
      //     <div className="flex flex-row space-between w-full gap-2 items-center">
      //       <Input
      //         placeholder="Search"
      //         style={{ width: "600px" }}
      //         size="large"
      //         suffix={<SearchOutlined />}
      //       />
      //       <Button size="large" className="ml-auto">
      //         {dayjs().format("DD MMMM YYYY")}
      //       </Button>
      //       <Button size="large" type="text" icon={<BellTwoTone />} />
      //     </div>
      //   )
      // }}
      footerRender={() => (
        <div
          style={{
            textAlign: "center",
            padding: "16px",
            fontSize: "12px",
            color: "rgba(0, 0, 0, 0.45)",
          }}
        >
          <span>
            © ${new Date().getFullYear()}` Created by
            <button
              onClick={() => window.open("https://www.varenium.com/")}
              style={{
                color: "rgba(0, 0, 0, 0.45)",
                border: "none",
                background: "none",
                cursor: "pointer",
                paddingLeft: "4px",
              }}
            >
              Varenium
            </button>
          </span>
        </div>
      )}
      pageTitleRender={false}
      menuDataRender={() => [
        {
          path: "/patients",
          icon: (
            <LucideUserSquare2
              color={theme.getDesignToken(themeConfig).colorPrimary}
              size={20}
            />
          ),
          name: "Patients",
          children: [
            {
              path: "/patients/add-patient",
              name: "Create Patient",
              icon: <UserAddOutlined />,
            },
            {
              path: "/patients/:id/add-lot",
              name: "Add LOT",
              icon: <UserAddOutlined />,
            },
            {
              path: "/patients/:id/update-patient",
              name: "Update Patient",
              icon: <UserAddOutlined />,
            },
            {
              path: "/patients/:id/update-lot/:lotId",
              name: "Update Line of Treatments",
              icon: <UserAddOutlined />,
            },
            {
              path: "/patients/:id/get-lots",
              name: "Line of Treatments",
              icon: <UserAddOutlined />,
            },
          ],
          hideChildrenInMenu: true,
          hideInMenu: role !== "admin" && role !== "operator",
        },
        {
          path: "/analytics",
          icon: (
            <LucidePieChart
              color={theme.getDesignToken(themeConfig).colorPrimary}
              size={20}
            />
          ),
          name: "Analytics",
          hideInMenu: role !== "admin" && role !== "analytics",
        },
        {
          path: "/users",
          icon: (
            <Users2
              color={theme.getDesignToken(themeConfig).colorPrimary}
              size={20}
            />
          ),
          name: "Users",
          hideInMenu: role !== "admin",
        },
        {
          path: "/settings",
          icon: (
            <Settings2
              color={theme.getDesignToken(themeConfig).colorPrimary}
              size={20}
            />
          ),
          name: "Settings",
          hideInMenu: role !== "admin",
        },
      ]}
      avatarProps={{
        src: "https://avatars.githubusercontent.com/u/8186664?v=4",
        size: "small",
        title: userInfo?.username,
        shape: "circle",
        render: (props, dom) => {
          return (
            <Dropdown
              menu={{
                items: menuItems,
              }}
            >
              {dom}
            </Dropdown>
          )
        },
      }}
      menuItemRender={(item: any, defaultDom: any) => (
        <Link to={item.path}> {defaultDom} </Link>
      )}
      subMenuItemRender={(item: any, defaultDom: any) => (
        <Link to={item.path}> {defaultDom} </Link>
      )}
      breadcrumbRender={(routers = []) => [...routers]}
      layout="mix"
      location={location}
    >
      <Outlet />
    </ProLayout>
  )
}

export default LayoutIndex
