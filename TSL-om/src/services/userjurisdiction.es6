// 获取角色列表
export function getGroups () {
  return `om/OperationManagement/v1/group/getGroups`
}
// 新增角色
export function postInsertGroups (params) {
  return [
    `om/OperationManagement/v1/group/insertGroup`,
    params
  ]
}
// 修改角色
export function putupdateByGroup (params) {
  return [
    `om/OperationManagement/v1/group/updateByGroup`,
    params
  ]
}
// 删除角色
export function deleteGroup (id) {
  return `om/OperationManagement/v1/group/deleteByPrimaryKey/${id}`
}
// 权限设置
export function postBatchUpdateGroupMenu (params) {
  return [
    `/batchUpdateGroupMenu`,
    params
  ]
}
// 获取权限
export function getPower (id) {
  return `om/OperationManagement/v1/menu/getMenus/${id}`
}
// 检测用户名是否存在
export function getUserName (userName) {
  return [`om/OperationManagement/v1/operator/${userName}`]
}

// 获取用户列表
export function postUserList (params) {
  return [
    `om/OperationManagement/v1/operatorUser`,
    params
  ]
}
// 启用用户
export function upOperator (operatorId) {
  return `om/OperationManagement/v1/operator/${operatorId}`
}
// 停用用户
export function offOperator (operatorId) {
  return `stopOperator/${operatorId}`
}
// 获取角色列表
export function getOperatorUser () {
  return `om/OperationManagement/v1/operatorUser`
}
// 修改密码
export function putPassword (params) {
  return [
    `om/OperationManagement/v1/operatorUser`,
    params
  ]
}
// 重置密码
export function getResetPwd (operatorId) {
  return `om/OperationManagement/v1/operatorUser/${operatorId}`
}
// 添加操作员
export function addOperator (params) {
  return [
    `om/OperationManagement/v1/operator`,
    params
  ]
}
// 修改操作员
export function editOperator (params) {
  return [
    `om/OperationManagement/v1/OperatorInfo`,
    params
  ]
}
export function deleteOperator (params) {
  return [
    `om/OperationManagement/v1/operators`,
    params
  ]
}
