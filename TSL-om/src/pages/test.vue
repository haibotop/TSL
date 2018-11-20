<style scoped>
.my-card {
  width: 400px;
  position: absolute;
  top: 40px;
  right: 40px;
}
.pin-input {
  width: 50%;
}
.pin-img {
  float: right;
  width: 40%;
  height: 40px;
  margin-top: -3px;
  border: 1px solid #dddee1;
}
.pin-img img {
  display: block;
  height: 100%;
  width: 100%;
  cursor: pointer;
}
.newPw-a {
  float: right;
}
</style>
<template>
  <div id="test">
    <ueditor :id="ueditor.id" :letue="ueditor.letue" :config="ueditor.config" ref="ueditor"></ueditor>
    <testBing id="bing"></testBing>
    <Button @click="export2Excel">导出excel</Button>
    <Button @click="uploadFile">导入excel</Button>
    <input id="upload" type="file" @change="importfxx(this)"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
  </div>
</template>
<script type="text/ecmascript-6">
import ueditor from '../components/ueditor.vue'
import testBing from '../components/charts/testBing'
export default {
  name: 'test',
  components: {
    ueditor,
    testBing
  },
  data () {
    return {
      ueditor: {
        id: 'ueditor',
        letue: '编辑器默认文字',
        config: {
          autoHeightEnabled: true,
          autoFloatEnabled: true,
          initialFrameWidth: 600,
          initialFrameHeight: 150
        }
      }
    }
  },
  methods: {
    export2Excel () {
      require.ensure([], () => {
        const { export_json_to_excel } = require('../vendor/Export2Excel.js')
        const tHeader = ['序号', 'IMSI', 'MSISDN', '证件号码', '姓名']
        const filterlet = ['ID', 'imsi', 'msisdn', 'address', 'name']
        const list = [{ID: 133132, imsi: 'imsi', msisdn: 'msisdn', address: 'address', name: 'name'}]
        const data = this.formatJson(filterlet, list)
        export_json_to_excel(tHeader, data, '列表excel')
      })
    },
    formatJson (filterlet, jsonData) {
      return jsonData.map(v => filterlet.map(j => v[j]))
    },
    uploadFile () {
      document.getElementById('upload').click()
    },
    importfxx (obj) {
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
        }
        reader.readAsArrayBuffer(f)
      }
      if (rABS) {
        reader.readAsArrayBuffer(f)
      } else {
        reader.readAsBinaryString(f)
      }
    },
    fixdata (data) { // 文件流转BinaryString
      let o = ''
      let l = 0
      let w = 10240
      for (; l < data.byteLength / w; ++l) {
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
      }
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
      return o
    }
  }
}
</script>
