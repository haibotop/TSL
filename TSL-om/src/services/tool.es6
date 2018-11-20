// ----------将Excel解析成JSON
export function importfxx (obj, callback) {
  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxx1')
  // 通过DOM取文件数据
  this.file = event.currentTarget.files[0]
  let rABS = false // 是否将文件读取为二进制字符串
  let f = this.file
  let reader = new FileReader()
  // if (!FileReader.prototype.readAsBinaryString) {
  FileReader.prototype.readAsBinaryString = function (f) {
    let binary = ''
    let rABS = false // 是否将文件读取为二进制字符串
    let wb // 读取完成的数据
    let outdata
    let reader = new FileReader()
    reader.onload = (e) => {
      let bytes = new Uint8Array(reader.result)
      let length = bytes.byteLength
      for (let i = 0; i < length; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      let XLSX = require('xlsx')
      if (rABS) {
        wb = XLSX.read(btoa(this.fixdata(binary)), {
          // 手动转化
          type: 'base64'
        })
      } else {
        wb = XLSX.read(binary, {
          type: 'binary'
        })
      }
      outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) // outdata就是你想要的东西
      console.log(outdata)
      if (typeof callback === 'function') {
        callback(outdata)
      }
    }
    reader.readAsArrayBuffer(f)
  }
  if (rABS) {
    reader.readAsArrayBuffer(f)
  } else {
    reader.readAsBinaryString(f)
  }
}
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
export function handleSkuGroupName (name) {
  if (!name) {
    return ''
  }
  if (name.indexOf('WeightOfGold&IsOnly1:') === -1) {
    return name
  } else {
    let g = ''
    for (let i of name.split(',')) {
      if (i.indexOf('WeightOfGold&IsOnly1:') !== -1) {
        g = i.replace('WeightOfGold&IsOnly1:', '') + 'g'
      }
    }
    return name.replace(/WeightOfGold&IsOnly1:[0-9 | .]+/g, g)
  }
}
export function handlePrice (price, needZero) {
  if (!/^[0-9]*$/.test(price)) {
    return 0
  }
  if (price / 100 < 1) {
    return price / 100
  } else {
    if (needZero) {
      return price % 100 === 0 ? `${price / 100}.00` : price / 100
    } else {
      return price / 100
    }
  }
}
// 注意入参必须是一个对象，不可是一个对象的属性
export function formatDateTime (dateTime) {
  let date = dateTime
  console.log(date)
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  let d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  let h = date.getHours()
  h = h < 10 ? ('0' + h) : h
  let minute = date.getMinutes()
  let second = date.getSeconds()
  minute = minute < 10 ? ('0' + minute) : minute
  second = second < 10 ? ('0' + second) : second
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
}
export function positiveInt (value) {
  return /^[0-9]+$/.test(value)
}
// [1, 10)的数，可保留一位小数
export function validDiscountNum (value) {
  return /^[1-9]{1}[.][0-9]{1}$/.test(value) || /^[1-9]{1}$/.test(value)
}
// 非零正整数
export function non0PositiveInt (value) {
  return /^[1-9]{1}[0-9]*$/.test(value)
}

