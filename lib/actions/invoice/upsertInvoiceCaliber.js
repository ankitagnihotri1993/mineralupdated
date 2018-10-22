'use strict';

const MTService = require('../../MTService');
const { messages } = require('elasticio-node');
const helper = require('../../helpers');

function Validate(bill) {
    if (helper.isEmpty(bill.term.id)) {
        return new Error("Term id is required");
    }
    if (helper.isEmpty(bill.classification.id)) {
        return new Error("Classification id is required");
    }
    if (helper.isEmpty(bill.vendor.id)) {
        return new Error("Vendor id is required");
    }
}
async function GetSearchQuery(cfg,instance,view, query) {
    var body = {
         "view": view,
         "query": query
     }
     var result = await instance.makeRequest(`services/search/${cfg.companyId}/objects`, 'POST', body);
     if (!helper.isEmpty(result))
     {
         if (helper.count > 0) {
         return result.entities[0].id;
         }
     }
     return "";
 }
exports.process = async function ProcessAction(msg, cfg) {

    const instance = new MTService(cfg, this);

    let invoice = msg.body;
    let billId = await GetSearchQuery(cfg, instance, "BILL", "bill_externalId==" + invoice.InvoiceID);
    let termId = await GetSearchQuery(cfg, instance, "TERMS", "externalId==" + invoice.AcctTermID);
    let classificationId = await GetSearchQuery(cfg, instance, "CLASS", "dimension_externalId==" + invoice.PaymentCCID);
    let vendorId = await GetSearchQuery(cfg, instance, "VENDOR", "vendor_externalId==" + invoice.PayeeID);

    var billBody = {
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

    Validate(billBody.bill);

    let totalAmount = 0;
    let vendorCreditAmount = 0;
    for (var i = 0; i < invoice.LineItems.length; i++) {
        let CostCenterID = await GetSearchQuery(cfg,instance,"CLASS","dimension_externalId==" 
        + invoice.LineItems[i].CostCenterID);
        let ExpenseGLAccountID = await GetSearchQuery(cfg,instance,"GLACCOUNT",
         "gl_account_number_externalId=="+invoice.LineItems[i].ExpenseGLAccountID);
        let calculatedAmount = (invoice.LineItems[i].Amount * 100);
        if (helper.isEmpty(ExpenseGLAccountID) || helper.isEmpty(CostCenterID)) continue;
        if (invoice.LineItems[i].VendorCredit === true) {
            vendorCreditAmount += Math.abs(calculatedAmount);// We are using Math.ab() for negetive value to positive value   
        }
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

    if (helper.isEmpty(billId) && vendorCreditAmount > 0) // Vendor credit only will create in the case of new bill posting
    {
        let vendorCreditBody = {
            "credit": {
                "transactionDate": invoice.InvoiceDate,
                "vendor": { "id": vendorId },
                "amount": { "amount": vendorCreditAmount },
                "currency": "USD",
                "externalId": invoice.InvoiceID
            }
        }
        let result = instance.makeRequest(`services/credit/${cfg.companyId}`, 'POST', vendorCreditBody);
        if (!helper.isEmpty(result))
        {
         console.log("VendorCreditResult " + JSON.stringify(result));
        }
    
    var responce = "";
    if (!helper.isEmpty(billBody.bill.id)) {
        responce = await instance.makeRequest(`services/bill/${billBody.bill.id}`, 'PUT', billBody);
    } else {
        responce = await instance.makeRequest(`services/bill/${cfg.companyId}`, 'POST', billBody);
    }
    this.emit('data', messages.newMessageWithBody(responce));
}
}


