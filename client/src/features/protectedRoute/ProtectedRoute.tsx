import { selectUserInfo } from "@/app/globalSlice"
import { useAppSelector } from "@/app/hooks"
import React from "react"
import { useNavigate } from "react-router-dom"

export function ProtectedRoute({ children, allowedRoles }: any) {
  const navigate = useNavigate()

  const userInfo = useAppSelector(selectUserInfo)
  const isAuthorized = userInfo?.exp ? userInfo.exp > Date.now() / 1000 : false

  const areRolesRequired = !!allowedRoles?.length

  const currentRole = userInfo?.role

  const rolesMatch = areRolesRequired
    ? allowedRoles?.includes(currentRole || "admin")
    : true

  if (!isAuthorized || !rolesMatch) {
    navigate("/login")
  }

  return children
}
