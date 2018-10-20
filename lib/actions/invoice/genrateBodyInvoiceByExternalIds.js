'use strict';
const MTService = require('../../MTService');
const Helper = require('../../Helper');
const { messages } = require('elasticio-node');

exports.process = async function ProcessAction(msg, cfg) {
   
    const instance = new MTService(cfg, this);
    let totalAmount = 0;
    let vendorCreditAmount = 0;
    var body = msg.body;
    var responce;


    body.bill.id = await GetSearchQuery(cfg, instance,"BILL", "bill_externalId==" + body.bill.externalId);
    body.bill.term.id = await GetSearchQuery(cfg,instance, "TERMS", "externalId==" + body.bill.term.id);
    body.bill.classification.id = await GetSearchQuery(cfg,instance, "CLASS", "dimension_externalId==" + body.bill.classification.id);
    body.bill.vendor.id = await GetSearchQuery(cfg,instance, "VENDOR", "vendor_externalId==" + body.bill.vendor.id);
    Validate(body.bill);
    for (var i = 0; i < body.bill.expenses.length; i++)
    {
        body.bill.expenses[i].classification.id = await GetSearchQuery(cfg,instance,"CLASS","dimension_externalId==" + body.bill.expenses[i].classification.id);
        body.bill.expenses[i].glAccount.id = await GetSearchQuery(cfg,instance,"GLACCOUNT","gl_account_number_externalId=="+body.bill.expenses[i].glAccount.id);
        let calculatedAmount = (body.bill.expenses[i].Amount * 100);
        if (invoice.LineItems[i].VendorCredit === true) {
            vendorCreditAmount += Math.abs(calculatedAmount);// We are using Math.ab() for negetive value to positive value
        }
        totalAmount += calculatedAmount;
    }
    body.bill.amount.amount = totalAmount;
    body.bill.balance.amount = totalAmount;

    if (Helper.isEmpty(body.bill.id) && vendorCreditAmount > 0) // Vendor credit only will create in the case of new bill posting
    {
        let vendorCreditBody =
        {
              "credit": {
                "transactionDate": invoice.InvoiceDate,
                "vendor": { "id": vendorId },
                "amount": { "amount": vendorCreditAmount },
                "currency": "USD",
                "externalId": invoice.InvoiceID
            }
        }
        let result = instance.makeRequest(`services/credit/${cfg.companyId}`, 'POST', vendorCreditBody);
        if (!Helper.isEmpty(result))
        {
         console.log("VendorCreditResult " + JSON.stringify(result));
        }
    }
    
    if (!Helper.isEmpty(msg.body.bill.id))
    {
        responce = await instance.makeRequest(`services/bill/${msg.body.bill.id}`, 'PUT', msg.body);
    } else {
        responce = await instance.makeRequest(`services/bill/${cfg.companyId}`, 'POST', msg.body);
    }
    this.emit('data', messages.newMessageWithBody(responce));
                 
};
async function GetSearchQuery(cfg, cfg,instance,view, query) {

    var body = {
        "view": view,
        "query": query
    }
    var result = await instance.makeRequest(`services/search/${cfg.companyId}/objects`, 'POST', body);
    if (!Helper.isEmpty(result))
    {
        if (Helper.count > 0) {
        return result.entities[0].id;
        }
    }
    return "";
}
function Validate(bill) {

    if (Helper.isEmpty(bill.term.id))
    {
    return new Error("Bill term id required");
    }
    if (Helper.isEmpty(bill.classification.id))
    {
    return new Error("Bill classification id required");
    }
    if (Helper.isEmpty(bill.vendor.id))
    {
    return new Error("Bill vendor id required");
    }
}
