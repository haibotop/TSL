// get 展示运营类目
export function getCate () {
  return `/catalogs/catalogs/v1/list`
}
// post 新增运营类目
export function addCate (params) {
  return [`/catalogs/catalogs/v1/catalog`, params]
}
// put 编辑运营类目
export function editCate (params) {
  return [`/catalogs/catalogs/v1/catalog`, params]
}
// delete 删除运营类目
export function deleteCate (categoryId) {
  return `/catalogs/catalogs/v1/catalog/${categoryId}`
}
// put 停用运营类目
export function offCate (categoryId) {
  return `/catalogs/catalogs/v1/catalog/${categoryId}`
}
// post 启用运营类目
export function onCate (categoryId) {
  return `/catalogs/catalogs/v1/catalog/${categoryId}`
}
// get 展示SKU类目属性
export function getSkuAttr (categoryId) {
  return `/catalogs/catalogs/v1/catalogSkuAttr/${categoryId}`
}
// post 新增类目属性
export function addAttr (params) {
  return [`/catalogs/catalogs/v1/catalogAttr`, params]
}
// put 修改类目属性
export function editAttr (params) {
  return [`/catalogs/catalogs/v1/catalogAttr`, params]
}
// delet 删除类目属性
export function deleteAttr (attrId) {
  return `/catalogs/catalogs/v1/catalogAttr/${attrId}`
}
// post 新增类目属性值
// {name: ['String'], productCategoryAttrId: ''}
export function addAttrValue (params) {
  return [`/catalogs/catalogs/v1/catalogAttrValue`, params]
}
// delete 删除类目属性值
export function deleteAttrValue (attrValueId) {
  return `/catalogs/catalogs/v1/catalogAttrValue/${attrValueId}`
}
// get 展示通用类目属性
export function getCommonAttr (categoryId) {
  return `/catalogs/catalogs/v1/catalogCommonAttr/${categoryId}`
}

// post 类目关联商品
export function postCategoryProduct (params) {
  return [
    `/catalogs/catalogs/v1/categoryProduct`,
    params
  ]
}
// get 获取已关联商品spuId
export function getCategoryProduct (showCategoryId) {
  return `/catalogs/catalogs/v1/categoryProduct/${showCategoryId}`
}
// get 类目关联商品列表展示
export function getCategoryProductList (showCategoryId, pageNum, pageSize) {
  return `/catalogs/catalogs/v1/categoryProductList/${showCategoryId}?pageNum=${pageNum}&pageSize=${pageSize}`
}
// get 获取关联商品的spuIds
export function getSpuIds (categoryId) {
  return `/catalogs/catalogs/v1/categoryProduct/${categoryId}`
}
// del 删除关联商品
export function delCategoryProduct (params) {
  return [
    `/catalogs/catalogs/v1/categoryProductDelete`,
    params
  ]
}
