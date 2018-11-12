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

var payModeConfig = {
    version : 'v1.0.0',

    //流量表集，目前初始配置，后续可以存数据库动态配置。
    data : [
        {
            uuid:'oQc1ZSvCagJwwZFpcEg0bw',
            payTemplateId:'C924182F-581B-4990-944A-ABCAB8E552B3',
            name:'现金',
            checkEnvUrl:'',
            payUrl:'',
            description:'现金支付',
            isDefaultOpen:1,
        },
        {
            uuid:'bws5eT5lXi9PrhA73uKReA',
            payTemplateId:'4CE44A21-68DA-4ADA-B7EE-371187327F75',
            name:'银联',
            checkEnvUrl:'',
            payUrl:'',
            description:'银联支付',
            isDefaultOpen:1,
        },
        {
            uuid:'1NOnPqDg1uvyd5SPSDu2Dg',
            payTemplateId:'030D6B71-D347-11E8-88C4-7BB29CC3B08D',
            name:'收钱吧',
            checkEnvUrl:'',
            payUrl:'',
            description:'收钱吧支付',
            isDefaultOpen:1,
        },
    ],
};


class PayModeTemplateBusiness extends BaseBusiness
{
    constructor()
    {
        super();
    }


    async initOfflinePayMode()
    {
        for(let i = 0;i<payModeConfig.data.length;i++)
        {
            let payModeItem = payModeConfig.data[i];

            let registerRet = await this.registerPayModeTemplate({body:payModeItem});
          /*  let payModeObj = await this.model.listAll({payTemplateId:payModeItem.payTemplateId});
            if(payModeObj.items.length > 0)
            {
                console.log(`PayModeTemplateBusiness->initOfflinePayMode payMode:${payModeItem.name} has register!!!`);
            }
            else
            {
                 payModeItem = parse(this.resourceConfig,'payModeTemplate',payModeItem);
                 payModeObj = await this.create(payModeItem);
                console.log(`PayModeTemplateBusiness->initOfflinePayMode payMode:${payModeItem.name}  register success`);
            }*/
        }

        console.log(`PayModeTemplateBusiness->initOfflinePayMode end.`);

        return true;
    }

    async registerPayModeTemplate(content,ctx)
    {
        let data = content.body;
        let payModeObj = await this.model.listAll({payTemplateId:data.payTemplateId});
        let registerRet;
        if(payModeObj.items.length > 0)
        {
            let updatePayModeData = _.clone(data);
            updatePayModeData.uuid = payModeObj.items[0].uuid;
            updatePayModeData.modifiedAt = utils.getTimeStr(new Date(),true);
            registerRet = await this.update(updatePayModeData);
            console.log(`PayModeTemplateBusiness->registerPayModeTemplate payMode:${data.name} has register,will update!!!`);
        }
        else
        {
            let payModeItem = parse(this.resourceConfig,'payModeTemplate',data);
            registerRet = await this.create(payModeItem);
            console.log(`PayModeTemplateBusiness->registerPayModeTemplate payMode:${data.name}  register success`);
        }
        return registerRet;
    }



}


module.exports = PayModeTemplateBusiness;


