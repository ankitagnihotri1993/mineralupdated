"use strict";
const messages = require("elasticio-node").messages;
const accountService = require("../../commons/services/accountService.js");
const invoiceService = require("../../commons/services/invoiceService.js");
const commonsService = require("../../commons/services/commonsService.js");
const utility = require("../../commons/utility.js");

exports.process = processAction;

/***
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values, such as endPointURL,apiKey,username,password
 * @param snapshot save the current state of integration step for the future reference.
 * @returns promise resolving a message to be emitted to the platform
 */
async function processAction(msg, cfg, snapshot) {

    const self = this;
    let invoice = msg.body;
    var etag;
    try {
        snapshot = snapshot || {};
        if (utility.isEmpty(snapshot.etag)) {
            snapshot.etag = await utility.getEtag(accountService, cfg);
        }
        etag = snapshot.etag;

        if (!utility.isEmpty(invoice)) {

            // Get invoice body
            let invoiceBody = await GetMTInvoiceBody(cfg, etag, invoice);
            if (utility.isEmpty(invoiceBody)) return;
            // create/Update invoice in MT
            var response = await invoiceService.createUpdateInvoice(invoiceBody, cfg, etag);
            console.log("response Data "+JSON.stringify(response));
            self.emit("data", messages.newMessageWithBody(response));
        }
    }
   catch (ex) {
        
       throw new Error(ex);
    }
}
async function GetMTInvoiceBody(cfg, etag, invoice) {

    let billBody;
    let billId = await GetSearchQuery("BILL", cfg, etag, invoice.bill.externalId);
    
    if (!utility.isEmpty(invoice.bill.items)) {
        billBody = {
            bill:
            {
                "id": billId,
                "externalId": invoice.bill.externalId,
                "term": {
                    "id": invoice.bill.term.id
                },
                "dueDate":  invoice.bill.dueDate,
                "transactionDate": invoice.bill.transactionDate,
                "invoiceNumber": invoice.bill.InvoiceNumber,
                "amount": {
                    "amount": 0// we are updating this amount value from total line amount
                },
                "balance": {
                    "amount": 0 //we are updating this amount value from total line amount
                },
                "vendor": {
                    "id":  invoice.bill.vendor.id
                },
                items: []
            }
        }
        console.log("Data "+JSON.stringify(billBody));
        let totalAmount = 0;

        for (var i = 0; i < invoice.bill.items.length; i++) 
        {
            let costAmount = (invoice.bill.items[i].cost.amount);
            let itemQuantity = (invoice.bill.items[i].quantity.value);
            let amountDue = (invoice.bill.items[i].amountDue.amount);
            let companyItemId = await GetSearchQuery("ITEM", cfg, etag, invoice.bill.items[i].companyItem.id);
            let GLAccountID = await GetSearchQuery("GLACCOUNT", cfg, etag, invoice.bill.items[i].glAccount.id);
            let calculatedAmount = (invoice.bill.items[i].amount);

            let line = {
                "companyItem": {
                    "id": companyItemId
                },
                "quantity": {
                    "value": itemQuantity
                },
                "cost": { 
                    "amount": costAmount
                },
                "amountDue": {
                    "amount": amountDue
                },
                "glAccount": {  
                    "id": GLAccountID  
                },
                "description": invoice.bill.items[i].Description
            }
            totalAmount += calculatedAmount;
            billBody.bill.items.push(line);
        }

        billBody.bill.amount.amount = totalAmount;
        billBody.bill.balance.amount = totalAmount;
        console.log("Data1 "+JSON.stringify(billBody));
        return billBody;
    }
    return "";
}

async function GetSearchQuery(type, cfg, etag, id) {

    let result;
    let body;
    switch (type) {

        case "ITEM":
            {

                body = {
                    "view": "ITEM",
                    "query": "dimension_externalId ==" + id
                }
                cfg.companyId="b1437587-acf2-46fe-9846-739dbc996310";
                result = await commonsService.searchObjects(cfg, etag, body);
            }
            break;
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
    if (!utility.isEmpty(result)) {
        if (result.count > 0) {
            return result.entities[0].id;
        }
    }
    return "";
}