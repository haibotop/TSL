// -------------促销----------
// 获取促销列表
export function getProList (param, pageSize, pageNum) {
  return [`om/OperationManagement/v1/promotion/getPromotions?pageSize=${pageSize}&pageNum=${pageNum}`, param]
}
// Delete促销
export function delPromotion (id) {
  return `om/OperationManagement/v1/promotion/deleteByPromotionId/${id}`
}
// POST 添加满减/满折促销
export function insertPromotion (params) {
  return [`om/OperationManagement/v1/promotion/insertPromotion`, params]
}
// POST 添加促销单品折扣
export function insertPromotionAlone (params) {
  return [`om/OperationManagement/v1/promotion/insertPromotionAlone`, params]
}
// POST 添加促销规则直降
export function insertPromotionDirect (params) {
  return [`om/OperationManagement/v1/promotion/insertPromotionDirect`, params]
}
// GET 根据促销ID查询促销信息
export function getUpdatePromotions (id) {
  return [`om/OperationManagement/v1/promotion/getUpdatePromotions/${id}`]
}
// POST 添加满减/满折促销
export function updatePromotion (params) {
  return [`om/OperationManagement/v1/promotion/updatePromotion`, params]
}
// POST 添加促销单品折扣
export function updatePromotionAlone (params) {
  return [`om/OperationManagement/v1/promotion/updatePromotionAlone`, params]
}
// POST 添加促销规则直降
export function updatePromotionDirect (params) {
  return [`om/OperationManagement/v1/promotion/updatePromotionDirect`, params]
}
// POST /getPromProducts 查询促销关联商品集合信息
// {"promotionId":"促销id","id":"商品id","name":" 商品名称","zongStatus":"综合排序状态","svStatus":"销量排序状态","priceStatus":"价格排序状态","dateStatus":"时间排序状态"}
export function getPromProducts (params, pageNum, pageSize) {
  return [`campaign/Campaign/v1/getPromProducts?pageNum=${pageNum}&pageSize=${pageSize}`, params]
}
// -------------优惠券--------
// 获取优惠券列表
export function getCouponByName (name, pageSize, pageNum) {
  return `om/OperationManagement/v1/getCouponByName/${name}?pageSize=${pageSize}&pageNum=${pageNum}`
}
// 创建优惠券
export function createCoupon (params) {
  return [`/om/OperationManagement/v1/Coupon`, params]
}
// 根据优惠券id查询优惠券详情
export function getCouponById (id) {
  return `om/OperationManagement/v1/getCouponById/` + `${id}`
}
// 参加优惠券的商品查询(类目)
export function productSkuCidsInfo (params, pageNum, pageSize) {
  return [
    `product/product/v1/productSkuInfo/cids?pageNum=${pageNum}&pageSize=${pageSize}`,
    params
  ]
}
// 参加优惠券的商品查询(单品)
export function productSkuPidsInfo (params, pageNum, pageSize) {
  return [
    `product/product/v1/productSkuInfo/ids?pageNum=${pageNum}&pageSize=${pageSize}`,
    params
  ]
}
// 根据优惠券商品类目ID查询类目
export function getCatalogs () {
  return `catalogs/catalogs/v1/list`
}
// 获取全部券码
export function getCouponCoding (couponId, pageSize, pageNum) {
  return `om/OperationManagement/v1/getCouponCoding?couponId=${couponId}&pageSize=${pageSize}&pageNum=${pageNum}`
}
// 查询已领取券码
export function getCouponCodingGet (couponId, pageSize, pageNum) {
  return `om/OperationManagement/v1/getCouponCodingGet?couponId=${couponId}&pageSize=${pageSize}&pageNum=${pageNum}`
}
// 查询未领取券码
export function getCouponCodingNotGet (couponId, pageSize, pageNum) {
  return `om/OperationManagement/v1/getCouponCodingNotGet?couponId=${couponId}&pageSize=${pageSize}&pageNum=${pageNum}`
}
// 查询已使用券码
export function getCouponCodingUse (couponId, pageSize, pageNum) {
  return `om/OperationManagement/v1/getCouponCodingUse?couponId=${couponId}&pageSize=${pageSize}&pageNum=${pageNum}`
}
// 根据ID删除优惠券
export function deleteByCouponId (id) {
  return `om/OperationManagement/v1/deleteByCouponId/` + `${id}`
}
// 根据选择id项批量删除优惠券
export function deleteByCouponIds (ids) {
  return [
    `om/OperationManagement/v1/deleteByCouponIds`,
    ids
  ]
}
// 派券 会员信息获取
export function postSendCoupons (params) {
  return [
    `om/OperationManagement/v1/sendCoupons`,
    params
  ]
}
// 派券操作
export function postSaveCouponUser (couponId, ids) {
  return [
    `om/OperationManagement/v1/saveCouponUser?couponId=${couponId}`,
    ids
  ]
}
// 派券总人数限制操作
export function couponCount (id) {
  return `om/OperationManagement/v1/couponCount?couponId=${id}`
}

// -------------折扣码------------
// 创建折扣码
export function createDiscount (params) {
  return [`/om/OperationManagement/v1/discountCode/list`, params]
}
// 查看活动码折扣列表
export function discountCodeList (params, pageSize, pageNum) {
  return [`/om/OperationManagement/v1/discountCodeListsByConditions/list?pageSize=${pageSize}&pageNum=${pageNum}`, params]
}

// 根据ID删除折扣码。
export function delByDiscountIds (ids) {
  return [
    `om/OperationManagement/v1/DelByDiscountIds`,
    ids
  ]
}
// 查看活动码折扣详情--------------
export function discountCodeLists (params) {
  return [`/om/OperationManagement/v1/discountCode/lists`, params]
}
// GET 下载折扣码模板
export function excelTem () {
  return `/om/OperationManagement/v1/excelTemplateLead`
}

// 查看活动码折扣使用情况列表
export function dCodeByConditionsLists (setObj, pageSize, pageNum) {
  return [
    `om/OperationManagement/v1/discountCodeListsByConditions/lists?pageSize=${pageSize}&pageNum=${pageNum}`,
    setObj
  ]
}
// 导入excel折扣码
export function discountCodeimportListsList (setObj) {
  return [
    `om/OperationManagement/v1/discountCodeimportLists/list`,
    setObj
  ]
}
