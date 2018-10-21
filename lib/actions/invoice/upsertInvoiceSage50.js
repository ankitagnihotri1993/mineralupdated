'use strict';
const MTService = require('../../MTService');
const { messages } = require('elasticio-node');
const helper = require('../../helpers');

exports.process = async function ProcessAction(msg, cfg) {
    const instance = new MTService(cfg, this);
    let invoice = msg.body;
    let billBody;
    let billId = await GetSearchQuery(cfg, instance, "BILL", "bill_externalId==" + invoice.bill.externalId);
    var billBody = {
        bill:
        {
            "id": billId,
            "externalId": invoice.bill.externalId,
            "term": {
                "id": invoice.bill.term.id
            },
            "dueDate": invoice.bill.dueDate,
            "transactionDate": invoice.bill.transactionDate,
            "invoiceNumber": invoice.bill.InvoiceNumber,
            "amount": {
                "amount": 0// we are updating this amount value from total line amount
            },
            "balance": {
                "amount": 0 //we are updating this amount value from total line amount
            },
            "vendor": {
                "id": invoice.bill.vendor.id
            },
            items: []
        }
    }
    let totalAmount = 0;
    for (var i = 0; i < invoice.bill.items.length; i++) {
        
        let companyItemId = await GetSearchQuery(cfg, instance,"ITEM","dimension_externalId =="+invoice.bill.items[i].companyItem.id);
        let GLAccountID = await GetSearchQuery(cfg, instance,"GLACCOUNT","gl_account_number_externalId=="+invoice.bill.items[i].glAccount.id);

        if(helper.isEmpty(companyItemId))
        return new Error("Company Item Id is required");
        if(helper.isEmpty(GLAccountID))
        return new Error("GL account id is required");

        let line = {
            "companyItem": {
                "id": companyItemId
            },
            "quantity": {
                "value": invoice.bill.items[i].quantity.value
            },
            "cost": {
                "amount": invoice.bill.items[i].cost.amount
            },
            "amountDue": {
                "amount": invoice.bill.items[i].amountDue.amount
            },
            "glAccount": {
                "id": GLAccountID
            },
            "description": invoice.bill.items[i].Description
        }
        totalAmount += invoice.bill.items[i].amount;
        billBody.bill.items.push(line);
    }

    billBody.bill.amount.amount = totalAmount;
    billBody.bill.balance.amount = totalAmount;

    var responce = "";
    if (!helper.isEmpty(billBody.bill.id)) {
        responce = await instance.makeRequest(`services/bill/${billBody.bill.id}`, 'PUT', billBody);
    } else {
        responce = await instance.makeRequest(`services/bill/${cfg.companyId}`, 'POST', billBody);
    }

    this.emit('data', messages.newMessageWithBody(responce));
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


