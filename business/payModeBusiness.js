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
const request = require('common-request').request;

const tractionNoUtils = require('../common/tractionNoUtils');

class PayModeBusiness extends BaseBusiness
{
    constructor()
    {
        super();
    }


    async create(data,ctx)
    {
        if(data.payTemplateId)
        {
            let payModeTemplateRess = await this.models['payModeTemplate'].listAll({payTemplateId:data.payTemplateId});
            if(payModeTemplateRess.items.length > 0)
            {
                let  payModeTemplateObjs = payModeTemplateRess.items[0];
                if(!_.isEmpty(payModeTemplateObjs.checkEnvUrl))
                {
                    let checkEnvRes = await request.get(payModeTemplateObjs.checkEnvUrl,{merchantHref:data.merchantHref});
                    if(!checkEnvRes.body.ret)
                    {
                        let errMsg = `PayModeBusiness->create open payTemplate error,check env failed payTemplateId:${data.payTemplateId},checkEnvRes:${JSON.stringify(checkEnvRes.body)} `;
                        let error = new Error();
                       // error.statusCode = 401;
                        error.name = 'create paymode error';
                        error.code = 9001;
                        error.message = errMsg;
                        error.description = errMsg;
                        throw  error;
                    }
                }

                payModeTemplateObjs = utils.excludeAttrData(payModeTemplateObjs,['id','uuid','status','createdAt','modifiedAt']);
                _.keys(payModeTemplateObjs).map(key=>{
                    if(!data[key])
                    {
                        data[key] = payModeTemplateObjs[key];
                    }
                })

            }

        }

        return await  super.create(data,ctx);

    }



    async listAllPayModes(content,ctx)
    {
        let data = content.query;

        if(!data.merchantUUID && data.merchantHref)
        {
            data.merchantUUID = devUtils.getLastResourceUUIDInURL(data.merchantHref);
        }

        if(data.merchantUUID && !data.merchantHref)
        {
            data.merchantHref =  URIParser.baseResourcesURI('ShopServer','shops')+ `/${data.merchantUUID}`;
        }


        let payModeTemplateRes = await this.models['payModeTemplate'].listAll();

        let defOpenPayModeTemplates = [];
            payModeTemplateRes.items.map(payModeTemplateItem=>{
            if(payModeTemplateItem.isDefaultOpen == 1)
            {
                defOpenPayModeTemplates.push(payModeTemplateItem);
            }
        });

        let hasExistPayModeRes = await this.model.listAll({merchantUUID:data.merchantUUID});
        for(let i = 0 ;i < defOpenPayModeTemplates.length;i++)
        {
            let findPayModeObjs = _.find(hasExistPayModeRes.items,payModeItem=>
                _.isEqual(payModeItem.payTemplateId,defOpenPayModeTemplates[i].payTemplateId));
            if(!findPayModeObjs)
            {
                 let createPayModeData = {
                     merchantHref:data.merchantHref,
                     payTemplateId:defOpenPayModeTemplates[i].payTemplateId,
                     isOpened:1,
                     uiOrder:1,
                 };
                 createPayModeData = parse(this.resourceConfig,'payMode',createPayModeData);
                 let createpayModeObj = await this.create(createPayModeData,ctx);
                 console.log('PayModeBusiness->listAllPayModes defopen payModeTemplate not exist in current shop payMode ,will register,' +
                     ' createpayModeObj:' + JSON.stringify(createpayModeObj,null,2));
            }
        }

        let payModeQS = {};
        payModeQS = _.extend(payModeQS,data);

        let payModeRes = await this.model.listAll(payModeQS);

        let payModeItems = [];

        payModeRes.items.map(payModeItem=>{
            payModeItem =  utils.excludeAttrData(payModeItem,['id','createdAt','modifiedAt','merchantHref','checkEnvUrl'
            ,'payUrl','refundUrl','isDefaultOpen']);
            payModeItem.hasCreated = 1;
           payModeItems.push(payModeItem);
        });


        payModeTemplateRes.items.map(payModeTemplateItem=>{
             let findPayModeObjs = _.find(payModeRes.items,payModeItem=>
                 _.isEqual(payModeItem.payTemplateId,payModeTemplateItem.payTemplateId));
             if(!findPayModeObjs)
             {
                 payModeTemplateItem =  utils.excludeAttrData(payModeTemplateItem,['id','uuid','createdAt','modifiedAt'
                     ,'merchantHref','checkEnvUrl','payUrl','refundUrl','status','isDefaultOpen']);
                 payModeTemplateItem.hasCreated = 0;
                 payModeTemplateItem.isOpened = 0;
                 payModeTemplateItem.isFastPay = 0;
                 payModeItems.push(payModeTemplateItem);
             }
        });

        return {size:payModeItems.length,items:payModeItems};


    }

    async createOrderNo(content,ctx)
    {
       let data = content.body;
       let orderSeq = await tractionNoUtils.createRedisOrderNo('P');
       return {orderSeq};
    }


}


module.exports = PayModeBusiness;


