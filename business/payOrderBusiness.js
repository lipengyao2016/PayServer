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
const  PayOrderProxy= require('../proxy/payOrderProxy');
const inflection = require( 'inflection' );
const cacheAble = require('componet-service-framework').cacheAble;
const redis = require('../common/redis');
let parse = restRouterModel.parse;

const utils = require('componet-service-framework').utils;

const resourceURI = require('../common/resourceURI');
const URIParser = resourceURI.v1;
const tractionNoUtils = require('../common/tractionNoUtils');

const  AmqpLibRecvClient= require('rabbit-config-client').amqpLibRecvClient;
const request = require('common-request').request;

const notifyClient = require('./notifyClient').notifyClient;

const  AmqpLibSendClient= require('rabbit-config-client').amqpLibSendClient;



class PayOrderBusiness extends BaseBusiness
{
    constructor()
    {
        super();
        this.payOrderPreNo = '1';

        this.createPayMQ().then(data=>{
            console.log('create PayMQ ok data:' + data);
        })
    }

    async createPayMQ()
    {
        let amqpServer = _.pick(config.rabbitmq,['host','port','user','password']);

        this.paySendMsgClient = new AmqpLibSendClient('payAmqpSender',amqpServer);
        await this.paySendMsgClient.Init(config.rabbitmq.payInfo.exchangeName, config.rabbitmq.payInfo.exchangeType,
            config.rabbitmq.payInfo.routeKey, config.rabbitmq.payInfo.queueName);


        this.payRecvMsgClient = new AmqpLibRecvClient('payAmqpRecver',amqpServer);
        await  this.payRecvMsgClient.Init(config.rabbitmq.payInfo.exchangeName, config.rabbitmq.payInfo.exchangeType,
            config.rabbitmq.payInfo.routeKey, config.rabbitmq.payInfo.queueName);
        await  this.payRecvMsgClient.createRecverConsumer(config.rabbitmq.payInfo.queueName
            , this.recvPayerMsg, this);

        return true;
    }

    async payBusinessOrder(payOrderMsg,payUrl,notifyUrl)
    {
        let bRet = false;
        let thirdPayNo;
        let payRes;
        if(payUrl)
        {
            try
            {
                let payData = _.pick(payOrderMsg,['payer','payee','payAmount','tractionNo','clientPayNo'
                    ,'orderStartAt','orderExpiredAt','payParams','clientExtraParams','payStartAt']);

                if(!_.isEmpty(notifyUrl))
                {
                    payData['notifyUrl'] = notifyUrl;
                }

                payRes = await request.post(payUrl,payData);
                if(payRes.statusCode == 200 || payRes.statusCode == 201)
                {
                    console.log('PayOrderBusiness->payBusinessOrder pay successs ,url:' + payUrl
                        + ',payRes:' + JSON.stringify(payRes.body,null,2));
                    bRet = true;
                    thirdPayNo = payRes.body.thirdOrderNo;
                }
                else
                {
                    let errorData = 'PayOrderBusiness->payOrder pay failed error!!! url:' + payUrl
                        + ',error:' + JSON.stringify(payRes.body,null,2);
                    console.error(errorData);
                    bRet = false;
                }
            }
            catch(e)
            {
                console.error( 'PayOrderBusiness->payOrder pay exception e:' + e );
                bRet = false;
            }
        }
        else
        {
            console.log('PayOrderBusiness->payBusinessOrder payMode is offline ,pay ok.');
            bRet = true;
        }
        return {bRet,thirdPayNo,payRetData:payRes ? payRes.body : {}};
    }

    async onPayNotify(content,ctx) {
        let data = content.body;

        console.log('PayOrderBusiness->onPayNotify data:' + JSON.stringify(data,null,2));
        let payOrderRes = await this.model.listAll({tractionNo:data.tractionNo});
        if(payOrderRes.items.length > 0)
        {
            let payOrderObj = payOrderRes.items[0];
            let updateInfo = {
                uuid:payOrderObj.uuid,
                status: (data.ret == 'success') ?'payed' : 'payFailed',
                resultCode:data.thirdErrorReason,
                payFinishAt:data.tradeFinishedAt,
            };
            if(!_.isEmpty(data.thirdOrderNo))
            {
                updateInfo.thirdPayNo = data.thirdOrderNo;
            }
            let updateStatusRes = await this.update(updateInfo);
            console.log('PayOrderBusiness->onPayNotify updateStatusRes:' + updateStatusRes);
        }

        return true;
    }


