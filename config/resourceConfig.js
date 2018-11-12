/**
 * Created by Administrator on 2018/1/15.
 */

const config = require('./config');

module.exports = {
    // 支付模式
    "payModeTemplate":{
        rest_api: 'batch' ,

        extend_api: [
            // {name: 'create', method: 'POST', url:'/api/:version/merchants/:merchantUUID/customers'},
            // {name: 'listPackageTotalStatistics', method: 'GET', url:'/api/:version/goodsPackageTotalStatistics'},
            //{name: 'listGoodsCostStatistics', method: 'GET', url:'/api/:version/goodsCostStatistics'},

            {name: 'registerPayModeTemplate', method: 'POST', url:'/api/:version/registerPayModeTemplate'},
        ],

        params: {
            name:{type:'string'},
            description:{type:'string'},
            checkEnvUrl:{type:'string'},
            payUrl:{type:'string'},
            refundUrl:{type:'string'},
            iconHref:{type:'string'},
            payTemplateId:{type:'string'},

            orderValidTime: {type: 'number',value:24},
            isOnline: {type: 'number',value:0},
            isSignAccount: {type: 'number',value:0},
            isAsyncNotify: {type: 'number',value:0},
            isThridPay: {type: 'number',value:0},
            isDefaultOpen: {type: 'number',value:0},
            payChannel:{type:'string'},
            payWay: {type: 'string'},
            status:{type:'string',value:'enabled'},
            createdAt: {type:'time'},
            modifiedAt:{type:'time'},
        },
    },


    // 支付模式商户配置。
    "payMode": {
        rest_api:  'batch',
       // super: 'payModeTemplate',

        extend_api: [
           /*  {name: 'openPayMode', method: 'POST', url:'/api/:version/openPayMode'},*/
             {name: 'listAllPayModes', method: 'GET', url:'/api/:version/listAllPayModes'},
            {name: 'createOrderNo', method: 'POST', url:'/api/:version/orderNo'},

        ],

        params: {
            merchant:{type:'url'},
            name:{type:'string'},
            description:{type:'string'},
            checkEnvUrl:{type:'string'},
            payUrl:{type:'string'},
            refundUrl:{type:'string'},
            iconHref:{type:'string'},

            payTemplateId:{type:'string'},

            orderValidTime: {type: 'number',value:24},
            isOnline: {type: 'number',value:0},
            isSignAccount: {type: 'number',value:0},
            isAsyncNotify: {type: 'number',value:0},
            isThridPay: {type: 'number',value:0},
            isDefaultOpen: {type: 'number',value:0},
            payChannel:{type:'string'},
            payWay: {type: 'string'},

            isFastPay:{type:'number',value:0},
            isOpened:{type:'number',value:0},
            uiOrder:{type:'number'},
            createdAt: {type:'time'},
            modifiedAt:{type:'time'},
        },
    },


    // 支付订单。
    "payOrder": {
        rest_api:  'batch',
        super: 'payMode',

        extend_api: [
             {name: 'pay', method: 'POST', url:'/api/:version/pay'},
             {name: 'onPayNotify', method: 'POST', url:'/api/:version/payNotify'},
             {name: 'batchPay', method: 'POST', url:'/api/:version/batchPay'},
        ],

        params: {
            payer:{type:'string'},
            payee:{type:'string'},
            payAmount:{type:'number',value:0},
            tractionNo:{type:'string'},
            clientPayNo:{type:'string'},
            orderStartAt:{type:'time'},
            orderExpiredAt:{type:'time'},
            payParams:{type:'json'},
            thirdPayNo:{type:'string'},
            resultCode:{type:'string'},
            payModeName:{type:'string'},
            payTemplateId:{type:'string'},
            payChannel:{type:'string'},
            payWay:{type:'string'},
            payStartAt:{type:'time'},
            payFinishAt:{type:'time'},
            refundAmount:{type:'number',value:0},
            lastRefundAt:{type:'time'},
            status:{type:'string',value:'unpay'},
            createdAt: {type:'time'},
            modifiedAt:{type:'time'},
        },
    },


    // 退款单。
    "refundOrder": {
        rest_api:  'batch',
        super: 'payOrder',

        extend_api: [
            // {name: 'listDownLevelMenuGroups', method: 'GET', url:'/api/:version/menuGroups/:menuGroupUUID/downLevelMenuGroups'},
            {name: 'refund', method: 'POST', url:'/api/:version/refund'},
            {name: 'onRefundNotify', method: 'POST', url:'/api/:version/refundNotify'},
            {name: 'batchRefund', method: 'POST', url:'/api/:version/batchRefund'},
        ],

        params: {
            refundAmount:{type:'number',value:0},
            tractionNo:{type:'string'},
            clientRefundNo:{type:'string'},
            thirdRefundNo:{type:'string'},
            refundStartAt:{type:'time'},
            refundFinishAt:{type:'time'},
            resultCode:{type:'string'},
            status:{type:'string',value:'unRefund'},
            createdAt: {type:'time'},
            modifiedAt:{type:'time'},
        },
    },


    // 交易记录。
    "tradeRecord": {
        rest_api:  'batch',
        super: 'payOrder',

        extend_api: [
            // {name: 'listDownLevelMenuGroups', method: 'GET', url:'/api/:version/menuGroups/:menuGroupUUID/downLevelMenuGroups'},
        ],

        params: {
            refundOrder:{type:'url',isSaveHref:false},
            tradeType:{type:'string',value:'pay'},
            tradeAmount:{type:'number'},
            remark:{type:'string'},
            status:{type:'string'},
            createdAt: {type:'time'},
            modifiedAt:{type:'time'},
        },
    },






};