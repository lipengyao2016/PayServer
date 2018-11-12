
#Remark
1.目前所有的测试环境请求IP都是经过网关，所以统一走网关的主机和端口，并在URL前面加上payServer的前缀.

资源列表：

payModeTemplate(支付模板)

PayMode(支付模式)

Pay(支付业务)

Refund(退款业务)


#payModeTemplate:

payModeTemplate资源是指当前系统所有支持的支付方式。

目前系统内置的支付模式如下:

```
[
        {
            payTemplateId:'C924182F-581B-4990-944A-ABCAB8E552B3',
            name:'现金',
            checkEnvUrl:'',
            payUrl:'',
            description:'现金支付',
        },
        {
            payTemplateId:'4CE44A21-68DA-4ADA-B7EE-371187327F75',
            name:'银联',
            checkEnvUrl:'',
            payUrl:'',
            description:'银联支付',
        },
        {
            payTemplateId:'382CF8DF-017F-4009-928F-D5B008095962',
            name:'挂账',
            description:'挂账支付',
            checkEnvUrl:'',
            isSignAccount:1,
            isOnline:1,
            isAsyncNotify:0,
       },
       {
           payTemplateId:'017AFC80-95FA-11E8-B0EC-5384BC9767FE',
           name:'微信扫码枪',
           description:'微信扫码枪支付',
           checkEnvUrl:'',
           isSignAccount:0,
           isOnline:1,
           isAsyncNotify:0,
           payChannel:'微信',
           payWay:'扫码枪',
           isThridPay:1,
       },
       {
           payTemplateId:'3BEAF650-A067-11E8-A545-87065760276A',
           name:'支付宝扫码枪',
           description:'支付宝扫码枪支付',
           checkEnvUrl:'',
           isSignAccount:0,
           isOnline:1,
           isAsyncNotify:0,
           payChannel:'支付宝',
           payWay:'扫码枪',
           isThridPay:1,
       },
        {
               uuid:'irAl37TewwGEchYrXUWsfA',
               payTemplateId:'A2E7AB90-BB11-11E8-8BAF-4BFA221DACF5',
               name:'会员储值',
               description:'会员储值支付',
               checkEnvUrl:'',
               payUrl: ``,
               refundUrl: ``,
               isSignAccount:0,
               isOnline:1,
               isAsyncNotify:0,
               payChannel:'',
               payWay:'',
               isThridPay:0,
           },
           {
               uuid:'nW9WDIBHwMMLvz6oGsuRpQ',
               payTemplateId:'B3A36C30-BB11-11E8-8353-CD8987EBDA9C',
               name:'会员储次',
               description:'会员储次支付',
               checkEnvUrl:'',
               payUrl: ``,
               refundUrl: ``,
               isSignAccount:0,
               isOnline:1,
               isAsyncNotify:0,
               payChannel:'',
               payWay:'',
               isThridPay:0,
           },
]
```




###1.获取所有支付方式列表.

http://localhost:6009/api/v1.0.0/payModeTemplates

   
**http**

get

```

```


**response**


```
{
  "href": "http://192.168.7.6:6009/api/v1/payModeTemplates",
  "offset": 0,
  "limit": 2,
  "size": 2,
  "items": [
    {
      "href": "http://192.168.7.6:6009/api/v1.0.0/payModeTemplates/zDP19DCUpEl8qzNIkLwOjQ",
      "id": 12,
      "uuid": "zDP19DCUpEl8qzNIkLwOjQ",
      "name": "挂账",          //名称。
      "description": "挂账支付", //描述。
      "checkEnvUrl": "",
      "payUrl": "http://192.168.7.6:6008/api/v1.0.0/signAccount",     //支付请求URL.
      "refundUrl": "http://192.168.7.6:6008/api/v1.0.0/cancelAccount",//退款请求URL.
      "orderValidTime": 24,
      "isOnline": 0,   //是否线上，1为线上，0为线下。
      "isSignAccount": 1, //是否记账，1为记账，0为支付。
       "payTemplateId": "4CE44A21-68DA-4ADA-B7EE-371187327F75", //支付模板ID.
      "isAsyncNotify": 0,  //是否异步通知，1为是，0为否。
      "isThridPay": 0,     //是否第三方支付，1为是，0为否。
      "payChannel": null,  //支付通道，一般指第三方支付主体。
      "payWay": null,      //支付方式，扫码枪，APP支付等。
      "status": "enabled",
      "createdAt": "2018-07-11 15:53:45",
      "modifiedAt": "2018-07-11 15:53:45",
      "payModes": {
             "href": "http://192.168.7.6:6009/api/v1.0.0/payModeTemplates/zDP19DCUpEl8qzNIkLwOjQ/payModes"
           },
       "payOrders": {
         "href": "http://192.168.7.6:6009/api/v1.0.0/payModeTemplates/zDP19DCUpEl8qzNIkLwOjQ/payOrders"
       },
       "refundOrders": {
         "href": "http://192.168.7.6:6009/api/v1.0.0/payModeTemplates/zDP19DCUpEl8qzNIkLwOjQ/refundOrders"
       },
       "tradeRecords": {
         "href": "http://192.168.7.6:6009/api/v1.0.0/payModeTemplates/zDP19DCUpEl8qzNIkLwOjQ/tradeRecords"
       }
    },
  ]
}
```

