// 我的已领取的优惠券
export function getMyCoupon (status, pageNum, pageSize) {
  return `campaign/Campaign/v1/coupon?pageNum=${pageNum}&status=${status}&pageSize=${pageSize}`
}
// GET 领取系统派的券
export function receiveCoupon (couponId, code) {
  return `campaign/Campaign/v1/receivedCoupon?couponId=${couponId}&code=${code}`
}
// 进入商品根据skuid获取商品关联的优惠券
export function getSkuCoupon (skuId) {
  return `campaign/Campaign/v1/getProductCoupons/${skuId}`
}
// 进入商品根据skuid获取商品关联促销
export function getProductPromotions (skuId) {
  return `campaign/Campaign/v1/getProductPromotions/${skuId}`
}
// 获取优惠券关联的商品集合信息
export function getCouponSku (param, pagesize, pageNum) {
  return [`campaign/Campaign/v1/getCouponProducts?pageSize=${pagesize}&pageNum=${pageNum}`, param]
}
// 获取促销关联的商品集合信息
export function getPromSku (param, pagesize, pageNum) {
  return [`campaign/Campaign/v1/getPromProducts?pageSize=${pagesize}&pageNum=${pageNum}`, param]
}
// POST 下单页展示可使用的优惠券
export function getCouponOrderInfo (ids) {
  return [`campaign/Campaign/v1/getCouponOrderInfo`, ids]
}
// GET /Campaign/{params} 下单查询最优优惠券
export function getOptimal (params) {
  return [`campaign/Campaign/v1/getOptimalCouponOrderInfo`, params]
}
// 根据折扣码获取相关商品信息
export  function getDiscountProduct (param, pagesize, pageNum) {
  return [`/OperationManagement/OperationManagement/v1/getDiscountcodeProducts?pageSize=${pagesize}&pageNum=${pageNum}`, param]
}
