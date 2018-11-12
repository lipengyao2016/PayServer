const _ = require('lodash');
const moment = require('moment');
const devUtils = require('develop-utils');
const restRouterModel = require('rest-router-model');
let BaseBusiness = restRouterModel.BaseBusiness;
let getSchema = restRouterModel.getSchema;
const inflection = require( 'inflection' );
const cacheAble = require('componet-service-framework').cacheAble;
let parse = restRouterModel.parse;
const utils = require('componet-service-framework').utils;
const request = require('common-request').request;


class NotifyClient  {

    constructor()
    {

    }

    async notify(notifyUrl,tractionNo,clientPayNo, thirdPayNo, status) {
        let bRet = false;
        let externalNotifyUrl = notifyUrl;
        if (!_.isEmpty(externalNotifyUrl)) {
            let notifyRes = await request.post(externalNotifyUrl, {
                tractionNo: tractionNo,
                clientPayNo: clientPayNo,
                thirdPayNo: thirdPayNo ? thirdPayNo : '',
                status: status,
            });
            if (notifyRes.statusCode == 200) {
                console.log('NotifyClient->notify  success,externalNotifyUrl:' + externalNotifyUrl
                    + ',notifyRes:' + JSON.stringify(notifyRes.body, null, 2));
                bRet = true;

            }
            else {
                let errorData = 'NotifyClient->notify  failed error!!!' +
                    ' error:' + JSON.stringify(notifyRes.body, null, 2);
                console.error(errorData);
                bRet = false;
            }
        }
        return bRet;
    }
}

exports.NotifyClient = NotifyClient;
exports.notifyClient = new NotifyClient();