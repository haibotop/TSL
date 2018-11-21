export function customerManagement (params) {
  return [
    `/om/OperationManagement/v1/customerManagement`,
    params
  ]
}
export function shippingAddress (params) {
  return `/om/OperationManagement/v1/shippingAddress/` + params
}
export function memberLoginRecord (params) {
  return `/om/OperationManagement/v1/memberLoginRecord/` + params
}
export function memberConsume (params) {
  return [
    `/om/OperationManagement/v1/memberConsume/management`,
    params
  ]
}
export function customerManagementExport () {
  return `/om/OperationManagement/v1/customerManagementExport`
}
