'use strict';

const MTService = require('../../MTService');
const { messages } = require('elasticio-node');
const helper = require('../../helpers');


async function getSearchQuery(cfg, instance, view, query) {
    var body = {
        view: view,
        query: query
    };
    var result = await instance.makeRequest(`services/search/${cfg.companyId}/objects`, 'POST', body);
    console.log('get search call');
    if (!helper.isEmpty(result)) {
        if (result.count > 0) {
            return result.entities[0].id;
        }
    }
    return '';
}
exports.process = async function ProcessAction(msg, cfg) {
    const instance = new MTService(cfg, this);
    let invoice = msg.body;


    let billId = await getSearchQuery(cfg, instance, 'BILL', 'bill_externalId==' + invoice.InvoiceID);
    let termId = await getSearchQuery(cfg, instance, 'TERMS', 'externalId==' + invoice.AcctTermID);
    let classificationId = await getSearchQuery(cfg, instance, 'CLASS', 'dimension_externalId==' + invoice.PaymentCCID);
    let vendorId = await getSearchQuery(cfg, instance, 'VENDOR', 'vendor_externalId==' + invoice.PayeeID);

    if (helper.isEmpty(invoice.ClientID)) {return new Error('Subsidiary id is required');}
    if (helper.isEmpty(classificationId)) {return new Error('Classification id is required');}
    if (helper.isEmpty(vendorId)) {return new Error('Vendor id is required');}
    if (helper.isEmpty(termId)) {return new Error('Term Id id is required');}
    if (helper.isEmpty(invoice.LineItems)) { return new Error(' Atleast one line item is required'); }


    if (invoice.state) {
        invoice.state = 'Open';
    }


    var billBody = {
        bill:
        {
            id: billId,
            externalId: invoice.InvoiceID,
            term: {
                id: termId
            },
            classification: {
                id: classificationId
            },
            subsidiary: {
                id: invoice.ClientID
            },
            dueDate: invoice.DueDate,
            transactionDate: invoice.InvoiceDate,
            invoiceNumber: invoice.InvoiceNumber,
            state: invoice.state,
            amount: {
                amount: 0// we are updating this amount value from total line amount
            },
            balance: {
                amount: 0 //we are updating this amount value from total line amount
            },
            poNumber: invoice.PONumber,
            vendor: {
                id: vendorId
            },
            expenses: []
        }
    };

    let totalAmount = 0;
    let vendorCreditAmount = 0;
    for (var i = 0; i < invoice.LineItems.length; i++) {
        let CostCenterID = await getSearchQuery(cfg, instance, 'CLASS', 'dimension_externalId=='
            + invoice.LineItems[i].CostCenterID);
        let ExpenseGLAccountID = await getSearchQuery(cfg, instance, 'GLACCOUNT',
            'gl_account_number_externalId==' + invoice.LineItems[i].ExpenseGLAccountID);

        if (helper.isEmpty(ExpenseGLAccountID)) {return new Error('Expense GLAccountID is required');}
        if (helper.isEmpty(CostCenterID)) {return new Error('Expense CostCenterID is required');}
        if (invoice.LineItems[i].Amoun <= 0) {return new Error('Expense line amount should be more than 0');}

        let calculatedAmount = (invoice.LineItems[i].Amount * 100);
        if (invoice.LineItems[i].VendorCredit === true) {
            vendorCreditAmount += Math.abs(calculatedAmount);// We are using Math.ab() for negetive value to positive value
        }
        let line = {
            classification: {
                id: CostCenterID
            },
            glAccount: {
                id: ExpenseGLAccountID
            },
            netAmount: {
                amount: calculatedAmount
            },
            amountDue: {
                amount: calculatedAmount
            },
            memo: invoice.LineItems[i].Description
        };
        totalAmount += calculatedAmount;
        billBody.bill.expenses.push(line);
    }
    billBody.bill.amount.amount = totalAmount;
    billBody.bill.balance.amount = totalAmount;

    if (billBody.bill.expenses.length === 0) {return new Error('Atleast one expense line item is required');}

    if (helper.isEmpty(billId) && vendorCreditAmount > 0) {// Vendor credit only will create in the case of new bill posting
        let vendorCreditBody = {
            credit: {
                transactionDate: invoice.InvoiceDate,
                vendor: {
                    id: vendorId
                },
                amount: {
                    amount: vendorCreditAmount
                },
                currency: 'USD',
                externalId: invoice.InvoiceID
            }
        };
        let result = instance.makeRequest(`services/credit/${cfg.companyId}`, 'POST', vendorCreditBody);
        if (!helper.isEmpty(result)) {
            console.log('VendorCreditResult ' + JSON.stringify(result));
        }
    }

    var responce = '';
    if (!helper.isEmpty(billBody.bill.id)) {
        responce = await instance.makeRequest(`services/bill/`, 'PUT', billBody);
    } else {
        responce = await instance.makeRequest(`services/bill/${cfg.companyId}`, 'POST', billBody);
    }
    this.emit('data', messages.newMessageWithBody(responce));

};


