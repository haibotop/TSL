// get 展示运营类目
export function getCate () {
  return `/omfagateway/v1/catalogs/catalogs/v1/list`
}
// post 新增运营类目
export function addCate (params) {
  return [`/omfagateway/v1/catalogs/catalogs/v1/catalog`, params]
}
// put 编辑运营类目
export function editCate (params) {
  return [`/omfagateway/v1/catalogs/catalogs/v1/catalog`, params]
}
// delete 删除运营类目
export function deleteCate (categoryId) {
  return `/omfagateway/v1/catalogs/catalogs/v1/catalog/${categoryId}`
}
// put 停用运营类目
export function offCate (categoryId) {
  return `/omfagateway/v1/catalogs/catalogs/v1/catalog/${categoryId}`
}
// post 启用运营类目
export function onCate (categoryId) {
  return `/omfagateway/v1/catalogs/catalogs/v1/catalog/${categoryId}`
}
// get 展示SKU类目属性
export function getSkuAttr (categoryId) {
  return `/omfagateway/v1/catalogs/catalogs/v1/catalogSkuAttr/${categoryId}`
}
// post 新增类目属性
export function addAttr (params) {
  return [`/omfagateway/v1/catalogs/catalogs/v1/catalogAttr`, params]
}
// put 修改类目属性
export function editAttr (params) {
  return [`/omfagateway/v1/catalogs/catalogs/v1/catalogAttr`, params]
}
// delet 删除类目属性
export function deleteAttr (attrId) {
  return `/omfagateway/v1/catalogs/catalogs/v1/catalogAttr/${attrId}`
}
// post 新增类目属性值
export function addAttrValue (params) {
  return [`/omfagateway/v1/catalogs/catalogs/v1/catalogAttrValue`, params]
}
// delete 删除类目属性值
export function deleteAttrValue (attrValueId) {
  return `/omfagateway/v1/catalogs/catalogs/v1/catalogAttrValue/${attrValueId}`
}
// get 展示通用类目属性
export function getCommonAttr (categoryId) {
  return `/omfagateway/v1/catalogs/catalogs/v1/catalogCommonAttr/${categoryId}`
}
