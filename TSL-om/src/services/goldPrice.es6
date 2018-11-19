// 获取金价
export function getGoldPrice () {
  return `/product/product/v1/goldPrice`
}
// 金价修改
export function putGoldPrice (params) {
  return [
    `/product/product/v1/goldPrice`,
    params
  ]
}
// 金价设置
export function postGoldPrice (params) {
  return [
    `/product/product/v1/goldPrice`,
    params
  ]
}
// 启用&停用金价
export function GoldStatus (expressionId) {
  return `/product/product/v1/goldPrice/` + `${expressionId}`
}
// 金价生成索引
export function goldSolr () {
  return `/product/product/v1/goldSynchrodata`
}
