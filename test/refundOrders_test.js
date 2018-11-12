/**
 * Created by Administrator on 2016/9/25.
 */
const expect = require('chai').expect;
const _ = require('lodash');
const common = require('./common');
const url = common.url;
const utils = require('../common/utils');
const request = require('common-request').request;


describe('refundOrders Test Case:',()=>{
    let refundOrdersTestCase =
     {
        // clientPayNo:'201807110145',
        // payOrderUUID:'NwRvivbTSpVCPQRUrzsdlg',
         payTractionNo:'1539680324979929',
        // refundAmount:50.0,
         clientRefundNo:'T201810160006',
        // isCancel:1,
        // notifyUrl:'http://localhost:7000/refundInfo',

         clientExtraParams:
         {
             orderNo:'P201807050001',
             orderAmount:210.0,
             receiveableAmount:210.0,
         },
     };



    let ownerUUID = 'AppUUIDForTestCase';
    let refundOrdersUUID = null;

    let tenantUUID = null;
    let tenantURL = null;

    tenantURL = url  ;

    //refundOrdersUUID = 'mCw73gturM33O1WiZEZBdA';

    describe('create test case:',  ()=>{
        it('success create an refundOrders',  ()=> {
            //this.timeout(0);

            return request.post(`${url}/refund`,refundOrdersTestCase).then( ( {statusCode, body, headers, request} )=>{

                console.log('refundOrders test  create   body:'+JSON.stringify(body,null,2));

                expect(statusCode).to.equal(200);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');

              /*  refundOrdersUUID = utils.getResourceUUIDInURL(body.href,'refundOrders');

                console.log('refundOrders test  create  refundOrdersUUID  :' + refundOrdersUUID );*/
            });
        });


        it('success batchRefund an refundOrders',  ()=> {
            //this.timeout(0);
            let batchRefundData = [
                {
                    clientRefundNo:'T201810160001',
                    payTractionNo:'1539669840030298',
                },
                {
                    clientRefundNo:'T201810160002',
                    payTractionNo:'1539669840040491',
                }
            ];

            return request.post(`${url}/batchRefund`,{batchRefundData:batchRefundData}).then( ( {statusCode, body, headers, request} )=>{

                console.log('batchRefund test  create  body:'+JSON.stringify(body,null,2));

                expect(statusCode).to.equal(200);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');
            });
        });
        


    });
    describe('retrieve test case:', function () {
        it('success retrieve an refundOrders  ', function () {
            //this.timeout(0);

            return request.get(`${tenantURL}/refundOrders/${refundOrdersUUID}`,{}).then( ( { statusCode,body,headers,request} )=>{

                console.log('refundOrders test retrieve   :' + JSON.stringify(body,null,2));

                expect(statusCode).to.equal(200);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');
                //expect(uriReg.ownerURIReg.test(res.headers['location'])).to.be.true;
               // expect(body.name).to.equal(refundOrdersTestCase.name);
            });
        });
    });
    describe('update test case:', function () {
        it('success update an refundOrders', function () {
            //this.timeout(0);
            refundOrdersUUID = '0l30t2rrLfypVi7anyc9ag';
            let updateInfo = {
                status:'refunded',
                "thirdRefundNo": 'WXT245174122',
                "resultCode": 'sucess',
            };

            return request.post(`${tenantURL}/refundOrders/${refundOrdersUUID}`,updateInfo).then( ( { statusCode,body,headers,request} )=>{

                console.log('refundOrders test update   :' + JSON.stringify(body,null,2));

                expect(statusCode).to.equal(200);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');
                expect(body.description).to.equal(updateInfo.description);
                //expect(uriReg.ownerURIReg.test(res.headers['location'])).to.be.true;
            });
        });



    });
    describe('list test case:', function () {


        it('list refundOrders  ', function () {
            //this.timeout(0);
            let qs = {
               // name:'*refundOrder*',
                //uuid:['3UCHOeNl5tVmN83fkyQfNQ','V1bg0v8SlXKs8OXApykNzg'],
                /*               offset:0,
                               limit:1,
                               createdAt:'[,2018-04-18 18:13:28]'*/
                //refundOrdersPackageUUID:'xAdNYJaUdyyXyFmd1rFkUg',
               // orderBy:'uiOrder DESC',
              /*  ownerHref:'http://localhost:5000/api/v1.0.0/applications/BQZNqVpEbFxyZ7ayW7x2yA',
                expand:'operators',*/
            };
            return request.get(`${url}/refundOrders`,qs).then( ( { statusCode,body,headers,request} )=>{

                console.log('refundOrders test list   :' + JSON.stringify(body,null,2));

                expect(statusCode).to.equal(200);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');
                //expect(uriReg.ownerURIReg.test(res.headers['location'])).to.be.true;
            });
        });



    });

    describe('delete test case:',()=>{
        it('success delete an refundOrders', function () {
            //this.timeout(0);
            return request.delete(`${tenantURL}/refundOrders/${refundOrdersUUID}`).then( ( { statusCode,body,headers,request} )=>{
                expect(statusCode).to.equal(204);
            });
        });

     /*   it('success batchDelete an refundOrders', function () {
            //this.timeout(0);

             return request.delete(`${tenantURL}/refundOrders/batchDelete`,{uuid:['8KdDL56QDf1tuK3E6rH3Mg','gSWYc46G8tqEYYiZ9842hA']}).then( ( { statusCode,body,headers,request} )=>{
                 expect(statusCode).to.equal(204);
             });
        });*/
    });
});