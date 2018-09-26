/**
 * Created by issuser on 2017/10/27 0027.
 */
// post 提交通用参数和基本信息
export function commonSpecArrray (params) {
  return [`/omfagateway/v1/merchantCenter/merchantCenter/v1/commonSpecArray`, params]
  // return [`http://10.48.82.96:8080/merchantCenter/v1/commonSpecArray`, params]
}
// post 获取sku组合
export function getSkuGroups (spuId, sku) {
  return [`/omfagateway/v1/merchantCenter/merchantCenter/v1/specArray?spuId=${spuId}`, sku]
}
// post 发布商品sku
export function postSkuInfos (skuInfos) {
  return [`/omfagateway/v1/merchantCenter/merchantCenter/v1/skuInfos`, skuInfos]
}
// post 发布单品sku
export function postSkuInfo (skuInfo) {
  return [`/omfagateway/v1/merchantCenter/merchantCenter/v1/skuInfo`, skuInfo]
}
