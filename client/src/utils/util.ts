import { RootState } from "@/app/store"
import { RouteObject } from "@/routers/interface"

/**
 * @description Get localStorage
 * @param {String} key Storage name
 * @return string
 */
export const localGet = (key: string) => {
  const value = window.localStorage.getItem(key)
  try {
    return JSON.parse(window.localStorage.getItem(key) as string)
  } catch (error) {
    return value
  }
}

/**
 * @description set localStorage
 * @param {String} key Storage name


 * @param {Any} value Storage value
 * @return void
 */
export const localSet = (key: string, value: any) => {
  window.localStorage.setItem(key, JSON.stringify(value))
}

/**
 * @description remove localStorage
 * @param {String} key Storage name
 * @return void
 */
export const localRemove = (key: string) => {
  window.localStorage.removeItem(key)
}

/**
 * @description Clear localStorage
 * @return void
 */
export const localClear = () => {
  window.localStorage.clear()
}

/**
 * @description Get what needs to be expanded subMenu
 * @param {String} path Current access address
 * @returns array
 */
export const getOpenKeys = (path: string) => {
  let newStr: string = ""
  let newArr: any[] = []
  let arr = path.split("/").map((i) => "/" + i)
  for (let i = 1; i < arr.length - 1; i++) {
    newStr += arr[i]
    newArr.push(newStr)
  }
  return newArr
}

/**
 * @description Recursively query the corresponding route
 * @param {String} path Current access address
 * @param {Array} routes Route list
 * @returns array
 */
export const searchRoute = (
  path: string,
  routes: RouteObject[] = [],
): RouteObject => {
  let result: RouteObject = {}
  for (let item of routes) {
    if (item.path === path) return item
    if (item.children) {
      const res = searchRoute(path, item.children)
      if (Object.keys(res).length) result = res
    }
  }
  return result
}

/**
 * @description Recurse all associated routes of the current route and generate a breadcrumb navigation bar
 * @param {String} path Current access address
 * @param {Array} menuList Menu list
 * @returns array
 */
export const getBreadcrumbList = (
  path: string,
  menuList: Menu.MenuOptions[],
) => {
  let tempPath: any[] = []
  try {
    const getNodePath = (node: Menu.MenuOptions) => {
      tempPath.push(node)
      // Find the node that meets the conditions and terminate the recursion by throwing
      if (node.path === path) {
        throw new Error("GOT IT!")
      }
      if (node.children && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          getNodePath(node.children[i])
        }
        // If the child node of the current node is still not found after traversing, delete the node in the path.
        tempPath.pop()
      } else {
        // When a leaf node is found, delete the leaf node in the path
        tempPath.pop()
      }
    }
    for (let i = 0; i < menuList.length; i++) {
      getNodePath(menuList[i])
    }
  } catch (e) {
    return tempPath.map((item) => item.title)
  }
}

/**
 * @description Double recursion finds all the breadcrumbs generated objects and stores them in redux, so you don’t have to search recursively every time.
 * @param {String} menuList Current menu list
 * @returns object
 */
export const findAllBreadcrumb = (
  menuList: Menu.MenuOptions[],
): { [key: string]: any } => {
  let handleBreadcrumbList: any = {}
  const loop = (menuItem: Menu.MenuOptions) => {
    // The following judgment code explanation *** !item?.children?.length   ==>   (item.children && item.children.length > 0)
    if (menuItem?.children?.length)
      menuItem.children.forEach((item) => loop(item))
    else
      handleBreadcrumbList[menuItem.path] = getBreadcrumbList(
        menuItem.path,
        menuList,
      )
  }
  menuList.forEach((item) => loop(item))
  return handleBreadcrumbList
}

/**
 * @description Use recursion to process routing menus, generate one-dimensional arrays, and judge menu permissions
 * @param {Array} menuList All menu list
 * @param {Array} newArr One-dimensional array of menus
 * @return array
 */
export function handleRouter(
  routerList: Menu.MenuOptions[],
  newArr: string[] = [],
) {
  routerList.forEach((item: Menu.MenuOptions) => {
    typeof item === "object" && item.path && newArr.push(item.path)
    item.children && item.children.length && handleRouter(item.children, newArr)
  })
  return newArr
}

/**
 * @description Determine data type
 * @param {Any} val Need to determine the type of data
 * @return string
 */
export const isType = (val: any) => {
  if (val === null) return "null"
  if (typeof val !== "object") return typeof val
  else
    return Object.prototype.toString.call(val).slice(8, -1).toLocaleLowerCase()
}

/**
 * @description Object array deep cloning
 * @param {Object} obj source object
 * @return object
 */
export const deepCopy = <T>(obj: any): T => {
  let newObj: any
  try {
    newObj = obj.push ? [] : {}
  } catch (error) {
    newObj = {}
  }
  for (let attr in obj) {
    if (typeof obj[attr] === "object") {
      newObj[attr] = deepCopy(obj[attr])
    } else {
      newObj[attr] = obj[attr]
    }
  }
  return newObj
}

/**
 * @description Prepare headers for API requests
 * @param headers Headers object
 * @param getState Function to get the current state
 * @returns Headers object with authorization token if available in state
 */
//@ts-ignore
export const prepareHeaders = (headers, { getState }) => {
  const token = getState().global.token

  // If we have a token set in state, let's assume that we should be passing it.
  if (token) {
    headers.set("Authorization", `${token}`)
  }

  return headers
}
