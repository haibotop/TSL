// 普通用户登录
export function login (params) {
  return [`auth/session/`, params]
}
// tsl登录
export function loginTsl (params) {
  return [`auth/loginByTSL?code=${params}`]
}
// 跳到授权操作
export function getAuthUrl (redireUrl) {
  return `auth/getAuthUrl?redirectUrl=${redireUrl}`
}
// 获得用户信息
export function getUserInfo () {
  return `auth/session/`
}
// 退出
export function logout () {
  return `auth/session`
}
// GET 注册-发送手机号
export function phone (phone) {
  return `/member/checkPhone/${phone}`
}
// 注册-获取验证码
export function getPin (phone) {
  return `/member/getVerificationCode/${phone}`
}
// 注册-发送验证码
export function submitPin (params) {
  return `/member/verification/${params}`
}
// 注册
export function regist (params) {
  return ['/member/regist', params]
}
// 个人信息-设置性别 PUT
export function updateSex (params) {
  return ['customer/customer/v1/updateSex', params]
}
// 找回密码-更新密码 PUT
export function updatePwd (params) {
  return ['/member/updatePwd', params]
}
// 个人信息-修改昵称 PUT
export function updateNickName (params) {
  return `customer/customer/v1/updateNikeName/${params}`
}
// 个人信息-修改/绑定手机号 PUT
export function updateMobile (params) {
  return `customer/customer/v1/updateMobile/${params}`
}
// 个人信息-修改基础信息 PUT
export function update (params) {
  return [
    'customer/customer/v1/update',
    params
  ]
}
// 个人信息-设置-账户安全-检查密码 GET /customer/{password}/check 验证密码是否正确
export function checkPwd (pwd) {
  return `customer/customer/v1/${pwd}/check`
}
