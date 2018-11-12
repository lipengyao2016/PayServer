/**
 * Created by Administrator on 2018/4/24.
 */
const _ = require('lodash');
const moment = require('moment');
const devUtils = require('develop-utils');
const restRouterModel = require('rest-router-model');
let BaseBusiness = restRouterModel.BaseBusiness;
let getSchema = restRouterModel.getSchema;
const config = require('../config/config');
const  RefundOrderProxy= require('../proxy/refundOrderProxy');
const inflection = require( 'inflection' );
const cacheAble = require('componet-service-framework').cacheAble;
const redis = require('../common/redis');
let parse = restRouterModel.parse;

const utils = require('componet-service-framework').utils;

const resourceURI = require('../common/resourceURI');
const URIParser = resourceURI.v1;
const tractionNoUtils = require('../common/tractionNoUtils');

const  AmqpLibSendClient= require('rabbit-config-client').amqpLibSendClient;
const  AmqpLibRecvClient= require('rabbit-config-client').amqpLibRecvClient;
const request = require('common-request').request;
const notifyClient = require('./notifyClient').notifyClient;


class RefundOrderBusiness extends BaseBusiness
{
    constructor()
    {
        super();
        this.refundOrderPreNo = '2';

        this.createRefundMQ().then(data=>{
            console.log('create RefundMQ ok data:' + data);
        });

    }

    async createRefundMQ()
    {
        let amqpServer = _.pick(config.rabbitmq,['host','port','user','password']);

        this.refundSendMsgClient = new AmqpLibSendClient('refundAmqpSender',amqpServer);
        await this.refundSendMsgClient.Init(config.rabbitmq.refundInfo.exchangeName, config.rabbitmq.refundInfo.exchangeType,
            config.rabbitmq.refundInfo.routeKey, config.rabbitmq.refundInfo.queueName);


        this.refundRecvMsgClient = new AmqpLibRecvClient('refundAmqpRecver',amqpServer);

        await  this.refundRecvMsgClient.Init(config.rabbitmq.refundInfo.exchangeName, config.rabbitmq.refundInfo.exchangeType,
            config.rabbitmq.refundInfo.routeKey, config.rabbitmq.refundInfo.queueName);
        await  this.refundRecvMsgClient.createRecverConsumer(config.rabbitmq.refundInfo.queueName
            , this.recvRefunderMsg, this);

        return true;

    }

    async refundBusinessOrder(refundOrderMsg,payOrder,refundUrl,notifyUrl)
    {
        let bRet = false;
        let thirdRefundNo;
        let refundRes;
        if(refundUrl)
        {
            let refundData = {
                clientRefundNo:refundOrderMsg.clientRefundNo,
                tractionNo: refundOrderMsg.tractionNo,
                thirdPayNo:payOrder.thirdPayNo,
                payTractionNo:payOrder.tractionNo,
                payee: payOrder.payee,  //支付时的收款方。
                payAmount: payOrder.payAmount,  //订单支付总金额。
                refundAmount:refundOrderMsg.refundAmount, //退款金额。
                clientExtraParams:refundOrderMsg.clientExtraParams,
            };

            if(!_.isEmpty(notifyUrl))
            {
                refundData.notifyUrl = notifyUrl;
            }

            try
            {
                refundRes = await request.post(refundUrl,refundData);
                if(refundRes.statusCode == 200 || refundRes.statusCode == 201)
                {
                    console.log('RefundOrderBusiness->refundBusinessOrder refund successs ,' +
                        'url:' + refundUrl
                        + ',refundRes:' + JSON.stringify(refundRes.body,null,2));
                    bRet = true;
                    thirdRefundNo = refundRes.body.thirdOrderNo;
                }
                else
                {
                    let errorData = 'RefundOrderBusiness->refundBusinessOrder refund failed !!!,' +
                        'url:' + refundUrl
                        +' error:' + JSON.stringify(refundRes.body,null,2);
                    console.error(errorData);
                    bRet = false;
                }
            }
            catch(e)
            {
                bRet = false;
                console.error('RefundOrderBusiness->refundBusinessOrder refund error,e:' + e);
            }

        }
        else
        {
            console.log('RefundOrderBusiness->refundBusinessOrder refund mode is offline,refund ok..');
            bRet = true;
        }

        return {bRet,thirdRefundNo,refundRetData:refundRes ? refundRes.body : {}};
    }


