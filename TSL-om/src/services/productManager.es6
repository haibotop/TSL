export function onsell (pageNum, pageSize, params) {
  return [
    `omfagateway/v1/product/product/v1/product/onsell?pageNum=` + `${pageNum}` + `&pageSize=` + `${pageSize}`,
    params
  ]
}

export function delProduct (params) {
  return [
    `omfagateway/v1/product/product/v1/productSpu/del`,
    params
  ]
}

export function forSell (pageNum, pageSize, params) {
  return [
    `omfagateway/v1/product/product/v1/product/forsell?pageNum=` + `${pageNum}` + `&pageSize=` + `${pageSize}`,
    params
  ]
}

export function bill (params) {
  return [
    `omfagateway/v1/product/product/v1/bill`,
    params
  ]
}

export function querryProduct (productId) {
  return `omfagateway/v1/product/product/v1/product/` + `${productId}`
}

export function batchPost (params) {
  return [
    `omfagateway/v1/product/product/v1/productSpu/post`,
    params
  ]
}
export function stock (pageNum, pageSize, params) {
  return [
    `omfagateway/v1/product/product/v1/stock?pageNum=` + `${pageNum}` + `&pageSize=` + `${pageSize}`,
    params
  ]
}