###2.注册支付模板.

http://localhost:6009/api/v1.0.0/registerPayModeTemplate

不存在支付模板就创建，存在就更新。

**http**

post

```
{
        uuid:'rDdNnmkt97nSCiooVgJlvw',
        payTemplateId:'017AFC80-95FA-11E8-B0EC-5384BC9767FE',
        name:'微信扫码枪',
        description:'微信支付xx',
        checkEnvUrl:'',
        payUrl: '',
        refundUrl: '',
        isSignAccount:0,
        isOnline:1,
        isAsyncNotify:0,
        payChannel:'微信',
        payWay:'扫码枪',
        isThridPay:1,
}
```


**response**


```
{
      "uuid": "rDdNnmkt97nSCiooVgJlvw",
      "payTemplateId": "017AFC80-95FA-11E8-B0EC-5384BC9767FE",
      "name": "微信扫码枪",
      "description": "微信支付xx",
      "checkEnvUrl": "",
      "payUrl": "http://192.168.7.6:6103/api/v1.0.0/microPay?channel=wx",
      "refundUrl": "http://192.168.7.6:6103/api/v1.0.0/refund?channel=wx",
      "isSignAccount": 0,
      "isOnline": 1,
      "isAsyncNotify": 0,
      "payChannel": "微信",
      "payWay": "扫码枪",
      "isThridPay": 1,
      "modifiedAt": "2018-09-19 10:45:58",
      "id": 26,
      "orderValidTime": 24,
      "iconHref": null,
      "status": "enabled",
      "createdAt": "2018-09-19 10:41:43"
}
```



#PayMode:

PayMode资源是指当前商户门店开通的所有支付方式。

###1.获取当前商户所有开通的支付方式.

http://localhost:6009/api/v1.0.0/payModes


当不传商户者链接时，默认从JWT中获取店铺链接作为拥有者链接.
   
**http**

get

```
{
      merchantHref:"http://192.168.7.188:6004/api/v1.0.0/merchants/eLzwsgnlWpZN8xtvz0qgvw",
      orderBy:'uiOrder desc',
      isOpened:1  //已开通。
} 
```


**response**


```
{
  "href": "http://192.168.7.6:6009/api/v1/payModes?merchantUUID=mI2NDMoQRdnKCq01hAsLwQ&orderBy=uiOrder%20desc&expand=payMode",
  "offset": 0,
  "limit": 3,
  "size": 3,
  "items": [
    {
      "href": "http://192.168.7.6:6009/api/v1.0.0/payModes/bR5eANyeCgAOZkc7EvT5rg",
      "id": 6,
      "uuid": "bR5eANyeCgAOZkc7EvT5rg",
      "name": "会员卡记账支付",
      "description": null,
      "checkEnvUrl": null,
      "payUrl": null,
      "refundUrl": null,
      "iconHref": null,
      "payTemplateId": '4CE44A21-68DA-4ADA-B7EE-371187327F75',   //支付模板ID
      "orderValidTime": 24,
      "isOnline": 0,
      "isSignAccount": 0,
      "isAsyncNotify": 0,
      "isThridPay": 0,
      "payChannel": null,
      "payWay": null,
      "isFastPay": 1,
      "isOpened": 1,
      "uiOrder": 1,
      "merchantUUID": "mI2NDMoQRdnKCq01hAsLwQ",
      "createdAt": "2018-07-14 15:54:24",
      "modifiedAt": "2018-07-14 15:54:24",
      "merchant": {
        "href": "http://192.168.7.188:6005/api/v1.0.0/shops/mI2NDMoQRdnKCq01hAsLwQ"
      },
      "payOrders": {
        "href": "http://192.168.7.6:6009/api/v1.0.0/payModes/bR5eANyeCgAOZkc7EvT5rg/payOrders"
      },
      "refundOrders": {
        "href": "http://192.168.7.6:6009/api/v1.0.0/payModes/bR5eANyeCgAOZkc7EvT5rg/refundOrders"
      },
      "tradeRecords": {
        "href": "http://192.168.7.6:6009/api/v1.0.0/payModes/bR5eANyeCgAOZkc7EvT5rg/tradeRecords"
      }
    },
  ]
}
```


