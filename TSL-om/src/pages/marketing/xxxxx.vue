<script>
{
  "categoryIds": [
    {
      "categoryId": "string"//优惠券绑定类目---------------------------------------------------
    }
  ],
  "endDate": "2018-11-16T08:45:44.768Z",//结束时---------------------------------------------------
  "fullSubtract": 0,//满额 --------------------------------
  "isOverlay": 0,//"能否叠加使用：1不能、2能"
  "limitGet": 0,//限领张数
  "memo": "string",//促销描述---------------------------------------------------
  "name": "string",//优惠券名称---------------------------------------------------
  "productIds": [
    {
      "productId": "string"//优惠券绑定商品---------------------------------------------------
    }
  ],
  "rules": 0,//优惠规则：1满减、2直---------------------------------------------------
  "startDate": "2018-11-16T08:45:44.768Z",//开始时---------------------------------------------------
  "subtract": 0//,减多少
  "total": 0,//生成张数
  "type": 0//类型---------------------------------------------------
}

//sOverlay
{
  "categoryIds": [
    {
      "id": "string"//类目id---------------------------------------------------相当于categoryId\\\\\\
    }
  ],
  "circleTimes": 0,//折扣码可使用次数 ---------------相当于limitGet\\\\
  "discountAmount": 0,//优惠金额--------------------------------subtract\\\\\\
  "discountcodePieceLists": [
    {
      "discountRatio": 0,//多少折，示例：88折 ,
      "minQuantity": 0,//满额，单位：分
    }
  ],
  "endDate": "2018-11-16T08:45:44.778Z",//结束时间 ,---------------------------------------------------
  "exclusived": 0,//能否与其他折扣码叠加使用：1不能、2能 ,   ------------相当于sOverlay\\\\\\
  "memo": "string",//描述 ,---------------------------------------------------
  "minExpense": 0,//满减最低消费额度 , --------------------------------相当于fullSubtract\\\\\\\\
  "name": "string",//折扣码名称 ,---------------------------------------------------
  "productIds": [
    {
      "id": "string"//商品id---------------------------------------------------
    }
  ],
  "rules": 0,//规则 ,---------------------------------------------------
  "starDate": "2018-11-16T08:45:44.778Z",//开始时间 ---------------------------------------------------
  "type": 0 //类型：1单品2类目---------------------------------------------------
}
</script>





<template>
    <Form ref="formDynamic" :model="formDynamic" :label-width="80" style="width: 300px">
        <FormItem
                v-for="(item, index) in formDynamic.items"
                v-if="item.status"
                :key="index"
                :label="'Item ' + item.index"
                :prop="'items.' + index + '.value'"
                :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}">
            <Row>
                <Col span="18">
                    <Input type="text" v-model="item.value" placeholder="Enter something..."></Input>
                </Col>
                <Col span="4" offset="1">
                    <Button @click="handleRemove(index)">Delete</Button>
                </Col>
            </Row>
        </FormItem>
        <FormItem>
            <Row>
                <Col span="12">
                    <Button type="dashed" long @click="handleAdd" icon="md-add">Add item</Button>
                </Col>
            </Row>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formDynamic')">Submit</Button>
            <Button @click="handleReset('formDynamic')" style="margin-left: 8px">Reset</Button>
        </FormItem>
    </Form>
</template>
<script>
    export default {
        data () {
            return {
                index: 1,
                formDynamic: {
                    items: [
                        {
                            value: '',
                            index: 1,
                            status: 1
                        }
                    ]
                }
            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            handleAdd () {
                this.index++;
                this.formDynamic.items.push({
                    value: '',
                    index: this.index,
                    status: 1
                });
            },
            handleRemove (index) {
                this.formDynamic.items[index].status = 0;
            }
        }
    }





DiscountCodeParamInnerss {
discountCodeParamInnerss (DiscountCodeParamInner, optional),
id (string, optional)
}
DiscountCodeParamInner {
categoryIds (Array[DiscountCodeParamInnerCategoryId], optional),
circleTimes (integer, optional): 折扣码可使用次数 ,
discountAmount (integer, optional): 优惠金额 ,
discountcodePieceLists (Array[DiscountcodePiece], optional),
endDate (string, optional): 结束时间 ,
exclusived (integer, optional): 能否与其他折扣码叠加使用：1不能、2能 ,
memo (string, optional): 描述 ,
minExpense (integer, optional): 满减最低消费额度 ,
name (string, optional): 折扣码名称 ,
productIds (Array[DiscountCodeParamInnerProductId], optional),
rules (integer, optional): 规则 ,
starDate (string, optional): 开始时间 ,
type (integer, optional): 类型：1单品2类目
}
DiscountCodeParamInnerCategoryId {
id (string, optional): 类目id
}
DiscountcodePiece {
discountRatio (number, optional): 多少折，示例：88折 ,
minQuantity (integer, optional): 满额，单位：分
}
DiscountCodeParamInnerProductId {
id (string, optional): 商品id
}


DiscountCodeParamInner {
categoryIds (Array[DiscountCodeParamInnerCategoryId], optional),
circleTimes (integer, optional): 折扣码可使用次数 ,
discountAmount (integer, optional): 优惠金额 ,
discountcodePieceLists (Array[DiscountcodePiece], optional),
endDate (string, optional): 结束时间 ,
exclusived (integer, optional): 能否与其他折扣码叠加使用：1不能、2能 ,
memo (string, optional): 描述 ,
minExpense (integer, optional): 满减最低消费额度 ,
name (string, optional): 折扣码名称 ,
productIds (Array[DiscountCodeParamInnerProductId], optional),
rules (integer, optional): 规则 ,
starDate (string, optional): 开始时间 ,
type (integer, optional): 类型：1单品2类目
}
DiscountCodeParamInnerCategoryId {
id (string, optional): 类目id
}
DiscountcodePiece {
discountRatio (number, optional): 多少折，示例：88折 ,
minQuantity (integer, optional): 满额，单位：分
}
DiscountCodeParamInnerProductId {
id (string, optional): 商品id
}





{
  "discountCodeParamInner": {
    "categoryIds": [
      {
        "id": "string"
      }
    ],
    "circleTimes": 11,
    "discountAmount": 0,
    "discountcodePieceLists": [
             {
        "discountRatio": 90,
        "minQuantity": 1
      }
    ],
    "endDate": "2018-12-31 00:00:00:00",
    "exclusived": 2,
    "memo": "邹磊 专属45454545",
    "minExpense": 0,
    "name": "邹磊 满件折",
    "productIds": [
      {
        "id": "117864464457826312"
      }
    ],
    "rules": 3,
    "starDate": "2018-12-03 00:00:00:00",
    "type": 1
  },
  "id": "146764347627036672"
}

{   
"discountCodeParamInner": {
    "categoryIds": [
        {
            "id": "string"
        }
    ],
    "circleTimes": 11,
    "discountAmount": 0,
    "discountcodePieceLists": [
        {"minQuantity": 1, "discountRatio": 90}
    ],
    "endDate": "2018-12-31 00:00:00:00",
    "exclusived": 2,
    "memo": "邹磊 专属45454545",
    "minExpense": 0,
    "name": "邹磊 满件折",
    "productIds": [
        {"id": "117864464457826312"}
    ],
    "rules": 3,
    "starDate": "2018-12-03 00:00:00:00",
    "type": 1
},
"id":"146764347627036672"
}









</script>