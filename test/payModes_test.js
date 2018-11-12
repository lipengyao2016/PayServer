/**
 * Created by Administrator on 2016/9/25.
 */
const expect = require('chai').expect;
const _ = require('lodash');
const common = require('./common');
const url = common.url;
const utils = require('../common/utils');
const request = require('common-request').request;


describe('payModes Test Case:',()=>{
    let payModesTestCase =
        {
            //merchantHref:'http://192.168.7.188:6004/api/v1.0.0/merchants/eLzwsgnlWpZN8xtvz0qgvw',
            merchantHref:'http://192.168.7.188:6005/api/v1.0.0/shops/89TaIejHrZp4aHaM9hG2DQ',
            payTemplateId:'3BEAF650-A067-11E8-A545-87065760276A',
          // name:'会员卡记账支付',
            isOpened:1,
            uiOrder:4,
            isFastPay:1,
    };



    let ownerUUID = 'AppUUIDForTestCase';
    let payModesUUID = null;

    let tenantUUID = null;
    let tenantURL = null;

    tenantURL = url /*+ '/directories' + '/zbDG5Ul3MHzHOEBFYyIalQ' + '/payModesPackages' + '/n97eIgDCIO6wecGkvc19UQ'*/ ;

    //payModesUUID = 'mCw73gturM33O1WiZEZBdA';

    describe('create test case:',  ()=>{
        it('success create an payModes',  ()=> {
            //this.timeout(0);

            return request.post(`${url}/payModes`,payModesTestCase).then( ( {statusCode, body, headers, request} )=>{

                console.log('payModes test  create  body:'+JSON.stringify(body,null,2));

                expect(statusCode).to.equal(201);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');

                payModesUUID = utils.getResourceUUIDInURL(body.href,'payModes');


            });
        });

        it('success create an orderNo',  ()=> {
            //this.timeout(0);

            return request.post(`${url}/orderNo`,{}).then( ( {statusCode, body, headers, request} )=>{

                console.log('payModes test  orderNo  body:'+JSON.stringify(body,null,2));

                expect(statusCode).to.equal(200);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');



            });
        });





    });
    describe('retrieve test case:', function () {
        it('success retrieve an payModes  ', function () {
            //this.timeout(0);

            return request.get(`${tenantURL}/payModes/${payModesUUID}`,{}).then( ( { statusCode,body,headers,request} )=>{

                console.log('payModes test retrieve   :' + JSON.stringify(body,null,2));

                expect(statusCode).to.equal(200);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');
                //expect(uriReg.ownerURIReg.test(res.headers['location'])).to.be.true;
               // expect(body.name).to.equal(payModesTestCase.name);
            });
        });
    });
    describe('update test case:', function () {
        it('success update an payModes', function () {
            //this.timeout(0);
           // payModesUUID = '7O1PwyXNuUOEXxvRfvbyrQ';
            let updateInfo = {
                isOpened:0,
                uiOrder:5,
            };

            return request.post(`${tenantURL}/payModes/${payModesUUID}`,updateInfo).then( ( { statusCode,body,headers,request} )=>{

                console.log('payModes test update   :' + JSON.stringify(body,null,2));

                expect(statusCode).to.equal(200);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');
            });
        });

    });
    describe('list test case:', function () {


        it('list payModes  ', function () {
            //this.timeout(0);
            let qs = {
               // name:'*payMode*',
                //uuid:['3UCHOeNl5tVmN83fkyQfNQ','V1bg0v8SlXKs8OXApykNzg'],
                /*               offset:0,
                               limit:1,
                               createdAt:'[,2018-04-18 18:13:28]'*/
                //payModesPackageUUID:'xAdNYJaUdyyXyFmd1rFkUg',
               // orderBy:'uiOrder DESC',
              /*  ownerHref:'http://localhost:5000/api/v1.0.0/applications/BQZNqVpEbFxyZ7ayW7x2yA',
                expand:'operators',*/
              //merchantUUID:'mI2NDMoQRdnKCq01hAsLwQ',
                orderBy:'uiOrder desc',
               // expand:'payMode',
            };
            return request.get(`${url}/payModes`,qs).then( ( { statusCode,body,headers,request} )=>{

                console.log('payModes test list   :' + JSON.stringify(body,null,2));

                expect(statusCode).to.equal(200);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');
                //expect(uriReg.ownerURIReg.test(res.headers['location'])).to.be.true;
            });
        });


        it('listAllPayModes   ', function () {
            //this.timeout(0);
            let qs = {
                merchantUUID:'82TaIejHrZp4aHaM9hG2DQ',
                orderBy:'uiOrder asc',
              //  expand:'payMode',
            };
            return request.get(`${url}/listAllPayModes`,qs).then( ( { statusCode,body,headers,request} )=>{

                console.log('payModes test listAllPayModes   :' + JSON.stringify(body,null,2));

                expect(statusCode).to.equal(200);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');
                //expect(uriReg.ownerURIReg.test(res.headers['location'])).to.be.true;
            });
        });


    });

    describe('delete test case:',()=>{
        it('success delete an payModes', function () {
            //this.timeout(0);
           /* return request.delete(`${tenantURL}/payModes/${payModesUUID}`).then( ( { statusCode,body,headers,request} )=>{
                expect(statusCode).to.equal(204);
            });*/
        });

     /*   it('success batchDelete an payModes', function () {
            //this.timeout(0);

             return request.delete(`${tenantURL}/payModes/batchDelete`,{uuid:['8KdDL56QDf1tuK3E6rH3Mg','gSWYc46G8tqEYYiZ9842hA']}).then( ( { statusCode,body,headers,request} )=>{
                 expect(statusCode).to.equal(204);
             });
        });*/
    });
});