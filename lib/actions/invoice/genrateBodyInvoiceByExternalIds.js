'use strict';
const MTService = require('../../MTService');
const { messages } = require('elasticio-node');

exports.process = async function ProcessAction(msg, cfg) {
    let query = '';
    let totalAmount = 0;
    let vendorCreditAmount = 0;
    var body = msg.body;

    body.bill.id = await GetSearchQuery(cfg, "BILL", "bill_externalId==" + body.bill.externalId);
    body.bill.term.id = await GetSearchQuery(cfg, "TERMS", "externalId==" + body.bill.term.id);
    body.bill.classification.id = await GetSearchQuery(cfg, "CLASS", "dimension_externalId==" + body.bill.classification.id);
    body.bill.vendor.id = await GetSearchQuery(cfg, "CLASS", "vendor_externalId==" + body.bill.vendor.id);

    for (var i = 0; i < body.bill.expenses.length; i++)
    {
        body.bill.expenses[i].classification.id = await GetSearchQuery("CLASS", cfg, "CLASS", "dimension_externalId==" + body.bill.expenses[i].classification.id);
        body.bill.expenses[i].glAccount.id = await GetSearchQuery("GLACCOUNT", cfg, body.bill.expenses[i].glAccount.id);
        let calculatedAmount = (body.bill.expenses[i].Amount * 100);
      
        if (invoice.LineItems[i].VendorCredit === true) {
            vendorCreditAmount += Math.abs(calculatedAmount);// We are using Math.ab() for negetive value to positive value
        }
        totalAmount += calculatedAmount;
     
    }

    body.bill.amount.amount = totalAmount;
    body.bill.balance.amount = totalAmount;

    if (utility.isEmpty(billId) && vendorCreditAmount > 0) // Vendor credit only will create in the case of new bill posting
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
        let vendorCreditResult = await invoiceService.createVendorCredit(vendorCreditBody, cfg, etag);
        if (!utility.isEmpty(vendorCreditResult)) {
            console.log("VendorCreditResult " + JSON.stringify(vendorCreditResult));
        }
    }



    if (msg.body.bill.id) {
        responce = await instance.makeRequest(`services/bill/${msg.body.bill.id}`, 'PUT', msg.body);
    } else {
        responce = await instance.makeRequest(`services/bill/${cfg.companyId}`, 'POST', msg.body);
    }

    this.emit('data', messages.newMessageWithBody(responce));
                 
};
async function GetSearchQuery(cfg, view, query) {
    const instance = new MTService(cfg, this);
    body = {
        "view": view,
        "query": query
    }
    result = await instance.makeRequest(`services/search/${cfg.companyId}/objects`, 'POST', body);

    if (!utility.isEmpty(result)) {
        if (result.count > 0) {
            return result.entities[0].id;
        }
    }
    return "";
}
function validate(type,id) {

    if (utility.isEmpty())

}