    async onRefundNotify(content,ctx) {
        let data = content.body;

        console.log('RefundOrderBusiness->onRefundNotify data:' + JSON.stringify(data,null,2));

        let payOrderRes = await this.model.listAll({tractionNo:data.tractionNo});
        if(payOrderRes.items.length > 0)
        {
            let payOrderObj = payOrderRes.items[0];
            let updateInfo = {
                uuid:payOrderObj.uuid,
                status: (data.ret == 'success') ?'refunded' : 'refundFailed',
                resultCode:data.thirdErrorReason,
                refundFinishAt:data.tradeFinishedAt,
            };
            if(!_.isEmpty(data.thirdOrderNo))
            {
                updateInfo.thirdRefundNo = data.thirdOrderNo;
            }
            let updateStatusRes = await this.update(updateInfo);
            console.log('RefundOrderBusiness->onRefundNotify updateStatusRes:' + updateStatusRes);
        }

        return true;
    }

    async recvRefunderMsg(data)
    {
        let msgValue = data.content.toString();
        let refundOrderMsg = JSON.parse(msgValue);
        console.log('RefundOrderBusiness->recvMsg msgValue:' + JSON.stringify(refundOrderMsg,null,2));


        let refundNotifyUrl = URIParser.internalServerURI('refundNotify');
        let refundOrderRet = await this.refundBusinessOrder(refundOrderMsg,refundOrderMsg.payOrder,
            refundOrderMsg.refundUrl,refundNotifyUrl);

        if(!refundOrderRet.bRet)
        {
            let updateInfo = {
                uuid:refundOrderMsg.uuid,
                status:refundOrderRet.bRet ?'refunded' : 'refundFailed',
                resultCode: refundOrderRet.bRet ? 'sucess' : 'failed',
            };
            if(!_.isEmpty(refundOrderRet.thirdRefundNo))
            {
                updateInfo.thirdRefundNo = refundOrderRet.thirdRefundNo;
            }
            let updateStatusRes = await this.update(updateInfo);
        }
        else
        {
            let refundRetData = refundOrderRet.refundRetData;
            if(refundRetData.ret != 'running')
            {
                console.log('RefundOrderBusiness->recvRefunderMsg refund finished,ret is not running,will direct call onRefundNotify!!!');
                await this.onRefundNotify({body:refundRetData});
            }
        }

       /* await notifyClient.notify(refundOrderMsg.notifyUrl,refundOrderMsg.tractionNo,refundOrderMsg.clientRefundNo,
            refundOrderRet.thirdRefundNo,updateInfo.status);*/

        return true;
    }


    getRefundOrderProxy()
    {
        if(!this.refundOrderProxy)
        {
            this.refundOrderProxy = new RefundOrderProxy(this.dbOperater,this.model,this.models,this.refundSendMsgClient);
        }
        return this.refundOrderProxy;
    }


    async batchRefund(content,ctx)
    {
        let data = content.body.batchRefundData;
        let curCtx = this;
        let refundUrl = URIParser.internalServerURI('refund');
        let refundReq = data.map(refundItem=>
        {
            return request.post(refundUrl,refundItem);
        });
        let refundRet = await Promise.all(refundReq);


        let handleRefundResult = refundRet.map((refundRetItem,index)=>{
            return {clientRefundNo:data[index].clientRefundNo,statusCode : refundRetItem.statusCode,body : refundRetItem.body};
        });

        return {batchRefundResult:handleRefundResult};
    }