###2.为当前商户开通支付方式.

http://localhost:6009/api/v1.0.0/payModes


当不传商户者链接时，默认从JWT中获取店铺链接作为拥有者链接.

有两种方式来创建支付方式 :
 (1).从支付模板中生成支付方式。
 (2).全部自定义输入支付方式数据。

**http**

post

```
{
      merchantHref:"http://192.168.7.188:6004/api/v1.0.0/merchants/eLzwsgnlWpZN8xtvz0qgvw",
      payTemplateId:'4CE44A21-68DA-4ADA-B7EE-371187327F75',  //支付模板ID.
      isOpened:1,//是否开通。
      uiOrder:3, //排序号。
      isFastPay:1, //是否快捷支付。
}
```


**response**

成功时返回201：
```

{
      "href": "http://192.168.7.6:6009/api/v1.0.0/payModes/a1aFSm4ShJ3dIN9TdxCA3g",
      "id": 12,
      "uuid": "a1aFSm4ShJ3dIN9TdxCA3g",
      "name": "会员卡记账支付",    //名称。
      "description": null,  //描述。
      "checkEnvUrl": null, //检测环境URL.
      "payUrl": null,      //支付URL.
      "refundUrl": null,   //还款URL。
      "iconHref": null,    //图标链接。
      "orderValidTime": 24,//订单有效时间，单位为小时。
      "isOnline": 0,       //是否线上。1为线上，0为线下。
      "isSignAccount": 0,  //是否挂账，1为挂账，0为支付。
      "isAsyncNotify": 0,  //是否异步通知，1为异步，0为同步。
      "isThridPay": 0,     //是否第三方支付，1为是，0为否。
      "payChannel": null,  //支付渠道，如支付宝，微信等。
      "payWay": null,      //支付方式，如刷卡支付，扫描支付，APP支付。
      "isFastPay": 1,      //是否开通快捷支付，1为开通，0为关闭。
      "isOpened": 1,       //是否开启，1为开启，0为关闭。
      "uiOrder": 3,        //排序号。
      "merchantUUID": "eLzwsgnlWpZN8xtvz0qgvw",
      "payTemplateId": '4CE44A21-68DA-4ADA-B7EE-371187327F75',  //支付模板UUID.
      "createdAt": "2018-07-13 14:56:08",
      "modifiedAt": "2018-07-13 14:56:08",
      "merchant": {
        "href": "http://192.168.7.188:6004/api/v1.0.0/merchants/eLzwsgnlWpZN8xtvz0qgvw"
      },
      "payModeTemplate": {
        "href": null
      },
      "payOrders": {
        "href": "http://192.168.7.6:6009/api/v1.0.0/payModes/a1aFSm4ShJ3dIN9TdxCA3g/payOrders"
      },
      "refundOrders": {
        "href": "http://192.168.7.6:6009/api/v1.0.0/payModes/a1aFSm4ShJ3dIN9TdxCA3g/refundOrders"
      },
      "tradeRecords": {
        "href": "http://192.168.7.6:6009/api/v1.0.0/payModes/a1aFSm4ShJ3dIN9TdxCA3g/tradeRecords"
      }
},


```

失败时返回500,当某些支付模板需要依赖外部环境配置检测时，如果检测不通过，则返回9001的错误码code(如开通微信，支付宝支付时，如果还没有开通微信，支付宝的特约商户，则通知失败):

