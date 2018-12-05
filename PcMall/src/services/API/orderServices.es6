// POST 结算  [ {"productId":"1213313","quantity":2}, {"productId":"1213313","quantity":2} ]
export function statements (params) {
  return [`settlement/settlement/v1/statements/`, params]
}
// PATCH 生成正式订单
export function order (params) {
  // {addressId, remark, couponList:[{couponId, code}]}
  return [`settlement/settlement/v1/neworder`, params]
}
// GET 订单列表查询 {status, pageSize = 15, pageNum = 1}
export function getOrderList (params) {
  return [`myOrder/myOrder/v1/orderList/${params.status}?pageSize=${params.pageSize}&pageNum=${params.pageNum}`]
}
// GET 订单查询
export function getOrder (orderNum) {
  return [`myOrder/myOrder/v1/order/${orderNum}`]
}
// DLETE 取消订单 若订单为已确认状态，修改订单为已撤单状态。
export function deleteOrder (orderNum) {
  return [`myOrder/myOrder/v1/deleteOrder/${orderNum}`]
}
// POST 若订单为已发货状态，修改订单为已收货状态。
export function receivingNote (orderNum) {
  return [`myOrder/myOrder/v1/receivingNote/${orderNum}`]
}
// GET 查询用户售后单列表
export function getAsOrders (pageSize, pageNum) {
  return `afterSales/afterSalesOrder/v1/afterSaleOrders?pageSize=${pageSize}&pageNum=${pageNum}`
}
// GET 获取售后单详情
export function asOrderDetail (afterSalesNo) {
  return `afterSales/afterSalesOrder/v1/afterSaleOrder?afterSalesNo=${afterSalesNo}`
}
// POST
export function h5Alipay (params) {
  return [`payment/payment/v1/commerceH5Alipay`, params]
}
// POST
export function h5Wxpay (params) {
  return [`payment/payment/v1/commerceH5Wxpay`, params]
}
// POST
export function wxsmpay (params) {
  return [`payment/payment/v1/commerceWxsmPay`, params]
}
// POST
export function unionpay (params) {
  return [`payment/payment/v1/commerceunionPay`, params]
}
// GET 查询订单列表信息
export function orderListName (params) {
  return `myOrder/myOrder/v1/orderListName/${params.name}?pageNum=${params.pageNum}&pageSize=${params.pageSize}`
}
// POST 结算
export function getSettleMent (params) {
  return [`settlement/settlement/v1/newstatements/`, params]
}
// POST  测试
export function h5Test (params) {
    return [`payment/payment/v1/commerceunionSMPay`, params]
}

