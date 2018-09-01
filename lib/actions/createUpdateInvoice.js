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
        let invoice = msg.body.InvoiceDetails;
        let subsidiaryId = msg.body.SubsidiaryId;
        let invoiceBody; 

        if (!utility.isEmpty(invoice) && !utility.isEmpty(subsidiaryId)) {
            invoiceBody = await GetMTInvoiceBody(cfg, etag, invoice, subsidiaryId);
            console.log("body data" + JSON.stringify(invoiceBody));
        }

    
        
     
        //return invoiceService.createUpdateInvoice(msg.body, cfg, etag).then(function (response) {

        //    if (!utility.isEmpty(response)) {
        //        self.emit('data', messages.newMessageWithBody(response));
        //    }
        //self.emit('end');
        //});

      });
}

async function GetMTInvoiceBody(cfg, etag, invoice, SubsidiaryId) {

    let billBody;
    let billId = await GetSearchQuery("BILL", cfg, etag, invoice.InvoiceID);
    let termId = await GetSearchQuery("TERMS", cfg, etag, invoice.AcctTermID);
    let classificationId = await GetSearchQuery("CLASS", cfg, etag, invoice.PaymentCCID);
    let vendorId = await GetSearchQuery("VENDOR", cfg, etag, invoice.PayeeID);


    if (!utility.isEmpty(invoice.LineItems))
    {
        billBody = {
            "bill":
              {
                "id": billId,
                "externalId": invoice.InvoiceID,
                "term": {
                    "id": termId
                },
                "classification": {
                    "id": classificationId
                },
                "subsidiary": {
                    "id": SubsidiaryId
                },
                "dueDate": invoice.DueDate,
                "transactionDate": invoice.InvoiceDate,
                "amount": {
                    "amount": invoice.Amount
                },
                "balance": {
                    "amount": invoice.Amount
                },
                "vendor": {
                    "id": vendorId
                },
                "expenses": []
            }
        }

        invoice.LineItems.forEach(async lineItem =>
         {
            let CostCenterID = await GetSearchQuery("CLASS", cfg, etag, lineItem.CostCenterID);
            let ExpenseGLAccountID = await GetSearchQuery("GLACCOUNT", cfg, etag, lineItem.ExpenseGLAccountID);
            let line = {
                "classification": {
                    "id": CostCenterID
                },
                "glAccount": {
                    "id": ExpenseGLAccountID
                },
                "amountDue": {
                    "amount": lineItem.Amount
                },
                "memo": lineItem.Description
            }
          billBody.bill.expenses.push(line);

        });
    }
    return billBody;
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

           
    }
    if (!utility.isEmpty(result.entities)) { 

        console.log("result" + JSON.stringify(result));
        return result.entities[0].id;

    }
    return ""; 
}