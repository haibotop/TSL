// POST 商品搜索
// {"keyword":"kk", "currentPage":1, "pageSize":10, "sort": }
// sort 1：价格升序、2：价格降序、3:销量降序、4：评论数降序、5：时间降序
export function query (query) {
  if (query) {
    query.keyword = query.keyword.replace(/\s+/g, '')
  }
  return [`/search/search/v1/query`, query]
}
// POST 分类查询商品
// {"catalogId":"56756577777778", "currentPage":1, "pageSize":10, "sort": }
export function catelogQuery (query) {
  return [`/search/search/v1/catelogQuery`, query]
}
