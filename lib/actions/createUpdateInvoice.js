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
async function processAction(msg, cfg) {

    console.log("Callled");
    console.log("msgBody" + JSON.stringify(msg.body));
    const self = this;

    let invoice = msg.body;
    
    var loginResult = await accountService.login(cfg);

    if (utility.isEmpty(loginResult)) return;

    if (utility.isEmpty(loginResult.headers['etag'])) return;
    var etag = loginResult.headers['etag']; 

    if (!utility.isEmpty(invoice)) {

            let invoiceBody = await GetMTInvoiceBody(cfg, etag, invoice);

            if (utility.isEmpty(invoiceBody)) return;

            var response = await invoiceService.createUpdateInvoice(invoiceBody, cfg, etag);

        if (!utility.isEmpty(response)) {


            console.log("invoiceCreated" + JSON.stringify(response));

                self.emit('data', messages.newMessageWithBody(response));
               self.emit('end');
            }                      
    }
    
}
async function GetMTInvoiceBody(cfg, etag, invoice) {

    let billBody;
    let billId = await GetSearchQuery("BILL", cfg, etag, invoice.InvoiceID);
    let termId = await GetSearchQuery("TERMS", cfg, etag, invoice.AcctTermID);
    let classificationId = await GetSearchQuery("CLASS", cfg, etag, invoice.PaymentCCID);
    let vendorId = await GetSearchQuery("VENDOR", cfg, etag, invoice.PayeeID);

    if (utility.isEmpty(termId) || utility.isEmpty(classificationId) || utility.isEmpty(vendorId)) return null;

    if (!utility.isEmpty(invoice.LineItems)) {
        billBody = {
            bill:
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
                    "id": invoice.ClientID
                },
                "dueDate": invoice.DueDate,
                "transactionDate": invoice.InvoiceDate,
                "invoiceNumber": invoice.InvoiceNumber,
                "amount": {
                    "amount": 0// we are updating this amount value from total line amount
                },
                "balance": {
                    "amount": 0 //we are updating this amount value from total line amount
                },
                "poNumber": invoice.PONumber, 
                "vendor": {
                    "id": vendorId
                },
                expenses: []
            }
        }

        let totalAmount = 0;
        for (var i = 0; i < invoice.LineItems.length; i++) {

            let CostCenterID = await GetSearchQuery("CLASS", cfg, etag, invoice.LineItems[i].CostCenterID);
            let ExpenseGLAccountID = await GetSearchQuery("GLACCOUNT", cfg, etag, invoice.LineItems[i].ExpenseGLAccountID);
            let calculatedAmount = (invoice.LineItems[i].Amount * 100);

            let line = {
                "classification": {
                    "id": CostCenterID
                },
                "glAccount": {
                    "id": ExpenseGLAccountID
                },
                "amountDue": {
                    "amount": calculatedAmount
                },
                "memo": invoice.LineItems[i].Description
            }
            totalAmount += calculatedAmount;
            billBody.bill.expenses.push(line);

        }
        billBody.bill.amount.amount = totalAmount;
        billBody.bill.balance.amount = totalAmount;

        return billBody;
    }
    return "";
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
    if (!utility.isEmpty(result))
    {
      if (result.count > 0)
      { 
        return result.entities[0].id;
      }
    }
    return ""; 
}