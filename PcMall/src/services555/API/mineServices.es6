// GET productCollect 会员获取商品收藏列表
export function getProductCollect (params) {
  return [`customer/customer/v1/productCollect?pageNum=${params.pageNum}&pageSize=${params.pageSize}`]
}
// GET 会员获取有货商品收藏列表
export function getProductCollectHasStock (params) {
  return [`customer/customer/v1/productCollectHasStock?pageNum=${params.pageNum}&pageSize=${params.pageSize}`]
}
// POST 会员批量删除商品收藏 ['','','']
export function deleteProductCollects (collectIds) {
  return [`customer/customer/v1/productCollects`, collectIds]
}
// DELETE 会员删除商品收藏
export function deleteProductCollect (collectId) {
  return [`customer/customer/v1/productCollect/${collectId}`]
}
// DELETE 退出登录
export function logout () {
  return [`auth/session`]
}
// PUT 个人信息-修改昵称
export function updateNickName (nickname) {
  return [`customer/customer/v1/updateNikeName/${nickname}`]
}
// PUT 个人信息-设置性别 {sex: this.sex, phone: this.mobile}
export function updateSex (params) {
  return ['customer/customer/v1/updateSex', params]
}
// GET 确认当前密码
export function checkPw (pw) {
  return [`customer/customer/v1/${pw}/check`]
}
// PUT 修改密码 {phone: '', newPwd: ''}
export function updatePw (params) {
  return ['/member/updatePwd', params]
}
// PUT 修改头像
export function updateHeadPortrait (portraitUrl) {
  return [`/customer/customer/v1/memberHeadPortraitUrl?portraitUrl=${portraitUrl}`]
}
// ------------地址管理----------------

// POST 用户添加新增收货地址
export function postshippingAddress (params) {
  return [
    `customer/customer/v1/shippingAddress/`,
    params
  ]
}
// GET 用户所有的收货地址查询
export function getshippingAddress (memberId) {
  return `customer/customer/v1/shippingAddress/${memberId}`
}
// GET 查询默认地址
export function getdefaultShippingAddress (memberId) {
  return `customer/customer/v1/defaultShippingAddress/${memberId}`
}
// DELETE 用户删除收货地址
export function deleteshippingAddress (addressId) {
  return `customer/customer/v1/shippingAddress/${addressId}`
}
// PUT 修改用户地址
export function putshippingAddress (params) {
  return [`customer/customer/v1/shippingAddress/`, params]
}
// GET 查询门店地址
export function selfLiftingAddress () {
  return `customer/customer/v1/selfLiftingAddress`
}