    async refund(content,ctx)
    {
        let data = content.body;
        let refundOrderItems = await this.model.list({clientRefundNo:data.clientRefundNo});
        if(refundOrderItems.items.length > 0)
        {
            let errorData = 'RefundOrderBusiness->create clientRefundNo has exist!!! :' + data.clientRefundNo;
            console.warn(errorData);
            return {ret:(refundOrderItems.items[0].status == 'refundFailed') ? 'failed'  : 'success',businessRet:'syncOnlineRefund',data:refundOrderItems.items[0]};
        }
        let payOrderItems = await this.models['payOrder'].list({tractionNo:data.payTractionNo});
        if(payOrderItems.items.length <= 0 )
        {
            let errorData = 'RefundOrderBusiness->create payOrder not has exist!!! payTractionNo:' + data.payTractionNo;
            console.error(errorData);
            throw new Error(errorData);
        }
        let payOrderObj = payOrderItems.items[0];

        if(payOrderObj.status == 'refunded')
        {
           console.warn('RefundOrderBusiness->create payOrder status is refunded!!!!') ;
           refundOrderItems = await this.model.list({payOrderUUID:payOrderObj.uuid});
           return {ret: 'success',businessRet:'syncOnlineRefund',data:refundOrderItems.items[0]};
        }
        else if(payOrderObj.status != 'payed' && payOrderObj.status != 'partRefunded')
        {
            let errorData = 'RefundOrderBusiness->create payOrder status is invalid!!! payOrderObj.status:' +payOrderObj.status;
            console.error(errorData);
            throw new Error(errorData);
        }

        /** 2018/7/12  如果是撤销订单，则撤销时间不能超过订单完成时间后的8个小时。
         lpy-modifyed  */
        if(data.isCancel && data.isCancel == 1)
        {
            let payFinishedAt = new Date(payOrderObj.payFinishAt);
            let cancelOrderEndAt = utils.addTime(payFinishedAt,8 * 60 * 60 * 1000);
            if(new Date() > cancelOrderEndAt )
            {
                let errorData = 'RefundOrderBusiness->create payOrder has exceed cancel limit time ,can not canceled!!!' ;
                console.error(errorData);
                throw new Error(errorData);
            }
        }


        if(!data.refundAmount)
        {
            data.refundAmount = payOrderObj.payAmount - payOrderObj.refundAmount;
        }
        if(payOrderObj.refundAmount + data.refundAmount> payOrderObj.payAmount)
        {
            let errorData = 'RefundOrderBusiness->create refundAmount exceed payAmount!!!!' ;
            console.error(errorData);
            throw new Error(errorData);
        }

        let payModeObjs = await this.models['payMode'].getByKeyId(payOrderObj.payModeUUID);


        /** 2018/10/8  从支付模板中去取支付方式中不会修改的字段。
         lpy-modifyed  */
        if(!_.isEmpty(payModeObjs.payTemplateId))
        {
            let payModeTemplates = await this.models['payModeTemplate'].listAll({payTemplateId:payModeObjs.payTemplateId});
            if(payModeTemplates.items.length <= 0)
            {
                let errorData = 'RefundOrderBusiness->create not found payModeTemplate by !!! payTemplateId:' + payModeObjs.payTemplateId;
                console.error(errorData);
                throw new Error(errorData);
            }
            utils.convert2ReturnData(payModeObjs,payModeTemplates.items[0],['id','uuid','name','payTemplateId','description',
                'iconHref','status','createdAt','modifiedAt']);
        }

        /** 2018/7/12  线下退款。
         lpy-modifyed  */
        if(payModeObjs.isOnline == 0)
        {
            return {ret:'success',businessRet:'offlineRefund',data:{}};
        }

        /** 2018/7/5 生成退款平台流水号。
         lpy-modifyed  */
        if(!data.tractionNo)
        {
            data.tractionNo = tractionNoUtils.createTranctionNo(this.refundOrderPreNo);
        }
        data.refundStartAt = utils.getTimeStr(new Date(),true);
        data.payOrderUUID = payOrderObj.uuid;
        delete data.payTractionNo;
        delete data.isCancel;
        data = parse(this.resourceConfig,'refundOrder',data);


        let tradeRecord= {
            tradeType:'refund',
            tradeAmount:data.refundAmount,
            refundOrderUUID:data.uuid,
            payOrderUUID:payOrderObj.uuid,
        };
        tradeRecord = parse(this.resourceConfig,'tradeRecord',tradeRecord);

        if(payModeObjs.isAsyncNotify == 0)
        {
            let refundNotifyUrl = URIParser.internalServerURI('refundNotify');
            let refundOrderRet = await this.refundBusinessOrder(data,payOrderObj,payModeObjs.refundUrl,refundNotifyUrl);
            let refundRetObj = refundOrderRet.refundRetData;

            if(refundOrderRet.bRet)
            {
                data.status = (refundRetObj.ret == 'success') ?'refunded' : (refundRetObj.ret =='running' ? 'refunding' :'refundFailed');
                data.resultCode = refundRetObj.thirdErrorReason;
                if(!_.isEmpty(refundRetObj.tradeFinishedAt))
                {
                    data.refundFinishAt = refundRetObj.tradeFinishedAt;
                }
                if(!_.isEmpty(refundOrderRet.thirdRefundNo))
                {
                    data.thirdRefundNo = refundOrderRet.thirdRefundNo;
                }
            }
            else
            {
                data.status = 'refundFailed';
                data.resultCode = 'system error';
            }

            tradeRecord.status = data.status;
            let refundOrder = _.clone(data);
            delete refundOrder.clientExtraParams;
            let retData =  await this.getRefundOrderProxy().createData(refundOrder,tradeRecord,false);
            if(data.status == 'refundFailed')
            {
                let errorData = 'RefundOrderBusiness->create refund Error:' + JSON.stringify(refundOrderRet.refundRetData) ;
                console.error(errorData);
                throw new Error(errorData);
            }
            else
            {
                return {ret:'success',businessRet:'syncOnlineRefund',data:data};
            }
        }
        else
        {
            data.status = 'refunding';
            tradeRecord.status = data.status;
            data.payOrder = payOrderObj;
            data.refundUrl = payModeObjs.refundUrl;
            let retData =  await this.getRefundOrderProxy().createData(data,tradeRecord,true);
            return {ret:'success',businessRet:'asyncOnlineRefund',data:data};
        }
    }


