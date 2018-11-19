export function onsell (pageNum, pageSize, params) {
  return [
    `/product/product/v1/product/onsell?pageNum=` + `${pageNum}` + `&pageSize=` + `${pageSize}`,
    params
  ]
}

export function delProduct (params) {
  return [
    `/product/product/v1/productSpu/del`,
    params
  ]
}

export function delItemsForSale (params) {
  return [
    `/product/product/v1/delSpu`, params
  ]
}

export function forSell (pageNum, pageSize, params) {
  return [
    `/product/product/v1/product/forsell?pageNum=` + `${pageNum}` + `&pageSize=` + `${pageSize}`,
    params
  ]
}

export function batchPost (params) {
  return [
    `/product/product/v1/productSpu/post`,
    params
  ]
}

export function stock (pageNum, pageSize, params) {
  return [
    `/product/product/v1/stock?pageNum=` + `${pageNum}` + `&pageSize=` + `${pageSize}`,
    params
  ]
}

export function putStock (params) {
  return [
    `/product/product/v1/stock`,
    params
  ]
}

// 查询待售商品的详情信息
export function getProductInfo (spuId, categoryId) {
  return `/product/product/v1/productSpu/${spuId}/${categoryId}`
}
// 查询在售商品的详情信息
export function getOnsellInfo (spuId, categoryId) {
  return `/product/product/v1/productSpuOnSell/${spuId}/${categoryId}`
}
// 编辑查询SPU下对应SKU信息
export function getSkuInfo (spuId) {
  return `/product/product/v1/onsellProductSpu/${spuId}`
}
// 修改商品单品保存操作
export function setSpuInfo (param) {
  return [
    `/product/product/v1/singleProductInfo`,
    param
  ]
}
// 在售商品多品保存操作
export function onSetSkuInfo (param, spuId) {
  return [
    `/merchantCenter/merchantcenter/v1/onSellProductInfo/${spuId}`,
    param
  ]
}
// 在售商品单品保存操作
export function onSellPro (param) {
  return [
    `/product/product/v1/singleOnsellProductInfo`,
    param
  ]
}
// 修改商品多品保存操作
export function setSkuInfo (param, status) {
  return [
    `/merchantCenter/merchantcenter/v1/productInfo/${status}`,
    param
  ]
}
// 在售编辑时获取sku组合
export function onGetSkuGroup (param, spuId) {
  return [
    `/merchantCenter/merchantcenter/v1/skuSpecArray/${spuId}`,
    param
  ]
}
// 获取sku组合
export function getSkuGroup (param, spuId, status) {
  return [
    `/merchantCenter/merchantcenter/v1/skuSpecArray/${spuId}/${status}`,
    param
  ]
}
// 编辑保存sku修改后价格
export function postSkuInfo (params) {
  return [
    `/product/product/v1/onsellProductSpu`,
    params
  ]
}
// 得到ueditor的详细回显信息
export function getDetail (spuId) {
  return `/productDetail/productDetail/v1/detail/${spuId}`
}
// POST 批量发布
// [{
//     "ad": "string",
//     "firstCategory": "string",
//     "introduction": "string",
//     "keyWordd": "string",
//     "name": "string",
//     "originPlace": "string",
//     "secondCategory": "string",
//     "thirdCategory": "string"
// }]
export function batchImport (params) {
  return [`/product/product/v1/batchImport`, params]
}
// post H5商品索引生成
export function addSkuIndex (SkuInfo) {
  return [`/product/product/v1/createProductIndex`, SkuInfo]
}
// 草稿箱
export function productDrafts (params, pageNum, pageSize) {
  return [`/product/product/v1/productDrafts?pageNum=${pageNum}&pageSize=${pageSize}`, params]
}
export function productDraft (params) {
  return [`/product/product/v1/productDraft`, params]
}
export function getProductDraft (pid) {
  return `/product/product/v1/productDrafts/${pid}`
}
// POST 查询商品，用于促销
export function promotionGoods (params, pageNum, pageSize) {
  return [`/product/product/v1/promotionGoods?pageNum=${pageNum}&pageSize=${pageSize}`, params]
}
// GET 下载批量发布模板
export function excelTem () {
  return `/om/OperationManagement/v1/excelTemplateLead`
}
