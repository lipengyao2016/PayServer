/**
 * Created by Administrator on 2018/4/24.
 */
const _ = require('lodash');
const moment = require('moment');
const devUtils = require('develop-utils');
const restRouterModel = require('rest-router-model');
let BaseBusiness = restRouterModel.BaseBusiness;
let getSchema = restRouterModel.getSchema;
let parse = restRouterModel.parse;
const DistritubeExtraTranction = require('componet-service-framework').distritubeExtraTranction;
const BaseProxyTranction = require('componet-service-framework').baseProxyTranction;
const config = require('../config/config');




class PayOrderProxy extends BaseProxyTranction
{
    constructor(dbOperater,curModel,models,paySendMsgClient)
    {
        super(dbOperater);

        this.knex = dbOperater;
        this.curModel = curModel;
        this.models = models;
        this.paySendMsgClient = paySendMsgClient;
    }



    async createData(payOrder,tradeRecord,bAsync)
    {
        let payOrderName = this.curModel.prototype.tableName;
        let knex = this.knex;
        let tradeRecordName = this.models['tradeRecord'].prototype.tableName;

        let payTask =_.clone(payOrder);
        delete  payOrder.notifyUrl;
        delete payOrder.clientExtraParams;
        delete payOrder.payUrl;

        if(payOrder.payParams)
        {
            payOrder.payParams =JSON.stringify(payOrder.payParams);
        }

        let ctx = this;

        let retData =  await this.buildTraction(knex,function (trx) {

            return this.insert(knex,payOrderName,payOrder,trx)
                .then(data=>{
                    return this.insert(knex,tradeRecordName,tradeRecord,trx);
                })
                .then(data=>{

                    if(bAsync)
                    {
                        console.log('PayOrderProxy->createData pay async mode ,send msg!!!');
                        return  ctx.paySendMsgClient.sendMsg(config.rabbitmq.payInfo.exchangeName,
                            config.rabbitmq.payInfo.routeKey,JSON.stringify(payTask))
                            .then(sendRet=>{
                                console.log('PayOrderProxy->createData sendmsg ok!!');
                                return data;
                            });
                    }
                    else
                    {
                        return data;
                    }
                });
        });

        console.log('PayOrderProxy->createData retData:' + JSON.stringify(retData,null,2));

        return retData;
    }


    async updateData(payOrder,tradeRecord)
    {
        let payOrderName = this.curModel.prototype.tableName;
        let knex = this.knex;
        let tradeRecordName = this.models['tradeRecord'].prototype.tableName;

        let retData =  await this.buildTraction(knex,function (trx) {

            return this.update(knex,payOrderName,payOrder,trx)
                .then(data=>{
                    return this.insert(knex,tradeRecordName,tradeRecord,trx);
                })

        });

        console.log('PayOrderProxy->updateData retData:' + JSON.stringify(retData,null,2));

        return retData;
    }

}


module.exports = PayOrderProxy;


