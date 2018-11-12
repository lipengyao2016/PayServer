"use strict";
const fs = require('fs');
const _ = require('lodash');
let externHost = 'localhost';

let config = {
    //服务器配置
    server: {
        domain : '192.168.7.188',
        port : 6009,
    },
    //debug 为true时，用于本地调试
    debug : false,
    //接口统计开关
    record : false,
    // knex配置
    knex: {
        client: 'mysql',
        connection: {
            host : '192.168.7.6',
            user : 'root',
            password : '123456',
            database : 'PayServerDB',
            port : 3306
        },
        pool : { min : 0, max : 10},
    },
    isSendSMS: true,
    //JWT
    // jwt: {
    //     secret: '123456',
    //     public_key : fs.readFileSync(__dirname + '/../ssl/jwt_rsa/jwt_rsa_public_key.pem')
    // },
    signKey: 'eyJ1c2VyIjp7ImhyZWYiOiJodHRwOi8vMTkyLjE2OC43LjIwMjo1MDAzL2FwaS',
    //kafka
    kafka: {
        zkConnInfo: '192.168.7.166:2181',
        // host: '192.168.7.166',  // 192.168.7.166:2181, 192.168.7.167:2181, 192.168.7.168:2181
        // port: '2181'
    },
    //redis配置
    redis: {
        host : '192.168.7.150',
        port : 6379,
        db : 0,
        password : ''
    },


    cache : {
        // 缓存开关控制
        open : false,
        // 缓存失效时间,单位ms
        time : 1000,
    },



    rabbitmq:{
        host : '192.168.7.188',
        port : 5672,
        user : 'admin',
        password : 'admin',
        payInfo:{
            exchangeName : 'exchange_pay',
            exchangeType : 'direct',
            routeKey : 'pay_order',
            queueName : 'queue_pay',
        },
        refundInfo:{
            exchangeName : 'exchange_refund',
            exchangeType : 'direct',
            routeKey : 'refund_order',
            queueName : 'queue_refund',
        }
    },


    ThirdServerByCommonConfig: {
        SHOP_SERVER:'ShopServer',
    },

    ShopServer:{
        host: externHost,
        port: 6005
    },
    configServerUrl:'',

    eurekaServer:
        {
            host : '',
            port : 0,
        },

};

// 从全局上层CommonConfig中读取环境变量
try {
    const commonConfig = require('../../CommonConfig/serverConfig');
    let {server_domain=null,ThirdServer_domain=null,knex_connection=null,redis=null,kafkaConfig=null,configServerUrl=null}=commonConfig;

    if(server_domain){config.server.domain = server_domain;}
    if(ThirdServer_domain && config.ThirdServerByCommonConfig){
        config.ThirdServerByCommonConfig.map( key=>{
            config[key].host=ThirdServer_domain;
        } );
    }
    if( knex_connection && config.knex.connection ){
        Object.keys(knex_connection).map(key=>{
            config.knex.connection[key] = knex_connection[key];
        });
    }
    if (redis && config.redis){
        Object.keys(redis).map(key=>{
            config.redis[key] = redis[key];
        });
    }
    if ( kafkaConfig && config.kafka ){
        Object.keys(kafkaConfig).map(key=>{
            config.kafka[key] = kafkaConfig[key];
        });
    }
    if(configServerUrl && config.configServerUrl)
    {
        config.configServerUrl = configServerUrl;
    }
    console.log('The read common config. config:' + JSON.stringify(config));
}
catch(e) {
    console.warn('The common config does not exist!!!');
}



//从环境变量中覆盖配置参数，及默认优先使用环境变量参数
function readEnvParams( obj , prefix = null) {
    prefix = prefix ? prefix+'_' :'';
    Object.keys( obj ).map( key =>{
        let param = prefix+key;
        if( typeof obj[key] == 'object' ){
            readEnvParams( obj[key], param )
        }
        else {
            let env = param.toUpperCase();
            if( process.env[env] ){
                console.log(`Read ENV ${env}`);
                obj[key] = process.env[env];
            }
        }
    });
}
readEnvParams(config);

async  function readConfigServerParams() {

    if(!_.isEmpty(config.configServerUrl))
    {
        const apollConfig = require('apoll-config').apollConfig;
        const packageConfig = require('../package');
        console.log('read configServer URL from env configServerUrl:' + JSON.stringify(config.configServerUrl));
        return await  apollConfig.readConfigFromConfigServer(packageConfig.name,config.configServerUrl,config);
    }
}
config.readConfigServerParams = readConfigServerParams;

module.exports = config;