```
{
  "name": "create paymode error",
  "statusCode": 500,
  "code": 9001,
  "message": "PayModeBusiness->create open payTemplate error,check env failed payTemplateId:017AFC80-95FA-11E8-B0EC-5384BC9767FE,checkEnvRes:{\"ret\":false,\"merchantUUID\":\"87TaIejHrZp4aHaM9hG2DQ\"} ",
  "description": "PayModeBusiness->create open payTemplate error,check env failed payTemplateId:017AFC80-95FA-11E8-B0EC-5384BC9767FE,checkEnvRes:{\"ret\":false,\"merchantUUID\":\"87TaIejHrZp4aHaM9hG2DQ\"} ",
  "stack": "Error\n    at PayModeBusiness.create (E:\\WebServer\\Application\\source\\LaiKooSystem\\Pay\\PayServer\\business\\payModeBusiness.js:48:37)\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:188:7)"
}
```
###3.获取当前商户所有的支付方式以及公共库中还没有开通的支付方式.

http://localhost:6009/api/v1.0.0/listAllPayModes


当不传商户者UUID时，默认从JWT中获取店铺UUID作为拥有者链接.

**http**

get

```
{
      merchantUUID:"eLzwsgnlWpZN8xtvz0qgvw",
      orderBy:'uiOrder asc',
}
```


**response**


```
{
  "size": 4,
  "items": [
    {
      "uuid": "bBykiswrR3bFaneX1p2ayw",                 //实际支付模式的UUID,如果还没有创建时，则不存在此字段。
      "payTemplateId": "382CF8DF-017F-4009-928F-D5B008095962",  //支付模板的ID,可以为空。
      "merchantUUID": "mI2NDMoQRdnKCq01hAsLwQ",
      "name": "挂账",
      "description": "挂账支付",
      "orderValidTime": 24,
      "isOnline": 1,
      "isSignAccount": 1,
      "isAsyncNotify": 0,
      "isThridPay": 0,
      "payChannel": null,
      "payWay": null,
      "iconHref": null,
      "uiOrder": 3,
      "isOpened": 1,
      "isFastPay": 1,
      "hasCreated": 1    //是否已创建，1为已创建，0为未开通。
    },
    {
      "name": "银联",
      "description": "银联支付",
      "checkEnvUrl": "",
      "payUrl": null,
      "refundUrl": null,
      "orderValidTime": 24,
      "isOnline": 0,
      "isSignAccount": 0,
      "isAsyncNotify": 0,
      "isThridPay": 0,
      "payChannel": null,
      "payWay": null,
      "iconHref": null,
      "payTemplateId": "C924182F-581B-4990-944A-ABCAB8E552B3",
      "hasCreated": 0,
      "isOpened": 0,
      "isFastPay": 0
    }
  ]
}
```

#Pay:

Pay资源是指作线上的实际支付业务。

###1.发起线上支付.

http://localhost:6009/api/v1.0.0/pay


**注意事项**
支付返回的结果状态如果为paying(支付中)时，需要根据客户端支付流水号定时查询支付结果(建议10S超时查询)。
其它支付结果，则不用查询。


**http**

post

```
{
   payModeUUID:'zDP19DCUpEl8qzNIkLwOjQ',    //支付方式UUID.
   payer:'A',                               //付款方。
   payee:'http://192.168.7.188:6004/api/v1.0.0/shops/eLzwsgnlWpZN8xtvz0qgvw', //收款方。
   payAmount:50,  //付款金额，单位为分。

   clientPayNo:'201807120130',  //客户端支付流水号，必须唯一,可以用UUID生成。
   payParams:  //附带支付参数，如挂账主体，微信付款条形码等。
   {
      //*******************挂账支付的参数***************************//
       signAccounterUUID:'ega7hvZz0RBw8TQNFFZN2w',   //挂账主体UUID.
       signPersonUUID:'9oNEJPMAqmVivbk4hioNxQ'       //挂账人UUID.


      //*******************微信或者支付宝刷卡支付的参数***************************//
       "payBarCode": "134853566181206476",           //支付的付款条形码。

        //*******************会员卡金额支付的参数***************************//
         memberUUID: memberUUID,   //挂账主体UUID.

         //*******************会员卡次数支付的参数***************************//
         memberUUID: memberUUID,   //挂账主体UUID.
         merchandiseDetails: [ // 商品/项目明细
             {
                 name: '项目名称A',                        // 商品/项目名称
                 merchandiseUUID: 'merchandiseUUID-A', // 商品UUID
                 styleUUID: 'styleUUID-A',             // 款式UUID
                 count: 1,                               // 次数
             },
         ],

   },
   clientExtraParams:  //附带客户端的其它参数。
   {
       orderNo:'P201807050001',   //订单号。
       orderAmount:210,           //订单总金额，单位为分。
       receiveableAmount:210      //应收金额，单位为分。

       operatorName: '小美',         //操作人。
       operatorUUID: 'operatorUUID', //操作人UUID.
   },

}
```


