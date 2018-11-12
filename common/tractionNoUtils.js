const moment = require('moment');
const _ = require('lodash');
const utils = require('componet-service-framework').utils;
const redis = require('./redis');

// UUID操作工具集
exports.createTranctionNo = (firstType)=>{
    let dateTimestamp = new Date().getTime() + '';
    console.log('dateTime:' + dateTimestamp);

    let rand = _.pad(_.random(0,999),3,'0');
    console.log('rand:'+rand);

    let dateStr =  dateTimestamp.substring(1)+rand;

    return firstType + dateStr;
};


exports.createRedisOrderNo =async (firstType)=>{
    let date = firstType +  utils.getDateStr(new Date(),false);

    //console.log('date:' + date);
    let curSeq,initSeq = 50;
    let setRet = await  redis.set(date,initSeq,'EX',60 * 60 * 24,'NX');

    if(setRet == 'OK')
    {
        curSeq = initSeq;
    }
    else
    {
        curSeq = await redis.incr(date);
    }

    let rand = _.padStart(curSeq,4,'0');
    //console.log('rand:'+rand);

    let dateStr =  date+rand;

    return  dateStr;
};

/*
for(let i = 0;i < 1000;i++)
{
    exports.createRedisOrderNo('A').then(data=>{
        console.log(data);
    });
}
*/

