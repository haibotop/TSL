<style scoped>
  .my-breadcrumb {
    margin: 0px 10px;
  }
  .search {
    margin-top: 10px;
  }
  .search .my-label {
    margin-left: 10px;
  }
  .search .ivu-select {
    width: 50%;
    margin-left: 10px;
  }
  .search button {
    margin-left: 10px;
  }
  .cates {
    height: 350px;
    margin: 10px;
    background-color: #F8F8F9;
    border-radius: 6px;
  }
  .cates .ivu-col {
    height: 100%;
  }
  .cate1, .cate2, .cate3 {
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    margin: 10px;
    overflow: scroll;
    overflow-x:hidden
  }
  .cates .ivu-radio-wrapper-checked {
    color: #2d8cf0;
  }
  .cates .ivu-radio-group-item:after {
    content: "\F125";
    display: block;
    position: absolute;
    right: 0px;
    top: 0px;
    font-family: Ionicons;
  }
  .btn-bar {
    text-align: center;
  }
  .btn-bar span {
    position: absolute;
    line-height: 32px;
    margin-left: 20px;
  }
</style>
<style>
  #selectCate .cates .ivu-radio {
    display: none;
  }
</style>
<template>
  <div id="selectCate">
    <Breadcrumb class="my-breadcrumb">
      <BreadcrumbItem>商品管理</BreadcrumbItem>
      <BreadcrumbItem>发布新商品</BreadcrumbItem>
      <BreadcrumbItem>选择类目</BreadcrumbItem>
    </Breadcrumb>
    <div class="search">
      <label for="" class="my-label">类目搜索：</label>
      <AutoComplete v-model="selectedPath" @on-search="handleSearch" icon="ios-search" clearable @on-select="onSelect" ref="search">
        <Option v-for="(item, index) in cateSearchTips" :key="index" :value="item.path"></Option>
      </AutoComplete>
      <Button @click="searchBtn" :loading="searching">搜索</Button>
      <div class="cates">
        <Row>
          <Col span="8">
          <RadioGroup v-model="cate1" vertical class="cate1">
            <Radio v-for="(item, index) in cateData" :key="index" :label="JSON.stringify(item)">{{item.name}}</Radio>
          </RadioGroup>
          </Col>
          <Col span="8">
          <RadioGroup v-model="cate2" vertical class="cate1">
            <Radio v-for="(item, index) in cate1_Obj.secondCategory" :key="index" :label="JSON.stringify(item)">{{item.name}}</Radio>
          </RadioGroup>
          </Col>
          <Col span="8">
          <RadioGroup v-model="cate3" vertical class="cate1">
            <Radio v-for="(item, index) in cate2_Obj.threeCategory" :key="index" :label="JSON.stringify(item)">{{item.name}}</Radio>
          </RadioGroup>
          </Col>
        </Row>
      </div>
      <div class="btn-bar">
        <Button @click="addProduct" :disabled="cate3.length === 0">发布商品</Button>
        <span>请谨慎选择类目信息，商品一旦发布，类目信息不可修改！</span>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as cateAPI from '../../../services/operationCate.es6'
  export default {
    name: 'selectCate',
    data () {
      return {
        cateSearchData: [],
        cateSearchTips: [],
        selectedPath: '',
        selectedId: '',
        searching: false,
        cateData: [],
        cate1: '',
        cate2: '',
        cate3: '',
        cate1_Obj: {},
        cate2_Obj: {},
        cate3_Obj: {}
      }
    },
    mounted: function () {
      this.getCate()
    },
    methods: {
      isEmpty (val) {
        if (!/^['']*$/.test(val) && !/^[' ']+$/.test(val)) {
          return false
        } else {
          return true
        }
      },
      getCate (callback) {
        this.$http.get(cateAPI.getCate()).then((response) => {
          if (response.data.code === 200) {
            this.cateData = response.data.operateCategory
            if (typeof callback === 'function') {
              callback(response)
            }
          }
        })
      },
      handleSearch (val) {
        if (this.isEmpty(val)) {
          this.getCate(() => {
            this.cate1 = ''
            this.cate2 = ''
            this.cate3 = ''
          })
          this.cateSearchTips = []
          this.selectedId = ''
        } else {
          let arr = []
          for (let i of this.cateSearchData) {
            if (i.path.indexOf(val) !== -1) {
              arr.push(i)
            }
          }
          this.cateSearchTips = arr
        }
      },
      onSelect (val) {
        this.cateData = []
        this.getCate(() => {
          let id = ''
          for (let i of this.cateSearchTips) {
            if (i.path === val) {
              this.selectedId = i.id
              id = i.id
            }
          }
          for (let i of this.cateData) {
            if (id === i.id) {
              this.cate1 = JSON.stringify(i)
            } else {
              for (let j of i.secondCategory) {
                if (id === j.id) {
                  this.cate1 = JSON.stringify(i)
                  this.cate2 = JSON.stringify(j)
                } else {
                  for (let k of j.threeCategory) {
                    if (id === k.id) {
                      this.cate1 = JSON.stringify(i)
                      this.cate2 = JSON.stringify(j)
                      this.cate3 = JSON.stringify(k)
                    }
                  }
                }
              }
            }
          }
        })
      },
      searchBtn () {
        if (this.isEmpty(this.selectedPath)) {
          return
        }
        if (this.isEmpty(this.selectedId)) {
          this.searching = true
          let arr = []
          for (let i of this.cateSearchData) {
            if (i.path.indexOf(this.selectedPath) !== -1) {
              arr.push(i.id)
            }
          }
          let cateData = []
          let cateData1 = []
          for (let id of arr) {
            for (let i of this.cateData) {
              if (id === i.id) {
                cateData1.push(i)
              } else {
                for (let j of i.secondCategory) {
                  if (id === j.id) {
                    cateData1.push(i)
                  } else {
                    for (let k of j.threeCategory) {
                      if (id === k.id) {
                        cateData1.push(i)
                      }
                    }
                  }
                }
              }
            }
          }
          for (let i of cateData1) {
            if (cateData.length === 0) {
              cateData.push(i)
            } else {
              if (JSON.stringify(cateData).indexOf(JSON.stringify(i)) === -1) {
                cateData.push(i)
              }
            }
          }
          this.cateData = cateData
          this.cate1 = ''
          this.cate2 = ''
          this.cate3 = ''
          this.searching = false
        }
      },
      addProduct () {
        this.$parent.page = 'addProduct'
        if (this.cate3) {
          this.$parent.currCate = {
            path: this.selectedPath,
            cate3: JSON.parse(this.cate3)
          }
        }
      }
    },
    computed: {
      cateDataStr () {
        return JSON.stringify(this.cateData)
      },
      path () {
        if (this.cate1) {
          if (this.cate2) {
            if (this.cate3) {
              return `${JSON.parse(this.cate1).name}>>${JSON.parse(this.cate2).name}>>${JSON.parse(this.cate3).name}`
            } else {
              return `${JSON.parse(this.cate1).name}>>${JSON.parse(this.cate2).name}`
            }
          } else {
            return JSON.parse(this.cate1).name
          }
        }
      }
    },
    watch: {
      selectedPath (newV, oldV) {
        if (this.selectedId) {
          if (newV !== oldV) {
            this.selectedId = ''
          }
        }
      },
      cate1 (newV, oldV) {
        if (this.isEmpty(newV)) {
          this.cate1_Obj = {}
        } else {
          this.cate1_Obj = JSON.parse(newV)
          if (!this.isEmpty(this.cate2)) {
            if (JSON.parse(this.cate1).id !== JSON.parse(this.cate2).parentId) {
              this.cate2 = ''
              this.cate3 = ''
            }
          }
        }
      },
      cate2 (val) {
        if (this.isEmpty(val)) {
          this.cate2_Obj = {}
        } else {
          this.cate2_Obj = JSON.parse(val)
          if (!this.isEmpty(this.cate3)) {
            if (JSON.parse(this.cate2).id !== JSON.parse(this.cate3).parentId) {
              this.cate3 = ''
            }
          }
        }
      },
      cate3 (val) {
        if (this.isEmpty(val)) {
          this.cate3_Obj = {}
        } else {
          this.cate3_Obj = JSON.parse(val)
        }
      },
      cateDataStr (val) {
        let cateData = JSON.parse(val)
        //
        if (cateData.length === []) {
        }
        // 搜索关联项数据
        this.cateSearchData = []
        if (cateData.length > 0) {
          for (let i of cateData) {
            if (i.secondCategory.length > 0) {
              for (let j of i.secondCategory) {
                if (j.threeCategory.length > 0) {
                  for (let k of j.threeCategory) {
                    this.cateSearchData.push({ path: `${i.name}>>${j.name}>>${k.name}`, id: k.id })
                  }
                } else {
                  this.cateSearchData.push({ path: `${i.name}>>${j.name}`, id: j.id })
                }
              }
            } else {
              this.cateSearchData.push({ path: i.name, id: i.id })
            }
          }
        }
      },
      path (newV, oldV) {
        if (newV !== oldV) {
          this.selectedPath = newV
//          this.selectedId = JSON.parse(this.cate3).id
        }
      }
    }
  }
</script>
