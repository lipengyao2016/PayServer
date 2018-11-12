/**
 * Created by Administrator on 2016/9/25.
 */
const expect = require('chai').expect;
const _ = require('lodash');
const common = require('./common');
const url = common.url;
const utils = require('../common/utils');
const request = require('common-request').request;


describe('payOrders Test Case:',()=>{
    let payOrdersTestCase =
        {
            payModeUUID:'qef9X3CqNClIWrU8kBV5cw',
            payer:'A',
            payee:'http://192.168.7.188:6005/api/v1.0.0/shops/82TaIejHrZp4aHaM9hG2DQ',
            payAmount:1,
          //  tractionNo:'12457',
            clientPayNo:'201810160005',
            //orderStartAt:'2018-2-5 12:01:05',
            //orderExpiredAt:{type:'time'},
            //notifyUrl:'http://localhost:7000/payInfo',
            clientExtraParams:{/*orderNo:'P201807050001',*/ /*orderAmount:210.0,receiveableAmount:210.0*/ },
            payParams:{
              /*  signAccounterUUID:'ega7hvZz0RBw8TQNFFZN2w',
                signPersonUUID:'9oNEJPMAqmVivbk4hioNxQ',*/

                signAccounterUUID:'LyWGmvRHlDsH4zYqvND2Gg',
                signPersonUUID:'pm0gI4OR9w6OOEmCoO5ELg',

                //"payBarCode": "280215602412250221",
            },
       };

    


    let ownerUUID = 'AppUUIDForTestCase';
    let payOrdersUUID = null;

    let tenantUUID = null;
    let tenantURL = null;

    tenantURL = url /*+ '/directories' + '/zbDG5Ul3MHzHOEBFYyIalQ' + '/payOrdersPackages' + '/n97eIgDCIO6wecGkvc19UQ'*/ ;

    //payOrdersUUID = 'mCw73gturM33O1WiZEZBdA';

    describe('create test case:',  ()=>{
        it('success create an payOrders',  ()=> {
            //this.timeout(0);

            return request.post(`${url}/pay`,payOrdersTestCase).then( ( {statusCode, body, headers, request} )=>{

                console.log('payOrders test  create  body:'+JSON.stringify(body,null,2));

                expect(statusCode).to.equal(200);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');

                /*payOrdersUUID = utils.getResourceUUIDInURL(body.href,'payOrders');
                console.log('payOrders test  create  payOrdersUUID  :' + payOrdersUUID );*/
            });
        });

        it('success batchPay an payOrders',  ()=> {
            //this.timeout(0);
            let batchPayData = [
                {
                    payModeUUID:'qef9X3CqNClIWrU8kBV5cw',
                    payer:'A',
                    payee:'http://192.168.7.188:6005/api/v1.0.0/shops/82TaIejHrZp4aHaM9hG2DQ',
                    payAmount:1,
                    //  tractionNo:'12457',
                    clientPayNo:'201810160001',
                    //orderStartAt:'2018-2-5 12:01:05',
                    //orderExpiredAt:{type:'time'},
                    //notifyUrl:'http://localhost:7000/payInfo',
                    clientExtraParams:{/*orderNo:'P201807050001',*/ /*orderAmount:210.0,receiveableAmount:210.0*/ },
                    payParams:{
                          /*signAccounterUUID:'ega7hvZz0RBw8TQNFFZN2w',
                          signPersonUUID:'9oNEJPMAqmVivbk4hioNxQ',*/

                         signAccounterUUID:'LyWGmvRHlDsH4zYqvND2Gg',
                         signPersonUUID:'pm0gI4OR9w6OOEmCoO5ELg',
                    },
                },
                {
                    payModeUUID:'qef9X3CqNClIWrU8kBV5cw',
                    payer:'A',
                    payee:'http://192.168.7.188:6005/api/v1.0.0/shops/82TaIejHrZp4aHaM9hG2DQ',
                    payAmount:1,
                    //  tractionNo:'12457',
                    clientPayNo:'201810160002',
                    //orderStartAt:'2018-2-5 12:01:05',
                    //orderExpiredAt:{type:'time'},
                    //notifyUrl:'http://localhost:7000/payInfo',
                    clientExtraParams:{/*orderNo:'P201807050001',*/ /*orderAmount:210.0,receiveableAmount:210.0*/ },
                    payParams:{
                        /*  signAccounterUUID:'ega7hvZz0RBw8TQNFFZN2w',
                          signPersonUUID:'9oNEJPMAqmVivbk4hioNxQ',*/

                         signAccounterUUID:'LyWGmvRHlDsH4zYqvND2Gg',
                         signPersonUUID:'pm0gI4OR9w6OOEmCoO5ELg',
                    },
                }
            ];

            return request.post(`${url}/batchPay`,{batchPayData:batchPayData}).then( ( {statusCode, body, headers, request} )=>{

                console.log('batchPay test  create  body:'+JSON.stringify(body,null,2));

                expect(statusCode).to.equal(200);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');
            });
        });

    });
    describe('retrieve test case:', function () {
        it('success retrieve an payOrders  ', function () {
            //this.timeout(0);

            return request.get(`${tenantURL}/payOrders/${payOrdersUUID}`,{}).then( ( { statusCode,body,headers,request} )=>{

                console.log('payOrders test retrieve   :' + JSON.stringify(body,null,2));

                expect(statusCode).to.equal(200);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');
                //expect(uriReg.ownerURIReg.test(res.headers['location'])).to.be.true;
               // expect(body.name).to.equal(payOrdersTestCase.name);
            });
        });
    });
    describe('update test case:', function () {
        it('success update an payOrders', function () {
            //this.timeout(0);
            payOrdersUUID = 'b3w3952HMJxKze8vyDfX7A';
            let updateInfo = {
                  status:'payed',
                  //"payAmount": 70,
                "thirdPayNo": 'WX245176121',
                "resultCode": 'sucess',
            };

            return request.post(`${tenantURL}/payOrders/${payOrdersUUID}`,updateInfo).then( ( { statusCode,body,headers,request} )=>{

                console.log('payOrders test update   :' + JSON.stringify(body,null,2));

                expect(statusCode).to.equal(200);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');
                expect(body.description).to.equal(updateInfo.description);
                //expect(uriReg.ownerURIReg.test(res.headers['location'])).to.be.true;
            });
        });

    });
    describe('list test case:', function () {


        it('list payOrders  ', function () {
            //this.timeout(0);
            let qs = {
               // name:'*payOrder*',
                //uuid:['3UCHOeNl5tVmN83fkyQfNQ','V1bg0v8SlXKs8OXApykNzg'],
                /*               offset:0,
                               limit:1,
                               createdAt:'[,2018-04-18 18:13:28]'*/
                //payOrdersPackageUUID:'xAdNYJaUdyyXyFmd1rFkUg',
               // orderBy:'uiOrder DESC',
              /*  ownerHref:'http://localhost:5000/api/v1.0.0/applications/BQZNqVpEbFxyZ7ayW7x2yA',
                expand:'operators',*/
                clientPayNo:'201808161002',
            };
            return request.get(`${url}/payOrders`,qs).then( ( { statusCode,body,headers,request} )=>{

                console.log('payOrders test list   :' + JSON.stringify(body,null,2));

                expect(statusCode).to.equal(200);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');
                //expect(uriReg.ownerURIReg.test(res.headers['location'])).to.be.true;
            });
        });



    });

    describe('delete test case:',()=>{
        it('success delete an payOrders', function () {
            //this.timeout(0);
           /* return request.delete(`${tenantURL}/payOrders/${payOrdersUUID}`).then( ( { statusCode,body,headers,request} )=>{
                expect(statusCode).to.equal(204);
            });*/
        });
    });
});