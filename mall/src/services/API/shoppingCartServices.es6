// 查询购物车
export function getshoppingCart () {
  return `/member/shoppingCart/`
}
// 查询购物车-含促销
export function getshoppingCart1 () {
  return `/member/shoppingCart1/`
}
// 删除购物车商品项
export function deleteCartItems (ids) {
  return [
    `shoppingCart/shoppingCart/v1/cartItems/`,
    ids
  ]
}
// 修改商品数量/规格
export function putCartItems (ids) {
  return [
    `shoppingCart/shoppingCart/v1/cartItems/`,
    ids
  ]
}
// 获取商品SKU规格
export function getskuInfo (productId) {
  return `productDetail/productDetail/v1/skuInfo/${productId}`
}
// 获取购物车SPU规格
export function getspuInfo (spuId) {
  return `productDetail/productDetail/v1/spuInfo/${spuId}`
}
// 获取new skuid
export function postspecGetSku (params) {
  return [
    `productDetail/productDetail/v1//specGetSku/`,
    params
  ]
}
// POST 批量加入购物车
// [
//   {
//     "merchantId": "string",
//     "price": 0,
//     "productId": "string",
//     "productItemId": "string",
//     "quantity": 0
//   }
// ]
export function visitorCartItem (params) {
  return [`shoppingCart/shoppingCart/v1/visitorCartItem`, params]
}

