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
    return await instance.promiseRequest(`services/search/${cfg.companyId}/ids`, 'POST', body);
}


async function upsertExternalObject(instance, cfg, body) {

    if (body.subsidiary) {
        return await instance.makeRequest(`services/subsidiary/${cfg.companyId}`, 'POST', body);
    }

    if (body.vendor) {
        return await instance.makeRequest(`services/vendor/${cfg.companyId}`, 'POST', body);
    }


    if (body.glAccount) {
        return await instance.makeRequest(`services/glaccount/${cfg.companyId}`, 'POST', body);
    }

    if (body.classification) {
        return await instance.makeRequest(`services/classification/${cfg.companyId}`, 'POST', body);
    }
}


exports.process = async function ProcessAction(msg, cfg) {


    const instance = new MTService(cfg, this);
    let invoice = msg.body;

    const billRequest = promiseRequest(cfg, instance, 'BILL', 'bill_externalId==' + invoice.InvoiceID);
    const termRequest = promiseRequest(cfg, instance, 'TERMS', 'externalId==' + invoice.AcctTermID);
    const classRequest = promiseRequest(cfg, instance, 'CLASS', 'dimension_externalId==' + invoice.PaymentCCID);
    const vendorRequest = promiseRequest(cfg, instance, 'VENDOR', 'vendor_externalId==' + invoice.PayeeID);
    var subsidiaryId;

    var promiseResult = await Promise.all([billRequest, termRequest, classRequest, vendorRequest]);
    var billId = parseBody(promiseResult[0].body);
    var termId = parseBody(promiseResult[1].body);
    var classificationId = parseBody(promiseResult[2].body);
    var vendorId = parseBody(promiseResult[3].body);

    if (helper.isEmpty(subsidiaryId)) {
        const upsertresponce = await upsertExternalObject(instance, cfg, {
            subsidiary: {
                externalId: invoice.ClientID.toString(),
                name: invoice.ClientName,
                externalParentId: invoice.ClientID.toString()
            }
        }, cfg);
        console.log(upsertresponce);
        subsidiaryId = upsertresponce.id;
      
    }


    if (helper.isEmpty(classificationId)) {
        const upsertresponce = await upsertExternalObject(instance, cfg, {
            classification: {
                externalId: invoice.PaymentCCID.toString(),
                name: invoice.PaymentCCID.toString()
            }
        });
        classificationId = upsertresponce.id;
    }

    if (helper.isEmpty(vendorId)) {
        const upsertresponce = await upsertExternalObject(instance, cfg, {
            vendor: {
                externalId: invoice.PayeeID.toString(),
                name: invoice.PayeeID.toString()
            }
        });
        vendorId = upsertresponce.id;
    }

    if (helper.isEmpty(termId)) { console.log('Term Id id is required'); return; }
    if (helper.isEmpty(invoice.LineItems)) { console.log('Atleast one line item is required'); return; }
    if (helper.isEmpty(invoice.state)) { console.log('invoice Status is required'); return; }
    if (helper.isEmpty(subsidiaryId)) { console.log('subsidiaryId is required'); return; }

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
                id: subsidiaryId
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


    //let vendorCreditAmount = 0;

    for (var i = 0; i < invoice.LineItems.length; i++) {


        const costCenterRequest = promiseRequest(cfg, instance, 'CLASS', 'dimension_externalId=='
            + invoice.LineItems[i].CostCenterID);

        const expenseGLAccountRequest = promiseRequest(cfg, instance, 'GLACCOUNT',
            'gl_account_number_externalId==' + invoice.LineItems[i].ExpenseGLAccountID);

        var result = await Promise.all([costCenterRequest, expenseGLAccountRequest]);

        var CostCenterID = parseBody(result[0].body);
        var ExpenseGLAccountID = parseBody(result[1].body);

        if (helper.isEmpty(CostCenterID)) {
            const upsertresponce = await upsertExternalObject(instance, cfg, {
                classification: {
                    externalId: invoice.LineItems[i].CostCenterID.toString(),
                    name: invoice.LineItems[i].CostCenterID.toString()
                }
            });
            CostCenterID = upsertresponce.id;
        }

        if (helper.isEmpty(ExpenseGLAccountID)) {
            const upsertresponce = await upsertExternalObject(instance, cfg, {
                glAccount: {
                    externalId: invoice.LineItems[i].ExpenseGLAccountID.toString(),
                    name: invoice.LineItems[i].ExpenseGLAccountID.toString()
                }
            });
            ExpenseGLAccountID = upsertresponce.id;
        }


        if (invoice.LineItems[i].Amount === 0) { return new Error('Expense line amount should be more than 0'); }

        let calculatedAmount = (invoice.LineItems[i].Amount * 100);
        //if (invoice.LineItems[i].VendorCredit === true) {
        //    vendorCreditAmount += Math.abs(calculatedAmount);// We are using Math.ab() for negetive value to positive value
        //}

        var form1099Enabled = invoice.LineItems[i].Is1099Item;
        if (!form1099Enabled) { form1099Enabled = false; }

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

    if (billBody.bill.expenses.length === 0) { return new Error('Atleast one expense line item is required'); }


    var responce = '';


    if (!helper.isEmpty(billBody.bill.id)) {
        responce = await instance.makeRequest(`services/bill/`, 'PUT', billBody);
    } else {
        responce = await instance.makeRequest(`services/bill/${cfg.companyId}`, 'POST', billBody);
    }

    this.emit('data', messages.newMessageWithBody(responce));

    this.emit('end');
};


