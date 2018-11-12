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



class RefundOrderProxy extends BaseProxyTranction
{
    constructor(dbOperater,curModel,models,refundSendMsgClient)
    {
        super(dbOperater);

        this.knex = dbOperater;
        this.curModel = curModel;
        this.models = models;

        this.refundSendMsgClient = refundSendMsgClient;
    }

    async createData(refundOrder,tradeRecord,bAsync)
    {
        let refundOrderName = this.curModel.prototype.tableName;
        let knex = this.knex;
        let tradeRecordName = this.models['tradeRecord'].prototype.tableName;


        let refundTask =_.clone(refundOrder);
        delete refundOrder.notifyUrl;
        delete refundOrder.payOrder;
        delete refundOrder.refundUrl ;

        let payOrderName = this.models['payOrder'].prototype.tableName;

        let ctx = this;

        let retData =  await this.buildTraction(knex,function (trx) {

            return this.insert(knex,refundOrderName,refundOrder,trx)
                .then(data=>{
                    return this.insert(knex,tradeRecordName,tradeRecord,trx);
                })
                .then(data=>{

                    if(bAsync)
                    {
                        console.log('RefundOrderProxy->createData refund async mode ,send msg!!!');
                        return  ctx.refundSendMsgClient.sendMsg(config.rabbitmq.refundInfo.exchangeName,
                            config.rabbitmq.refundInfo.routeKey,
                           JSON.stringify(refundTask))
                            .then(sendRet=>{
                                console.log('RefundOrderProxy->createData sendmsg ok!!');
                                return data;
                            });
                    }
                    else
                    {
                        if(refundOrder['status'] == 'refunded' )
                        {
                            return knex(payOrderName).select().where('uuid', tradeRecord.payOrderUUID).forUpdate().transacting(trx)
                                .then(rows=>{
                                    let oldData =rows[0];

                                    if(tradeRecord.tradeAmount + oldData.refundAmount > oldData.payAmount )
                                    {
                                        let errorData = 'RefundOrderProxy->updateData refundAmount exceed payAmount!!!!';
                                        console.error(errorData);
                                        throw new Error(errorData);
                                    }

                                    oldData['refundAmount'] += tradeRecord.tradeAmount;
                                    oldData['modifiedAt'] =  moment().format('YYYY-MM-DD HH:mm:ss');
                                    oldData['lastRefundAt'] =  moment().format('YYYY-MM-DD HH:mm:ss');
                                    if(oldData['refundAmount'] >= oldData['payAmount'])
                                    {
                                        oldData['status'] = 'refunded';
                                    }
                                    else
                                    {
                                        oldData['status'] = 'partRefunded';
                                    }

                                    return this.update(knex,payOrderName,oldData,trx);
                                });
                        }
                        else
                        {
                            return data;
                        }
                    }


                })
        });

        console.log('RefundOrderProxy->createData retData:' + JSON.stringify(retData,null,2));

        return retData;
    }


    async updateData(refundOrder,tradeRecord)
    {
        let refundOrderName = this.curModel.prototype.tableName;
        let knex = this.knex;
        let tradeRecordName = this.models['tradeRecord'].prototype.tableName;
        let payOrderName = this.models['payOrder'].prototype.tableName;

        let retData =  await this.buildTraction(knex,function (trx) {

            return this.update(knex,refundOrderName,refundOrder,trx)
                .then(data=>{
                    return this.insert(knex,tradeRecordName,tradeRecord,trx);
                })
                .then(data=>{
                    if(refundOrder['status'] == 'refunded' )
                    {
                        return knex(payOrderName).select().where('uuid', tradeRecord.payOrderUUID).forUpdate().transacting(trx)
                            .then(rows=>{
                                let oldData =rows[0];

                                if(tradeRecord.tradeAmount + oldData.refundAmount > oldData.payAmount )
                                {
                                    let errorData = 'RefundOrderProxy->updateData refundAmount exceed payAmount!!!!';
                                    console.error(errorData);
                                    throw new Error(errorData);
                                }

                                oldData['refundAmount'] += tradeRecord.tradeAmount;
                                oldData['modifiedAt'] =  moment().format('YYYY-MM-DD HH:mm:ss');
                                oldData['lastRefundAt'] =  moment().format('YYYY-MM-DD HH:mm:ss');
                                if(oldData['refundAmount'] >= oldData['payAmount'])
                                {
                                    oldData['status'] = 'refunded';
                                }
                                else
                                {
                                    oldData['status'] = 'partRefunded';
                                }

                                return this.update(knex,payOrderName,oldData,trx);
                            });
                    }
                    else
                    {
                        return true;
                    }
                })

        });

        console.log('RefundOrderProxy->updateData retData:' + JSON.stringify(retData,null,2));

        return retData;
    }

}


module.exports = RefundOrderProxy;


