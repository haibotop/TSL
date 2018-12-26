export function receivingNote (receivingNote, operator) {
  return [
    `/afterSales/afterSalesOrder/v1/receivingNote/` + `${receivingNote}/${operator}`
  ]
}
// 退货失败
export function returnFailure (returnNo, operator) {
  return [
    `/afterSales/afterSalesOrder/v1/returnFailure/${returnNo}/${operator}`
  ]
}
// 添加退款信息
export function refundDetail (afterSaleOrderNo, params) {
  return [
    `/afterSales/afterSalesOrder/v1/refundDetail/${afterSaleOrderNo}`,
    params
  ]
}
// 获取售后单列表
export function getAfterSaleList (pageNum, pageSize, params) {
  return [
    `/merchantCenter/merchantcenter/v1/afterSaleOrders?pageNum=` + `${pageNum}` + `&pageSize=` + `${pageSize}`,
    params
  ]
}
// 添加备注
export function afterSaleRemark (afterSaleOrderNo, comment) {
  return [
    `/afterSales/afterSalesOrder/v1/remark/${afterSaleOrderNo}/` + `${comment}`
  ]
}
// 获取操作日志内容
export function getAfterSaleLog (afterSaleOrderNo) {
  return [
    `/afterSales/afterSalesOrder/v1/afterSaleOrderLog/${afterSaleOrderNo}`
  ]
}
// 设置退款失败
export function refundFailure (afterSaleOrderNo, operator) {
  return [
    `/afterSales/afterSalesOrder/v1/refundFailure/${afterSaleOrderNo}/${operator}`
  ]
}
// 退款成功
export function refundSuccess (afterSaleOrderNo, operator) {
  return [
    `/afterSales/afterSalesOrder/v1/refundOrder/${afterSaleOrderNo}/${operator}`
  ]
}
// 订单导出
export function exportExcel (params) {
  let url = `/merchantCenter/merchantcenter/v1/afterSaleOrderExcelUtils`
  url += (url.includes('?') ? '&' : '?') + params
  return url
}