**response**

成功时返回200
```
{
  "ret": "success",
  "businessRet": "syncOnlinePay",  //syncOnlinePay:同步线上支付，asyncOnlinePay:异步线上支付，offlinePay:线下支付。
  "data": //支付订单数据。
  {
    "uuid": "5Y9fZtPBu1yTvYkzTPPf8w",
    "payer": "A",
    "payee": "http://192.168.7.188:6004/api/v1.0.0/shops/eLzwsgnlWpZN8xtvz0qgvw",
    "payAmount": 50,
    "tractionNo": "1531367230400202",   //平台支付订单流水号，在退款时使用。
    "clientPayNo": "201807120130",
    "orderStartAt": "2018-07-12 11:47:10",   //支付单有效开始时间。
    "orderExpiredAt": "2018-07-13 11:47:10", //支付单过期时间。
    "payParams":
    {
      "signAccounterUUID": "ega7hvZz0RBw8TQNFFZN2w",
      "signPersonUUID": "9oNEJPMAqmVivbk4hioNxQ"
    },
    "thirdPayNo": null,  //第三方支付单号。
    "resultCode": null,  //第三方返回结果码。
    "payModeName": "挂账", //支付方式名称。
    "payStartAt": "2018-07-12 11:47:10", //支付开始时间。
    "payFinishAt": null, //支付完成时间。
    "refundAmount": 0,   //退款金额。
    "lastRefundAt": null,//最后退款时间。
    "status": "payed", //状态,unpay:未支付，payed:已支付，paying:支付中，payFailed:支付失败。refunded:全部退款,partRefunded:部分退款。
    "createdAt": "2018-07-12 11:47:10",
    "modifiedAt": "2018-07-12 11:47:10",
    "payModeUUID": "zDP19DCUpEl8qzNIkLwOjQ",
    "clientExtraParams": {
      "orderAmount": 210,
      "receiveableAmount": 210
    }
  }
}
```

失败时返回500,例如支付模式未开通时，返回9002的错误码。
```
{
  "name": " payMode  not opended",
  "statusCode": 500,
  "code": 9002,
  "message": "PayOrderBusiness->create payMode is not opened!!!",
  "description": "PayOrderBusiness->create payMode is not opened!!!",
  "stack": " payMode  not opended: PayOrderBusiness->create payMode is not opened!!!\n    at PayOrderBusiness.pay (E:\\WebServer\\Application\\source\\LaiKooSystem\\Pay\\PayServer\\business\\payOrderBusiness.js:222:25)\n    at <anonymous>"
}
```

###2.支付订单结果查询.

http://localhost:6009/api/v1.0.0/payOrders

**http**

get

```
{
    clientPayNo:'201808161002',,  //客户端支付流水号，必须唯一,可以用UUID生成。
}
```


**response**


```
{
  "href": "http://192.168.7.6:6009/api/v1/payOrders?clientPayNo=201808161002",
  "offset": 0,
  "limit": 1,
  "size": 1,
  "items": [
    //这里面的对象，同上面支付接口中的data.
    {
      "href": "http://192.168.7.6:6009/api/v1.0.0/payOrders/NHQGABZ2ZGWJlaGrx2Gmcw",
      "id": 11,
      "uuid": "NHQGABZ2ZGWJlaGrx2Gmcw",
      "payer": "A",
      "payee": "http://192.168.7.188:6005/api/v1.0.0/shops/82TaIejHrZp4aHaM9hG2DQ",
      "payAmount": 1,
      "tractionNo": "1534387324961682",   //平台支付订单流水号，在退款时使用。
      "clientPayNo": "201808161002",
      "orderStartAt": "2018-08-16 10:42:04",
      "orderExpiredAt": "2018-08-17 10:42:04",
      "thirdPayNo": "4200000162201808163428659816",
      "resultCode": "",
      "payModeName": "微信扫码枪",
      "payTemplateId": "017AFC80-95FA-11E8-B0EC-5384BC9767FE",
      "payChannel": "微信",
      "payWay": "扫码枪",
      "payStartAt": "2018-08-16 10:42:04",
      "payFinishAt": "2018-08-16 10:42:12",
      "refundAmount": 1,
      "lastRefundAt": "2018-08-16 11:02:57",
      "status": "refunded",   //支付状态，同上面支付接口返回的状态。
      "payModeUUID": "wf1YFe09Z8AcIA50hnHJHA",
      "createdAt": "2018-08-16 10:42:04",
      "modifiedAt": "2018-08-16 11:02:57",
      "payParams":
      {
        "payBarCode": "135026070990636151"
      },
      "payMode":
       {
        "href": "http://192.168.7.6:6009/api/v1.0.0/payModes/wf1YFe09Z8AcIA50hnHJHA"
      },
      "refundOrders": {
        "href": "http://192.168.7.6:6009/api/v1.0.0/payOrders/NHQGABZ2ZGWJlaGrx2Gmcw/refundOrders"
      },
      "tradeRecords": {
        "href": "http://192.168.7.6:6009/api/v1.0.0/payOrders/NHQGABZ2ZGWJlaGrx2Gmcw/tradeRecords"
      }
    }
  ]
}
```


