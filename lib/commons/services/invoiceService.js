const request = require('request-promise');
const GetInvoiceURL = '/mtapi/base/services/search/{companyId}/objects';
const CreateUpdateInvoiceURL='/mtapi/base/services/bill/';
const createSubsidiaryURL = "/mtapi/base/services/subsidiary/{companyId}";
const createClassificationURL = '/mtapi/base/services/classification/{companyId}';
const CreateInvoicePaymentURL='/mtapi/base/services/payment/{companyId}';
const createPaymentMethodURL='/mtapi/base/services/pm/{companyId}'
const util = require("../utility.js");

module.exports = {

    getInvoiceList: async function (cfg, etag) {
        var apiCredentials = cfg.username + ":" + cfg.password;
        var fullUrl = cfg.endPointURL + GetInvoiceURL.replace('{companyId}', cfg.companyId);
        const requestOptions = {
            uri: `${fullUrl}`,
            headers: {
                'If-Match': etag,
                'Content-Type': 'application/json'
            },
            body: { "view": "BILL" },
            json: true
        };

        return await request.post(requestOptions).then(util.autoParse).catch(util.error);
    },
    createInvoice: async function (msg,cfg, etag) {
        var apiCredentials = cfg.username + ":" + cfg.password;
        
        var fullUrl='';

        if(msg.body.bill.id)
        {
         fullUrl = cfg.endPointURL + CreateUpdateInvoiceURL;
        }
        else{

        fullUrl = cfg.endPointURL + CreateUpdateInvoiceURL + cfg.companyId;
      
         }

        const requestOptions = {
            uri: `${fullUrl}`,
            headers: {
                'If-Match': etag,
                'Content-Type': 'application/json'
            },
            body: msg.body,
            json: true
        };

       console.log("msg.body" + JSON.stringify(msg.body));

        if(msg.body.bill.id)
        {
            console.log("Update");
        return await request.put(requestOptions).then(util.autoParse).catch(util.error);
        }
        else{
            console.log("Create");
        return await request.post(requestOptions).then(util.autoParse).catch(util.error);
        }
    },
    createSubsidiary: async function (body,cfg, etag) {
        var apiCredentials = cfg.username + ":" + cfg.password;
        var fullUrl = cfg.endPointURL + createSubsidiaryURL.replace('{companyId}', cfg.companyId);
        const requestOptions = {
           uri: `${fullUrl}`,
             headers: {
               'If-Match': etag,
               'Content-Type': 'application/json'
           },
           body: body,
           json: true
       };
       return await request.post(requestOptions).then(util.autoParse).catch(util.error);
   },
   createPaymentMethod: async function (body,cfg, etag) {
    var apiCredentials = cfg.username + ":" + cfg.password;
    var fullUrl = cfg.endPointURL + createPaymentMethodURL.replace('{companyId}', cfg.companyId);
    const requestOptions = {
       uri: `${fullUrl}`,
         headers: {
           'If-Match': etag,
           'Content-Type': 'application/json'
       },
       body: body,
       json: true
   };
   return await request.post(requestOptions).then(util.autoParse).catch(util.error);
  },
   createClassification: async function (msg,cfg, etag) {

       var apiCredentials = cfg.username + ":" + cfg.password;
       var fullUrl = cfg.endPointURL + createClassificationURL.replace('{companyId}', cfg.companyId);
      
       console.log("ClassBody"+ JSON.stringify(msg.body));
      
       const requestOptions = {
           uri: `${fullUrl}`,
           headers: {
               'If-Match': etag,
               'Content-Type': 'application/json'
           },
           body: msg.body,
           json: true
       };
       return await request.post(requestOptions).then(util.autoParse).catch(util.error);
   },
   createInvoicePayment: async function (msg,cfg, etag) {
    var apiCredentials = cfg.username + ":" + cfg.password;
    var fullUrl = cfg.endPointURL + CreateInvoicePaymentURL.replace('{companyId}', cfg.companyId);
    const requestOptions = {
        uri: `${fullUrl}`,
        headers: {
            'If-Match': etag,
            'Content-Type': 'application/json'
        },
        body: msg.body,
        json: true
    };
    return await request.post(requestOptions).then(util.autoParse).catch(util.error);
}
};