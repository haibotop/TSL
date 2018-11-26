// 获取折扣码列表
export function getDiscountList (params) {
  return [`/OperationManagement/OperationManagement/v1/DiscountCode/list`, params]
}
// 展示可使用折扣码，包括可用和不可用
export function getDiscountInfo (params) {
  return [`/OperationManagement/OperationManagement/v1/getDiscountCodeOrderInfo`, params]
}
// 用户兑换折扣码
export function cashingDiscountcode (params) {
  return [`/OperationManagement/OperationManagement/v1/cashingDiscountcode`, params]
}