###3.具体支付组件实现的支付接口定义.

具体每个支付组件payUrl的接口定义如下:


**注意事项**

 所有当前字段中没有的附加支付参数放在payParams中自定义，所有客户端的其它附属参数放在clientExtraParams中自定义。


**http**

post

```
{

   payer:'A',                               //付款方。
   payee:'http://192.168.7.188:6004/api/v1.0.0/shops/eLzwsgnlWpZN8xtvz0qgvw', //收款方。
   payAmount:50,  //付款金额，单位为分。
   tractionNo: "201808240009",  //支付网关交易号。
   clientPayNo: "201808240127", //客户端请求号,必须唯一,可以用UUID生成。
   orderStartAt: "2018-08-15 11:53:48",  //订单有效开始时间。
   orderExpiredAt: "2018-08-15 14:53:48",//订单有效结束时间。

   payParams:  //附带支付参数，如挂账主体，微信付款条形码等。
   {
      //*******************挂账支付的参数***************************//
       signAccounterUUID:'ega7hvZz0RBw8TQNFFZN2w',   //挂账主体UUID.
       signPersonUUID:'9oNEJPMAqmVivbk4hioNxQ'       //挂账人UUID.
      //*******************微信或者支付宝刷卡支付的参数***************************//
       "payBarCode": "134853566181206476",           //支付的付款条形码。
   },
   clientExtraParams:  //附带客户端的其它参数。
   {
       orderNo:'P201807050001',   //订单号。
       orderAmount:210,           //订单总金额，单位为分。
       receiveableAmount:210      //应收金额，单位为分。
   },
   "payStartAt": "2018-08-15 11:53:52",    //开始支付时间。
    notifyUrl:'http://192.168.7.6:7000/payInfo',//支付通知URL,仅用于异步支付模式下使用。

}
```


**response**


```
{
    tractionNo:'1531820383201847',  //支付网关交易号。
    ret:'success',                  //支付结果，  'success':成功,'running':处理中,'failed':失败,
    thirdOrderNo:'4200000184201808173250265573',  //第三方支付订单号
    thirdErrorReason: '',  //第三方支付出错原因。
    tradeFinishedAt:'2018-9-10 12:00:00', //支付完成时间。
}
```

###4.发起批量支付.

http://localhost:6009/api/v1.0.0/batchPay

传入多个支付请求数据，以数组方式POST。

**http**

post

```
{
  "batchPayData": [
    {
      "payModeUUID": "qef9X3CqNClIWrU8kBV5cw",
      "payer": "A",
      "payee": "http://192.168.7.188:6005/api/v1.0.0/shops/82TaIejHrZp4aHaM9hG2DQ",
      "payAmount": 1,
      "clientPayNo": "201810160001",
      "clientExtraParams": {},
      "payParams": {
        "signAccounterUUID": "LyWGmvRHlDsH4zYqvND2Gg",
        "signPersonUUID": "pm0gI4OR9w6OOEmCoO5ELg"
      }
    },
    {
      "payModeUUID": "qef9X3CqNClIWrU8kBV5cw",
      "payer": "A",
      "payee": "http://192.168.7.188:6005/api/v1.0.0/shops/82TaIejHrZp4aHaM9hG2DQ",
      "payAmount": 1,
      "clientPayNo": "201810160002",
      "clientExtraParams": {},
      "payParams": {
        "signAccounterUUID": "LyWGmvRHlDsH4zYqvND2Gg",
        "signPersonUUID": "pm0gI4OR9w6OOEmCoO5ELg"
      }
    }
  ]
}
```


