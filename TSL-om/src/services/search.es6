// 商品搜索 post
// {"keyword":"kk","priceSort":2,"priceMin":1,"priceMax":3,"commentSort":1，"salesSort":2, "currentPage":1,"pageSize":10}
export function query (params) {
  return [`search/search/v1/query`, params]
}
// 分类商品搜索 post 例: {"catalogId":"56756577777778","price":2,"priceMin":1,"priceMax":3,"comment":1，"sales":333}
export function catelogQuery (params) {
  return [`search/search/v1/catelogQuery`, params]
}
