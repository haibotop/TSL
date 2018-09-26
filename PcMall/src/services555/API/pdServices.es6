// ----------get 获取sku商品信息
export function getSkuInfo (skuId) {
  return [`/productDetail/productDetail/v1/skuInfo/${skuId}`]
}
// ----------get 获取spu商品信息
export function getSpuInfo (spuId) {
  return [`/productDetail/productDetail/v1/spuInfo/${spuId}`]
}
// ----------get 获取product detail
export function getProductDetail (spuId) {
  return [`/productDetail/productDetail/v1/detail/${spuId}`]
}
// ----------post 商品规格组合获取sku信息
// [{"specId": "string","specName": "string","specValueId": "string","specValueName": "string"}]
export function specGetSku (params) {
  return [`/productDetail/productDetail/v1/specGetSku`, params]
}
// ----------GET spu和spu通用属性信息
export function spuSpec (spuId) {
  return [`/product/product/v1/spuSpec/${spuId}`]
}// ---------判断会员是否收藏商品
export function isProductCollection (productId) {
  return [`customer/customer/v1/isProductCollection/${productId}`]
}
// ----------会员添加商品收藏 post productCollect
// {merchantId: '', productId: ''}
export function productCollect (params) {
  return [`/customer/customer/v1/productCollect`, params]
}
// ----------会员删除商品收藏 delete productCollect
export function deleteProductCollect (skuId) {
  return [`/customer/customer/v1/productCollect/${skuId}`]
}
// POST /cartItem 添加商品项 加入购物车
export function postCartItem (params) {
  return [`shoppingCart/shoppingCart/v1/cartItem`, params]
}
// GET /cartItem/{memberId} 查询购物车商品项
export function getCartItem (memberId) {
  return [`shoppingCart/shoppingCart/v1/cartItem`]
}

