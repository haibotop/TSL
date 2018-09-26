// ------------------购物车-----------
export function getcartItem (memberId, param) {
  return [
    `shoppingCart/shoppingCart/v1/cartItem/${memberId}`,
    param
  ]
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
// 查询购物车
export function getshoppingCart () {
  return `/member/shoppingCart/`
}
// 获取商品默认规格
export function getskuInfo (productId) {
  return `productDetail/productDetail/v1/skuInfo/${productId}`
}
// 获取购物车商品规格
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
// -----------订单页面--------------
// 填写订单页面
export function getSettleMent (params) {
  return [`settlement/settlement/v1/newstatements/`, params]
}
// 生成订单
export function postOrder () {
  return `settlement/settlement/v1/order`
}

// ------------地址管理----------------

// 用户添加新增收货地址
export function postshippingAddress (params) {
  return [
    `customer/customer/v1/shippingAddress/`,
    params
  ]
}
// 用户所有的收货地址查询
export function getshippingAddress (memberId) {
  return `customer/customer/v1/shippingAddress/${memberId}`
}
// 查询默认地址
export function getdefaultShippingAddress (memberId) {
  return `customer/customer/v1/defaultShippingAddress/${memberId}`
}
// 用户删除收货地址
export function deleteshippingAddress (addressId) {
  return `customer/customer/v1/shippingAddress/${addressId}`
}
// 修改用户地址
export function putshippingAddress (params) {
  return [`customer/customer/v1/shippingAddress/`, params]
}

// ---------------登录----------------

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
// 注册-发送手机号
export function phone (phone) {
  return `/member/checkPhone/${phone}`
}
// 注册-获取验证码
export function getPin () {
  return '/member/getVerificationCode'
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
// ----------------------------------------订单---------------------------------

// Paths /order/{orderNo} 订单查询
export function getOrder (orderNum) {
  return `myOrder/myOrder/v1/order/${orderNum}`
}
// GET /orderList/{status} 订单列表查询
export function getOrderList (status, pageSize = 15, pageNum = 1) {
  return `myOrder/myOrder/v1/orderList/${status}?pageSize=${pageSize}&pageNum=${pageNum}`
}
// GET /commentOrderList/0?pageSize=2&PageNum=1 待评价
export function getCommentOrderList (status, pageSize = 15, pageNum = 1) {
  return `myOrder/myOrder/v1/commentOrderList/${status}?pageSize=${pageSize}&pageNum=${pageNum}`
}
// delete /deleteOrder/{orderId} 若订单为已确认状态，修改订单为已撤单状态。
export function deleteOrder (orderNum) {
  return `myOrder/myOrder/v1/deleteOrder/${orderNum}`
}
// post /paymentAdvice/{orderNum} 当支付模块获取支付成功通知后，若订单为已确认状态，修改订单为已支付状态。
// post /paymentOrder/{orderNum} 若订单为已确认状态，调用支付模块发起支付。
// post /receivingNote/{orderNum} 若订单为已发货状态，修改订单为已收货状态。
export function receivingNote (orderNum) {
  return `myOrder/myOrder/v1/receivingNote/${orderNum}`
}
// ------------------------------------详情-------------------------
// GET /spuInfo/{spuId} 获取商品spu信息
export function skuInfo (productId) {
  return `productDetail/productDetail/v1/skuInfo/${productId}`
}
// GET /spuInfo/{spuId} 获取商品spu信息
export function spuInfo (spuId) {
  return `productDetail/productDetail/v1/spuInfo/${spuId}`
}
// POST /specGetSku 商品规格组合获得sku信息
export function specGetSku (params) {
  return [`productDetail/productDetail/v1/specGetSku`, params]
}
// POST /cartItem 添加商品项
export function cartItem (params) {
  return [`shoppingCart/shoppingCart/v1/cartItem`, params]
}
// GET /cartItem/{memberId} 查询购物车商品项
export function getCartItem (memberId) {
  return `shoppingCart/shoppingCart/v1/cartItem/${memberId}`
}
// GET /merchant/{id} 商家信息查询
export function merchantInfo (merchantId) {
  return `merchant/merchant/v1/merchant/${merchantId}`
}
// --------------------------首页--------------------------
export function getHomePage () {
  return `homepage`
}
// --------------------------支付--------------------------
export function alipay (params) {
  return [`payment/payment/v1/alipay`, params]
}
export function wxpay (params) {
  return [`payment/payment/v1/wxpay`, params]
}
export function getpayment (payNo) {
  return `payment/payment/v1/thirdPay/${payNo}`
}
export function paymentAdvice (params) {
  return [`union/unionpaycommerce/v1/paymentAdvice`, params]
}
export function commerceH5Msg (params) {
  return `union/unionpaycommerce/v1//commerceH5Msg/${params}`
}
