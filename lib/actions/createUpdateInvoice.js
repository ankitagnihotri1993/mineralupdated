"use strict";
const messages = require('elasticio-node').messages;
const _ = require("underscore");
const accountService = require("../commons/services/accountService.js");
const invoiceService = require("../commons/services/invoiceService.js");
const commonsService = require("../commons/services/commonsService.js");
const utility = require('../commons/utility.js');

exports.process = processAction;

/*** 
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values, such as endPointURL,apiKey,username,password 
 * @returns promise resolving a message to be emitted to the platform
 */
 function processAction(msg, cfg) {
    const self = this;
    return accountService.login(cfg).then(async function (response) {
        var etag = response.headers['etag'];
        console.log('etag ', etag);
        var invoice = msg.body;

        var billId;
        var termId;
        var classificationId;
        var vendorId;
        var glId;

        if (!utility.isEmpty(invoice))
        {

            billId = await GetSearchQuery("BILL", cfg, etag, invoice.InvoiceID);

            console.log("billId" + billId);

            termId = await GetSearchQuery("TERMS", cfg, etag, invoice.AcctTermID);
            console.log("billId" + termId);
          classificationId = await GetSearchQuery("CLASS", cfg, etag, invoice.PaymentCCID);
            console.log("classificationId" + classificationId);
            vendorId = await GetSearchQuery("VENDOR", cfg, etag, invoice.PayeeID);
            console.log("vendorId" + vendorId);
         
        }






        //self.emit('data', messages.newMessageWithBody(invoice));
       // self.emit('end');

        //return invoiceService.createUpdateInvoice(msg.body, cfg, etag).then(function (response) {

        //    if (!utility.isEmpty(response)) {
        //        self.emit('data', messages.newMessageWithBody(response));
        //    }
        //self.emit('end');
        //});

      });
}

async function GetSearchQuery(type, cfg, etag, id) {

    let result;
    let body;
    switch (type) {

        case "VENDOR":
            {

         body = {
            "view": "VENDOR",
            "query": "vendor_externalId==" + id
              }
              result = await commonsService.searchObjects(cfg, etag, body); 
            }
            break;
        case "TERMS":
            {
                body = {
                    "view": "TERMS",
                    "query": "externalId==" + id
              }
             result = await commonsService.searchObjects(cfg, etag, body);
            }
            break;
        case "CLASS":
            {
                 body ={
                    "view": "CLASS",
                    "query": "dimension_externalId==" + id
                }
                result = await commonsService.searchObjects(cfg, etag, body);
            }
            break
        case "GLACCOUNT":
            {
                body = {
                    "view": "GLACCOUNT",
                     "query": "gl_account_number_externalId==" + id
                }
                result = await commonsService.searchObjects(cfg, etag, body);

            }
            break
        case "BILL":
            {
                 body = {
                    "view": "BILL",
                    "query": "bill_externalId==" + id
                }
                result = await commonsService.searchObjects(cfg, etag, body);
            }
         break;
        default:
           break;

            if (!utility.isEmpty(result)) {

                console.log("result" + JSON.stringify( result));
            return result.entities[0].id;

            }
         return ""; 
    }
}