**response**

返回多个支付请求返回的回应，包括HTTP的状态码，以及客户端请求号，以及返回的支付响应BODY.
```
{
	"batchPayResult": [{
		"clientPayNo": "201810160001",
		"statusCode": 200,
		"body": {
			"ret": "success",
			"businessRet": "syncOnlinePay",
			"data": {
				"uuid": "cACc35zIFXJNVzPCSXgR3w",
				"payer": "A",
				"payee": "http://192.168.7.188:6005/api/v1.0.0/shops/82TaIejHrZp4aHaM9hG2DQ",
				"payAmount": 1,
				"tractionNo": "1539669840030298",
				"clientPayNo": "201810160001",
				"orderStartAt": "2018-10-16 14:04:00",
				"orderExpiredAt": "2018-10-17 14:04:00",
				"payParams": {
					"signAccounterUUID": "LyWGmvRHlDsH4zYqvND2Gg",
					"signPersonUUID": "pm0gI4OR9w6OOEmCoO5ELg"
				},
				"thirdPayNo": "1539669840030298",
				"resultCode": "",
				"payModeName": "挂账",
				"payTemplateId": "382CF8DF-017F-4009-928F-D5B008095962",
				"payChannel": null,
				"payWay": null,
				"payStartAt": "2018-10-16 14:04:00",
				"payFinishAt": "2018-10-16 14:04:01",
				"refundAmount": 0,
				"lastRefundAt": null,
				"status": "payed",
				"createdAt": "2018-10-16 14:04:00",
				"modifiedAt": "2018-10-16 14:04:00",
				"payModeUUID": "qef9X3CqNClIWrU8kBV5cw",
				"clientExtraParams": {

				}
			}
		}
	},
	{
		"clientPayNo": "201810160002",
		"statusCode": 200,
		"body": {
			"ret": "success",
			"businessRet": "syncOnlinePay",
			"data": {
				"uuid": "8AGFMwoWBbDKNePz8rUnNQ",
				"payer": "A",
				"payee": "http://192.168.7.188:6005/api/v1.0.0/shops/82TaIejHrZp4aHaM9hG2DQ",
				"payAmount": 1,
				"tractionNo": "1539669840040491",
				"clientPayNo": "201810160002",
				"orderStartAt": "2018-10-16 14:04:00",
				"orderExpiredAt": "2018-10-17 14:04:00",
				"payParams": {
					"signAccounterUUID": "LyWGmvRHlDsH4zYqvND2Gg",
					"signPersonUUID": "pm0gI4OR9w6OOEmCoO5ELg"
				},
				"thirdPayNo": "1539669840040491",
				"resultCode": "",
				"payModeName": "挂账",
				"payTemplateId": "382CF8DF-017F-4009-928F-D5B008095962",
				"payChannel": null,
				"payWay": null,
				"payStartAt": "2018-10-16 14:04:00",
				"payFinishAt": "2018-10-16 14:04:01",
				"refundAmount": 0,
				"lastRefundAt": null,
				"status": "payed",
				"createdAt": "2018-10-16 14:04:00",
				"modifiedAt": "2018-10-16 14:04:00",
				"payModeUUID": "qef9X3CqNClIWrU8kBV5cw",
				"clientExtraParams": {

				}
			}
		}
	}]
}
```


#Refund:

Refund资源是指作线上的实际退款业务。

###1.发起线上退款.

http://localhost:6009/api/v1.0.0/refund


**http**

post

```
 {
         payTractionNo:'1531367230400202',  //要退款的支付订单流水号。
         clientRefundNo:'T201807120134',    //客户端退款流水号。
         isCancel:1,                        //是否撤销，1为撤销，0为退款。
        clientExtraParams:  //附带客户端的其它参数。
        {
            orderNo:'P201807050001',   //订单号。
            orderAmount:210,           //订单总金额，单位为分。
            receiveableAmount:210      //应收金额，单位为分。

            operatorName: '小美',         //操作人。
            operatorUUID: 'operatorUUID', //操作人UUID.
        },
 };
```


**response**


