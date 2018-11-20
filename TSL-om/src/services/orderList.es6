// 订单列表查询
export function postOrderList (pageNum, pageSize, params) {
  return [
    `/myOrder/myOrder/v1/orderList?pageNum=` + `${pageNum}` + `&pageSize=` + `${pageSize}`,
    params
  ]
}
// 订单备注
export function postRemark (remark, params) {
  return [
    `/merchantCenter/merchantcenter/v1/remark/` + `${remark}`,
    params
  ]
}
// 批量订单出库
export function postshippingOrder (operator, params) {
  return [
    `/merchantCenter/merchantcenter/v1/shippingOrder/${operator}`,
    params
  ]
}
// 订单查询
export function getOrder (orderNo) {
  return `/merchantCenter/merchantcenter/v1/order/` + `${orderNo}`
}
// 售后订单查询
export function createAfterSale (operatorName, params) {
  return [
    `afterSales/afterSalesOrder/v1/afterSaleOrder/${operatorName}`,
    params
  ]
}
// 订单导出
export function exportExcel (params) {
  let url = `/om/OperationManagement/v1/ExcelUtils`
  url += (url.includes('?') ? '&' : '?') + params
  return url
}
// 将已取消订单修改为待发货订单
export function updateOrder (orderId) {
  return `/merchantCenter/merchantcenter/v1/updateOrder?orderId=${orderId}`
}
