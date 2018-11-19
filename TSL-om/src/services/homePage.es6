// get 获取页面分类列表
export function getClassify () {
  return ['/index/homePage/v1/classify']
}
// post 新增页面分类
export function postClassify (params) {
  return ['/index/homePage/v1/classify', params]
}
// put 修改页面分类 {"id":"","name":"分类一","memo":"备注"}
export function putClassify (params) {
  return ['/index/homePage/v1/classify', params]
}
// delete 删除页面分类
export function deleteClassify (classifyId) {
  return [`/index/homePage/v1/classify/${classifyId}`]
}
// get 页面列表
export function getTemplates () {
  return ['/index/homePage/v1/template']
}
// get 获取页面模板
export function getTemplate (templateId) {
  return [`/index/homePage/v1/template/${templateId}`]
}
// put 编辑页面模板
export function putTemplate (template) {
  return [`/index/homePage/v1/template`, template]
}
// post 新增页面模板
export function postTemplate (template) {
  return [`/index/homePage/v1/template`, template]
}
// post 新增并发布模板
export function postTemplateIssue (template) {
  return [`/index/homePage/v1/templateIssue`, template]
}
// post 发布页面模板
export function postTemplate2 (templateId) {
  return [`/index/homePage/v1/template/${templateId}`]
}
// delete 删除页面模板
export function deleteTemplate (templateId) {
  return [`/index/homePage/v1/template/${templateId}`]
}
// post 设为首页
export function postHome (templateId) {
  return [`/index/homePage/v1/home/${templateId}`]
}