    async update(data,ctx)
    {
        let refundOrderObjs = await this.model.getByKeyId(data.uuid);
        let updateFields = ['thirdRefundNo','resultCode','status','uuid','modifiedAt','refundFinishAt'];
        let notExistFields = [];
        _.keys(data).map(key=>{
            if(updateFields.indexOf(key) < 0)
            {
                notExistFields.push(key);
            }
        });

        if(notExistFields.length > 0)
        {
            let errorData = 'RefundOrderBusiness->update has invalid fields:' + JSON.stringify(notExistFields);
            console.error(errorData);
            throw new Error(errorData);
        }

        if(data['status']  )
        {
            /** 2018/7/5  不用在此判断，退款金额是否大于支付金额，因为在之前创建退款单时已判断。
             lpy-modifyed  */
            /*            let payOrderObjs = await this.models['payOrder'].getByKeyId(refundOrderObjs.payOrderUUID);
                        if(data['status'] == 'refunded' )
                        {
                             if(refundOrderObjs.refundAmount + payOrderObjs.refundAmount > payOrderObjs.payAmount )
                             {
                                 let errorData = 'RefundOrderBusiness->update refundAmount exceed payAmount!!!!';
                                 console.error(errorData);
                                 throw new Error(errorData);
                             }
                        }*/


            let bErr =false;
            let bNeedUpdate = true;
            switch(refundOrderObjs.status)
            {
                case 'unRefund':
                    if(data['status'] != 'refunded' && data['status'] != 'refundFailed')
                    {
                        bErr = true;
                    }
                    break;
                case 'refunded':
                    if(data['status'] != 'refunded' )
                    {
                        bErr = true;
                    }
                    else
                    {
                        bNeedUpdate = false;
                    }
                    break;
                case 'refundFailed':
                    if(data['status'] != 'refundFailed' )
                    {
                        bErr = true;
                    }
                    else
                    {
                        bNeedUpdate = false;
                    }
                    break;
            }

            if(bErr)
            {
                let errorData = 'RefundOrderBusiness->update status is invalid  :' + data['status'];
                console.error(errorData);
               // throw new Error(errorData);
                return await  this.getByUUID(data.uuid);
            }

            if(bNeedUpdate)
            {

                if(!data.refundFinishAt)
                {
                    data.refundFinishAt = utils.getTimeStr(new Date(),true);
                }

                data.modifiedAt = utils.getTimeStr(new Date(),true);

                let tradeRecord= {
                    tradeType:'refund',
                    tradeAmount:refundOrderObjs.refundAmount,
                    refundOrderUUID:data.uuid,
                    payOrderUUID:refundOrderObjs.payOrderUUID,
                    status:data['status'],
                };

                tradeRecord = parse(this.resourceConfig,'tradeRecord',tradeRecord);
                let retData =  await this.getRefundOrderProxy().updateData(data,tradeRecord);
            }
            else
            {
                console.warn('RefundOrderBusiness->update status  has repeat updated :' + data['status']);
            }

        }
        else
        {
            let retData =  await super.update(data);
        }


        return await  this.getByUUID(data.uuid);
    }



}


module.exports = RefundOrderBusiness;


