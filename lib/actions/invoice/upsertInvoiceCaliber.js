'use strict';

const MTService = require('../../MTService');
const { messages } = require('elasticio-node');
const helper = require('../../helpers');


function parseBody(result) {
    if (!helper.isEmpty(result)) {
        if (result.count > 0) {
            return result.entities[0].id;
        }
    }
    return '';
}
async function promiseRequest(cfg, instance, view, query) {
    var body = {
        view: view,
        query: query
    };
    return await instance.promiseRequest(`services/search/${cfg.companyId}/objects`, 'POST', body);
}


exports.process = async function ProcessAction(msg, cfg) {


    const instance = new MTService(cfg, this);
    let invoice = msg.body;

    const billRequest = promiseRequest(cfg, instance, 'BILL', 'bill_externalId==' + invoice.InvoiceID);
    const termRequest = promiseRequest(cfg, instance, 'TERMS', 'externalId==' + invoice.AcctTermID);
    const classRequest = promiseRequest(cfg, instance, 'CLASS', 'dimension_externalId==' + invoice.PaymentCCID);
    const vendorRequest = promiseRequest(cfg, instance, 'VENDOR', 'vendor_externalId==' + invoice.PayeeID);


    var promiseResult = await Promise.all([billRequest, termRequest, classRequest, vendorRequest]);
    const billId = parseBody(promiseResult[0].body);
    const termId = parseBody(promiseResult[1].body);
    const classificationId = parseBody(promiseResult[2].body);
    const vendorId = parseBody(promiseResult[3].body);


    if (helper.isEmpty(invoice.ClientID)) { console.log('Subsidiary id is required'); return; }
    if (helper.isEmpty(classificationId)) { console.log('Classification id is required'); return;}
    if (helper.isEmpty(vendorId)) { console.log('Vendor id is required'); return;}
    if (helper.isEmpty(termId)) { console.log('Term Id id is required'); return; }
    if (helper.isEmpty(invoice.LineItems)) { console.log('Atleast one line item is required'); return;}


    if (!invoice.state) {
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
    let allLineItemVendorCredit = true;


    for (var i = 0; i < invoice.LineItems.length; i++) {


        const costCenterRequest = promiseRequest(cfg, instance, 'CLASS', 'dimension_externalId=='
            + invoice.LineItems[i].CostCenterID);

        const expenseGLAccountRequest = promiseRequest(cfg, instance, 'GLACCOUNT',
            'gl_account_number_externalId==' + invoice.LineItems[i].ExpenseGLAccountID);

        var result = await Promise.all([costCenterRequest, expenseGLAccountRequest]);

        const CostCenterID = parseBody(result[0].body);
        const ExpenseGLAccountID = parseBody(result[1].body);

        if (helper.isEmpty(ExpenseGLAccountID)) {return new Error('Expense GLAccountID is required');}
        if (helper.isEmpty(CostCenterID)) {return new Error('Expense CostCenterID is required');}
        if (invoice.LineItems[i].Amount === 0) {return new Error('Expense line amount should be more than 0');}

        let calculatedAmount = (invoice.LineItems[i].Amount * 100);
        if (invoice.LineItems[i].VendorCredit === true) {
            vendorCreditAmount += Math.abs(calculatedAmount);// We are using Math.ab() for negetive value to positive value
        } else {
            allLineItemVendorCredit = false;
        }

        var form1099Enabled = invoice.LineItems[i].Is1099Item;
        if (!form1099Enabled) {form1099Enabled = false;}

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
            memo: invoice.LineItems[i].Description,
            form1099Enabled: form1099Enabled
        };


        totalAmount += calculatedAmount;
        billBody.bill.expenses.push(line);
    }


    billBody.bill.amount.amount = totalAmount;
    billBody.bill.balance.amount = totalAmount;

    if (billBody.bill.expenses.length === 0) {return new Error('Atleast one expense line item is required');}
    var responce = '';
    if (totalAmount > 0) {

        if (!helper.isEmpty(billBody.bill.id)) {
            responce = await instance.makeRequest(`services/bill/`, 'PUT', billBody);
        } else {
            responce = await instance.makeRequest(`services/bill/${cfg.companyId}`, 'POST', billBody);
        }

        this.emit('data', messages.newMessageWithBody(responce));

    }

    if (totalAmount < 0) {
        {
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
                            externalId: invoice.InvoiceID,
                            status:"Open"
                    }
                };
                let result = instance.makeRequest(`services/credit/${cfg.companyId}`, 'POST', vendorCreditBody);
                console.log('VendorCreditResult ' + JSON.stringify(result));
                this.emit('data', messages.newMessageWithBody(result));    
            }
        }

    //if (helper.isEmpty(billId) && totalAmount<0 && vendorCreditAmount > 0) {// Vendor credit only will create in the case of new bill posting
    //    let vendorCreditBody = {
    //        credit: {
    //            transactionDate: invoice.InvoiceDate,
    //            vendor: {
    //                id: vendorId
    //            },
    //            amount: {
    //                amount: vendorCreditAmount
    //            },
    //            currency: 'USD',
    //            externalId: invoice.InvoiceID
    //        }
    //    };
    //    let result = instance.makeRequest(`services/credit/${cfg.companyId}`, 'POST', vendorCreditBody);
    //    if (!helper.isEmpty(result)) {
    //        console.log('VendorCreditResult ' + JSON.stringify(result));
    //    }

    //    if (!allLineItemVendorCredit) {
    //        responce = await instance.makeRequest(`services/bill/${cfg.companyId}`, 'POST', billBody);
    //    } else {
    //        responce = result;
    //    }

    //} else {


    //    if (!helper.isEmpty(billBody.bill.id)) {
    //        responce = await instance.makeRequest(`services/bill/`, 'PUT', billBody);
    //    } else {
    //        responce = await instance.makeRequest(`services/bill/${cfg.companyId}`, 'POST', billBody);
    //    }

    //}

  

};