    async recvPayerMsg(data)
    {
        let msgValue = data.content.toString();
        let payOrderMsg = JSON.parse(msgValue);
        console.log('PayOrderBusiness->recvPayerMsg payOrderMsg:' + JSON.stringify(payOrderMsg,null,2));

        let payNotifyUrl = URIParser.internalServerURI('payNotify');
        let payOrderRet = await this.payBusinessOrder(payOrderMsg,payOrderMsg.payUrl,payNotifyUrl);

        if(!payOrderRet.bRet)
        {
            let updateInfo = {
                uuid:payOrderMsg.uuid,
                status:payOrderRet.bRet ?'payed' : 'payFailed',
                resultCode: payOrderRet.bRet ? 'success' : 'failed',
            };
            if(!_.isEmpty(payOrderRet.thirdPayNo))
            {
                updateInfo.thirdPayNo = payOrderRet.thirdPayNo;
            }
            let updateStatusRes = await this.update(updateInfo);
        }
        else
        {
            let payRetData = payOrderRet.payRetData;
            if(payRetData.ret != 'running')
            {
                console.log('PayOrderBusiness->recvPayerMsg pay finished,ret is not running,will direct call onPayNotify!!!');
                await this.onPayNotify({body:payRetData});
            }
        }

        return true;
    }
    

    getPayOrderProxy()
    {
        if(!this.payOrderProxy)
        {
            this.payOrderProxy = new PayOrderProxy(this.dbOperater,this.model,this.models,this.paySendMsgClient);
        }
        return this.payOrderProxy;
    }


    async batchPay(content,ctx)
    {
        let data = content.body.batchPayData;
        let curCtx = this;
        let payUrl = URIParser.internalServerURI('pay');
        let payReq = data.map(payItem=>
        {
            return request.post(payUrl,payItem);
        });
        let payRet = await Promise.all(payReq);


        let handlePayResult = payRet.map((payRetItem,index)=>{
            return {clientPayNo:data[index].clientPayNo,statusCode : payRetItem.statusCode,body : payRetItem.body};
       });

        return {batchPayResult:handlePayResult};
    }


    async pay(content,ctx)
    {
        let data = content.body;
        let payOrderItems = await this.model.list({clientPayNo:data.clientPayNo});
        if(payOrderItems.items.length > 0)
        {
            let errorData = 'PayOrderBusiness->create clientPayNo has exist!!! :' + data.clientPayNo;
            console.warn(errorData);
            return {ret:(payOrderItems.items[0].status == 'payFailed') ? 'failed'  : 'success',businessRet:'syncOnlinePay',data:payOrderItems.items[0]};
        }

        if(!data.orderStartAt)
        {
            data.orderStartAt = utils.getTimeStr(new Date(),true);
        }

        let payModeObjs = await this.models['payMode'].getByKeyId(data.payModeUUID);

        if(payModeObjs.isOpened == 0)
        {
            let errMsg = 'PayOrderBusiness->create payMode is not opened!!!';
            let error = new Error();
            // error.statusCode = 401;
            error.name = ' payMode  not opended';
            error.code = 9002;
            error.message = errMsg;
            error.description = errMsg;
            throw  error;
        }


        /** 2018/10/8  从支付模板中去取支付方式中不会修改的字段。
         lpy-modifyed  */
        if(!_.isEmpty(payModeObjs.payTemplateId))
        {
            let payModeTemplates = await this.models['payModeTemplate'].listAll({payTemplateId:payModeObjs.payTemplateId});
            if(payModeTemplates.items.length <= 0)
            {
                let errorData = 'PayOrderBusiness->create not found payModeTemplate by !!! payTemplateId:' + payModeObjs.payTemplateId;
                console.error(errorData);
                throw new Error(errorData);
            }
             utils.convert2ReturnData(payModeObjs,payModeTemplates.items[0],['id','uuid','name','payTemplateId','description',
             'iconHref','status','createdAt','modifiedAt']);
        }

        /** 2018/7/12  线下支付。
         lpy-modifyed  */
        if(payModeObjs.isOnline == 0)
        {
            return {ret:'success',businessRet:'offlinePay',data:{}};
        }
        

        if(!data.orderExpiredAt && data.orderStartAt)
        {
            let orderStartAt = new Date(data.orderStartAt);
            let orderEndAt = utils.addTime(orderStartAt,payModeObjs.orderValidTime * 60 * 60 * 1000);
            data.orderExpiredAt = utils.getTimeStr(orderEndAt,true);
        }

        data.payModeName = payModeObjs.name;
        data.payTemplateId = payModeObjs.payTemplateId;
        data.payChannel = payModeObjs.payChannel;
        data.payWay = payModeObjs.payWay;

        if(!data.tractionNo)
        {
            data.tractionNo = tractionNoUtils.createTranctionNo(this.payOrderPreNo);
        }
        data.payStartAt = utils.getTimeStr(new Date(),true);
        data = parse(this.resourceConfig,'payOrder',data);

        let tradeRecord= {
            tradeType:'pay',
            tradeAmount:data.payAmount,
            payOrderUUID:data.uuid,
        };
        tradeRecord = parse(this.resourceConfig,'tradeRecord',tradeRecord);

        if(payModeObjs.isAsyncNotify == 0)
        {
            let payNotifyUrl = URIParser.internalServerURI('payNotify');
            let payOrderRet = await this.payBusinessOrder(data,payModeObjs.payUrl,payNotifyUrl);
            let payRetObj = payOrderRet.payRetData;

            if(payOrderRet.bRet)
            {
                data.status = payRetObj.ret == 'success' ?'payed' : ( payRetObj.ret =='running' ? 'paying':'payFailed');
                data.resultCode = payRetObj.thirdErrorReason;
                if(!_.isEmpty(payRetObj.tradeFinishedAt))
                {
                    data.payFinishAt = payRetObj.tradeFinishedAt;
                }
                if(!_.isEmpty(payOrderRet.thirdPayNo))
                {
                    data.thirdPayNo = payOrderRet.thirdPayNo;
                }
            }
            else
            {
                data.status = 'payFailed';
                data.resultCode = 'system error';
            }

            tradeRecord.status = data.status;

            let payOrder = _.clone(data);
            let retData =  await this.getPayOrderProxy().createData(payOrder,tradeRecord,false);
            if(data.status == 'payFailed')
            {
                let errorData = 'PayOrderBusiness->create pay Error:' + JSON.stringify(payOrderRet.payRetData) ;
                console.error(errorData);
                throw new Error(errorData);
            }
            else
            {
                return {ret:'success',businessRet:'syncOnlinePay',data:data};
            }

        }
        else
        {
            data.status = 'paying';
            tradeRecord.status = data.status;
            data.payUrl = payModeObjs.payUrl;
            let retData =  await this.getPayOrderProxy().createData(data,tradeRecord,true);
            return {ret:'success',businessRet:'asyncOnlinePay',data:data};
        }

      //  return await  this.getByUUID(data.uuid);
    }


