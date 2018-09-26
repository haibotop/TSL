// import { dateFormat } from 'vux'
// 处理价格 返回 00.00
export function handlePrice (price) {
  // if (!/^[0-9^\.]*$/.test(price)) {
  //   return 0
  // }
  if (price / 100 < 1) {
    return price / 100
  } else {
    return price % 100 === 0 ? `${parseInt(price / 100)}.00` : (price % 10 === 0 ? `${price / 100}0` : (price / 100).toFixed(2))
  }
}
// 处理商品名称
export function handleName (name) {
  if (!name) {
    return ''
  }
  if (/^WeightOfGold&IsOnly1$/.test(name)) {
    return '重量(g)'
  }
  if (name.indexOf('WeightOfGold&IsOnly1:') === -1) {
    return name
  } else {
    let g = ''
    for (let i of name.split(' ')) {
      if (i.indexOf('WeightOfGold&IsOnly1:') !== -1) {
        g = i.replace('WeightOfGold&IsOnly1:', '') + 'g'
      }
    }
    return name.replace(/WeightOfGold&IsOnly1:[0-9 | .]+/g, g)
  }
}
// 处理时间
// export function handleDate (param) {
//   let date = param
//   if (/^[0-9]+$/.test(param)) { date = parseInt(param) }
//   return dateFormat(new Date(date), 'YYYY-MM-DD HH:mm:ss')
// }
// import * as cartAPI from '@/services/API/shoppingCartServices.es6'
// // 合并预购物车到购物车(若存在)
// export function preCartToCart (this_, callback) {
//   if (localStorage.getItem('cartProductItems')) {
//     let productItems = JSON.parse(localStorage.getItem('cartProductItems'))
//     let params = []
//     for (let i of productItems) {
//       let product = {
//         'merchantId': '123',
//         'productId': i.id,
//         'productItemId': null,
//         'quantity': i.amount
//       }
//       params.push(product)
//     }
//     if (params.length > 0) {
//       this_.$http.post(...cartAPI.visitorCartItem(params)).then(res => {
//         if (res.data.code === 200) {
//           if (this_.$route.path === 'shoppingCart') {
//             this_.$vux.toast.show({text: '预购物袋合并成功', type: 'text', width: '200px'})
//           }
//           if (typeof callback === 'function') {
//             callback()
//           }
//         } else if (res.data.code === 1007) {
//           if (this_.$route.path === 'shoppingCart') {
//             this_.$vux.toast.show({text: '购买数量超过库存', type: 'text', width: '200px'})
//           }
//           sessionStorage.removeItem('settlementProductItems')
//           callback()
//         } else if (res.data.code === 1008) {
//           if (this_.$route.path === 'shoppingCart') {
//             this_.$vux.toast.show({text: '商品不可用', type: 'text', width: '200px'})
//           }
//           sessionStorage.removeItem('settlementProductItems')
//           callback()
//         } else {
//           if (this_.$route.path === 'shoppingCart') {
//             this_.$vux.toast.show({text: '预购物袋合并失败', type: 'text', width: '200px'})
//           }
//           sessionStorage.removeItem('settlementProductItems')
//           callback()
//         }
//         localStorage.removeItem('cartProductItems')
//       })
//     }
//   } else {
//     if (typeof callback === 'function') {
//       callback()
//     }
//   }
// }
// 返回是否在线状态 true为在线,false为离线
export function isOnline () {
  if (navigator.onLine) {
    return true
  } else {
    return false
  }
}
// 判断密码
export function checkPw (pw) {
  if (pw === '') {
    return false
  }
  return /^[0-9 | A-z]+$/.test(pw) && !/[' ']+/.test(pw) && pw.length >= 6 && pw.length <= 16
}
// 是否ios系统
export function isIOS () {
  let ua = navigator.userAgent.toLowerCase()
  if (/iphone|ipad|ipod/.test(ua)) {
    return true
  } else {
    return false
  }
}