```
{
  "ret": "success",
  "businessRet": "syncOnlineRefund",  //syncOnlineRefund:线上同步退款，asyncOnlineRefund:线上异步退款，offlineRefund:线下退款。
  "data": {
    "uuid": "quZk1s8YlHdmAKAgReRjOA",
    "refundAmount": 50,                //退款总金额,单位为分。
    "tractionNo": "2531374409358394",  //退款订单流水号。
    "clientRefundNo": "T201807120134", //客户端退款流水号。
    "thirdRefundNo": null,             //第三方退款订单号，如微信退款订单号。
    "refundStartAt": "2018-07-12 13:46:49", //退款开始时间。
    "refundFinishAt": null,                 //退款完成时间。
    "resultCode": null,                     //第三方退款结果码。
    "status": "unRefund",                   //退款状态，unRefunded:未退款，refunding:退款中,refunded:退款成功,refundFailed:退款失败。
    "createdAt": "2018-07-12 13:46:49",
    "modifiedAt": "2018-07-12 13:46:49",
    "payOrderUUID": "5Y9fZtPBu1yTvYkzTPPf8w" //支付方式UUID.
  }
}

```

###2.具体支付组件实现的退款接口定义.

具体每个支付组件refundUrl的接口定义如下:


**注意事项**



**http**

post

```
{
   clientRefundNo:'T20180919',
   tractionNo: '301808240004', //系统内部退款交易号。
   payTractionNo:'201808240008',  //系统内部支付交易号。
   thirdPayNo:'4200000181201808163040805263',  //微信支付订单号。
   "payee": "http://192.168.7.188:6005/api/v1.0.0/shops/82TaIejHrZp4aHaM9hG2DQ",  //支付时的收款方。
   "payAmount": 1,  //订单支付总金额。
   refundAmount:1, //退款金额。
   notifyUrl:'http://192.168.7.6:7000/refundInfo', //退款通知URL，仅在异步支付时使用。
    clientExtraParams:  //附带客户端的其它参数。
           {
               orderNo:'P201807050001',   //订单号。
               orderAmount:210,           //订单总金额，单位为分。
               receiveableAmount:210      //应收金额，单位为分。

               operatorName: '小美',         //操作人。
               operatorUUID: 'operatorUUID', //操作人UUID.
           },

}
```


**response**


```
{
    tractionNo:'1531820383201847',  //支付网关退款交易号。
    ret:'success',                  //支付结果，  'success':成功,'failed':失败,
    thirdOrderNo:'4200000184201808173250265573',  //第三方退款订单号
    thirdErrorReason: '',  //第三方退款出错原因。
    tradeFinishedAt:'2018-9-10 12:00:00', //退款完成时间。
}
```

###3.发起批量线上退款.

http://localhost:6009/api/v1.0.0/batchRefund


**http**

post

```
{
  "batchRefundData": [
    {
      "clientRefundNo": "T201810160001",
      "payTractionNo": "1539669840030298"
    },
    {
      "clientRefundNo": "T201810160002",
      "payTractionNo": "1539669840040491"
    }
  ]
}
```


**response**


```
{
	"batchRefundResult": [{
		"clientRefundNo": "T201810160001",
		"statusCode": 200,
		"body": {
			"ret": "success",
			"businessRet": "syncOnlineRefund",
			"data": {
				"uuid": "5mirdcLEizGYkiiz7BtYgw",
				"refundAmount": 1,
				"tractionNo": "2539670081140222",
				"clientRefundNo": "T201810160001",
				"thirdRefundNo": "2539670081140222",
				"refundStartAt": "2018-10-16 14:08:01",
				"refundFinishAt": "2018-10-16 14:08:01",
				"resultCode": "",
				"status": "refunded",
				"createdAt": "2018-10-16 14:08:01",
				"modifiedAt": "2018-10-16 14:08:01",
				"payOrderUUID": "cACc35zIFXJNVzPCSXgR3w"
			}
		}
	},
	{
		"clientRefundNo": "T201810160002",
		"statusCode": 200,
		"body": {
			"ret": "success",
			"businessRet": "syncOnlineRefund",
			"data": {
				"uuid": "88dKJaNHuSsP5luemBdjYg",
				"refundAmount": 1,
				"tractionNo": "2539670081130543",
				"clientRefundNo": "T201810160002",
				"thirdRefundNo": "2539670081130543",
				"refundStartAt": "2018-10-16 14:08:01",
				"refundFinishAt": "2018-10-16 14:08:01",
				"resultCode": "",
				"status": "refunded",
				"createdAt": "2018-10-16 14:08:01",
				"modifiedAt": "2018-10-16 14:08:01",
				"payOrderUUID": "8AGFMwoWBbDKNePz8rUnNQ"
			}
		}
	}]
}

```