    async update(data,ctx)
    {
        let payOrderObjs = await this.model.getByKeyId(data.uuid);
        let updateFields = ['thirdPayNo','resultCode','status','uuid','modifiedAt','payFinishAt'];
        let notExistFields = [];
        _.keys(data).map(key=>{
            if(updateFields.indexOf(key) < 0)
            {
                notExistFields.push(key);
            }
        });

        if(notExistFields.length > 0)
        {
            let errorData = 'PayOrderBusiness->update has invalid fields:' + JSON.stringify(notExistFields);
            console.error(errorData);
            throw new Error(errorData);
        }

        if(data['status']  )
        {
            let bErr =false;
            let bNeedUpdate = true;
            switch(payOrderObjs.status)
            {
                case 'unpay':
                    if(data['status'] != 'payed' && data['status'] != 'payFailed')
                    {
                        bErr = true;
                    }
                    break;
                case 'payed':
                    if(data['status'] != 'payed' )
                    {
                        bErr = true;
                    }
                    else
                    {
                        bNeedUpdate = false;
                    }
                    break;
                case 'payFailed':
                    if(data['status'] != 'payFailed' )
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
                let errorData = 'PayOrderBusiness->update status is invalid  :' + data['status'];
                console.error(errorData);
                throw new Error(errorData);
            }

            if(bNeedUpdate)
            {
                if(!data.payFinishAt)
                {
                    data.payFinishAt = utils.getTimeStr(new Date(),true);
                }

                data.modifiedAt = utils.getTimeStr(new Date(),true);

                let tradeRecord= {
                    tradeType:'pay',
                    tradeAmount:payOrderObjs.payAmount,
                    payOrderUUID:data.uuid,
                    status:data['status'],
                };

                tradeRecord = parse(this.resourceConfig,'tradeRecord',tradeRecord);
                let retData =  await this.getPayOrderProxy().updateData(data,tradeRecord);
            }
            else
            {
                console.warn('PayOrderBusiness->update status  has repeat updated :' + data['status']);
            }

        }
        else
        {
            let retData =  await super.update(data);
        }

        return await  this.getByUUID(data.uuid);
    }



}


module.exports = PayOrderBusiness;


