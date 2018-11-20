/**
 * Created by issuser on 2017/10/27 0027.
 */
// post 提交通用参数和基本信息
export function commonSpecArrray (params) {
  return [`/merchantCenter/merchantcenter/v1/commonSpecArray`, params]
  // return [`http://10.48.82.96:8080/merchantCenter/v1/commonSpecArray`, params]
}
// post 获取sku组合
export function getSkuGroups (spuId, sku) {
  return [`/merchantCenter/merchantcenter/v1/specArray?spuId=${spuId}`, sku]
}
// post 发布商品sku 立即上架
export function postSkuInfos (skuInfos) {
  return [`/merchantCenter/merchantcenter/v1/skuInfos`, skuInfos]
}
// post 发布商品sku 定时
export function postSkuInfosInFt (skuInfos) {
  return [`/merchantCenter/merchantcenter/v1/skuInfosInFt`, skuInfos]
}
// post 发布商品sku 放入仓库
export function postSkuInfosToStock (skuInfos) {
  return [`/merchantCenter/merchantcenter/v1/skuInfosToStock`, skuInfos]
}
// post 发布单品sku 立即上架
export function postSkuInfo (skuInfo) {
  return [`/merchantCenter/merchantcenter/v1/skuInfo`, skuInfo]
}
// post 发布单品sku 定时
export function postSkuInfoInFt (skuInfos) {
  return [`/merchantCenter/merchantcenter/v1/skuInfoInFt`, skuInfos]
}
// post 发布单品sku 放入仓库
export function postSkuInfoToStock (skuInfos) {
  return [`/merchantCenter/merchantcenter/v1/skuInfoToStock`, skuInfos]
}
