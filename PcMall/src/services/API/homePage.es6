// GET 首页模板
export function getHome () {
  return [`index/homePage/v1/home`]
}
// GET 展示类目
export function showList () {
  return [`catalogs/catalogs/v1/showList`]
}
// GET 页面模板
export function getTemplate (templateId) {
  return [`index/homePage/v1/template/${templateId}`]
}
