/**
 * Copyright(C),
 * FileName:  redis.js
 * Author: sxt
 * Version: 1.0.0
 * Date: 2016/3/30  10:27
 * Description:
 */

"use strict";
var config = require('../config/config');
var Redis = require('ioredis');

var client = new Redis({
    host : config.redis.host,
    port : config.redis.port,
    db : config.redis.db,
    password : config.redis.password
});

client.on('error', function(err) {
    console.log(err);
});

module.exports = client;




let key = 'PayDataLock33';

let value = 'hello';


/*client.hmset(key,'name','lisi2','age',29,'addr','shanghai3');

client.hmget(key,'name','age','addr').then(data=>
{
    console.log(data);
});*/

/*
client.set(key, 'hello,data');
client.expire(key,50 *1000);
client.get(key).then(data=>{
    console.log(`get data:${data}`);
})*/

//client.setex(key,500*1000,100);
/*client.incr(key);
client.incr(key);*/
/*client.decr(key);
;*/

/*client.set(key,value,'PX',50 * 1000,'NX').then(data=>{
    console.log(`v1 data:${data}`);
})*/

/*client.rpush('list1','foo').then(data=>{
    console.log(`v1 data:${data}`);
})

client.rpush('list1','hello').then(data=>{
    console.log(`v1 data:${data}`);
})

client.rpush('list1','world').then(data=>{
    console.log(`v1 data:${data}`);
})*/

/*setInterval(function () {

    client.brpoplpush('list1','recver',2).then(data=>{
        console.log(`v1 data:${data}`);
    })
    //console.log('check brpop end.');

},1000)*/

/*
client.sadd('set1','foo','hello','world').then(data=>{
    console.log(`v1 data:${data}`);
})*/

/*
client.smembers('set1').then(data=>{
    console.log(`v1 data:${data}`);
})

client.spop('set1').then(data=>{
    console.log(`v1 data:${data}`);
})
*/

/*client.zadd('sortset1',4,'ni',5,'shi',6,'shui').then(data=>{
    console.log(`v1 data:${data}`);
})

client.zrange('sortset1',0,-1,'WITHSCORES').then(data=>{
    console.log(`v1 data:${data}`);
})*/


/*client.subscribe('mechat').then(data=>{
    console.log(`v1 data:${data}`);
})

client.on("message", function (channel, message) {
    console.log("recv msg:" + message);

});*/


/*
client.zremrangebyrank('sortset1',0,1).then(data=>{
    console.log(`v1 data:${data}`);
})
*/




console.log('set redis end..');


/*client.defineCommand('releaseLock', {
    numberOfKeys: 1,
    lua: 'if redis.call(\'get\', KEYS[1]) == ARGV[1] then return redis.call(\'del\', KEYS[1]) else return 0 end'}
    );


client.releaseLock(key,value ).then(data=>{
   console.log('releaseLock data:' +data);
});*/
