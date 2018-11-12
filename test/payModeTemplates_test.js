/**
 * Created by Administrator on 2016/9/25.
 */
const expect = require('chai').expect;
const _ = require('lodash');
const common = require('./common');
const url = common.url;
const utils = require('../common/utils');
const request = require('common-request').request;


describe('payModeTemplates Test Case:',()=>{
    let payModeTemplatesTestCase = {
        payTemplateId:'4CE44A21-68DA-4ADA-B7EE-371187327F75',
        name:'银联',
        checkEnvUrl:'',
       // payUrl:'http://192.168.7.6:6008/api/v1/signAccountRecords',
        description:'银联支付',
    };

    let registerPayModeTemplatesTestCase = {
        uuid:'bws5eT5lXi9PrhA73uKReA',
        payTemplateId:'4CE44A21-68DA-4ADA-B7EE-371187327F75',
        name:'银联',
        checkEnvUrl:'',
        payUrl:'',
        description:'银联支付',
    };


    let applicationUUID = 'AppUUIDForTestCase';
    let payModeTemplatesUUID = null;

    let tenantUUID = null;
    let tenantURL = null;

    tenantURL = url ;

   // payModeTemplatesUUID = 'n6wjFnfhtA46MlO1hQWjIA';

    describe('create test case:',  ()=>{
        it('success create an payModeTemplates',  ()=> {
            //this.timeout(0);

            return request.post(`${tenantURL}/payModeTemplates`,payModeTemplatesTestCase).then( ( {statusCode, body, headers, request} )=>{
                expect(statusCode).to.equal(201);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');

                payModeTemplatesUUID = utils.getResourceUUIDInURL(body.href,'payModeTemplates');

                console.log('payModeTemplatess test  create  payModeTemplatesUUID  :' + payModeTemplatesUUID +
                    ' body:'+JSON.stringify(body,null,2));
            });
        });


        it('success registerPayModeTemplate an payModeTemplates',  ()=> {
            //this.timeout(0);

            return request.post(`${tenantURL}/registerPayModeTemplate`,registerPayModeTemplatesTestCase).then( ( {statusCode, body, headers, request} )=>{
                expect(statusCode).to.equal(200);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');

                console.log('payModeTemplatess test  registerPayModeTemplate   body:'+JSON.stringify(body,null,2));
            });
        });


    });
    describe('retrieve test case:', function () {
        it('success retrieve an payModeTemplates  ', function () {
            //this.timeout(0);

            return request.get(`${tenantURL}/payModeTemplates/${payModeTemplatesUUID}`,{}).then( ( { statusCode,body,headers,request} )=>{

                console.log('payModeTemplatess test retrieve   :' + JSON.stringify(body,null,2));

                expect(statusCode).to.equal(200);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');
                //expect(uriReg.applicationURIReg.test(res.headers['location'])).to.be.true;
               // expect(body.name).to.equal(payModeTemplatesTestCase.name);
            });
        });
    });
    describe('update test case:', function () {
        it('success update an payModeTemplates', function () {
            //this.timeout(0);

            let updateInfo = {
                description : 'bbb descript',
            };

            return request.post(`${tenantURL}/payModeTemplates/${payModeTemplatesUUID}`,updateInfo).then( ( { statusCode,body,headers,request} )=>{

                console.log('payModeTemplatess test update   :' + JSON.stringify(body,null,2));

                expect(statusCode).to.equal(200);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');
                expect(body.description).to.equal(updateInfo.description);
                //expect(uriReg.applicationURIReg.test(res.headers['location'])).to.be.true;
            });
        });
    });
    describe('list test case:', function () {
        it('list payModeTemplatess  ', function () {
            //this.timeout(0);
            let merchantLists = [
                'RQZNqVpEbFxyZ7ayW7x2yA',
                'PQZNqVpEbFxyZ7ayW7x2yA'];
            let qs = {
               // name:'*good*',
                //uuid:['3UCHOeNl5tVmN83fkyQfNQ','V1bg0v8SlXKs8OXApykNzg'],
                /*               offset:0,
                               limit:1,
                               createdAt:'[,2018-04-18 18:13:28]'*/
               // ownerHref:'http://localhost:5000/api/v1.0.0/applications/AQZNqVpEbFxyZ7ayW7x2yA',
            };
            return request.get(`${tenantURL}/payModeTemplates`,qs).then( ( { statusCode,body,headers,request} )=>{

                console.log('payModeTemplatess test list   :' + JSON.stringify(body,null,2));

                expect(statusCode).to.equal(200);
                expect(headers['content-type']).to.equal('application/json; charset=utf-8');
                //expect(uriReg.applicationURIReg.test(res.headers['location'])).to.be.true;
            });
        });
    });

    describe('delete test case:',()=>{
        it('success delete an payModeTemplates', function () {
            //this.timeout(0);
           // payModeTemplatesUUID = 'Zdw5JWKKDYXVcPD8ErNOTw';
          /*  return request.delete(`${tenantURL}/payModeTemplates/${payModeTemplatesUUID}`).then( ( { statusCode,body,headers,request} )=>{
                expect(statusCode).to.equal(204);
            });*/
        });
    });
});