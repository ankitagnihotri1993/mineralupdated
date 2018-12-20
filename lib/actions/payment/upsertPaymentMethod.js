'use strict';

const MTService = require('../../MTService');
const { messages } = require('elasticio-node');
const helper = require('../../helpers.js');


exports.process = async function ProcessAction(msg, cfg) {


    const instance = new MTService(cfg, this);
    var body = msg.body;


    body.paymentMethod.externalId = body.paymentMethod.externalId.toString();

    const responce = await instance.makeRequest(`services/user/companies`, 'GET');
    var result = '';

    if (responce && responce.companies) {
        const companylist = responce.companies;

        if (companylist.length > 0) {


            const company = companylist.filter(res => res.id === cfg.companyId);

            if (company.length > 0) {
                const externalId = body.paymentMethod.externalId;

                const paymentMethod = company[0].paymentMethods.filter(res => res.externalId === externalId.toString());

                if (paymentMethod.length > 0) {
                    result = paymentMethod[0];
                }
            }
        }
    }


    var paymentMethod = body.paymentMethod;
    paymentMethod.id = result.id;
    Object.keys(paymentMethod).forEach(function key(key) {

        if ((paymentMethod.type === 'ACH') && ((key === 'card') || (key === 'account'))) {
            delete paymentMethod[key];
        }
        if ((paymentMethod.type === 'CREDITCARD') && ((key === 'bankAccount') || (key === 'account'))) {
            delete paymentMethod[key];
        }
        if ((paymentMethod.type === 'UNKNOWN') && ((key === 'bankAccount') || (key === 'card'))) {
            delete paymentMethod[key];
        }

    });

    if (result && result.id && result.bankAccount && result.bankAccount.accountNumber && paymentMethod.bankAccount && paymentMethod.bankAccount.accountNumber) {


        var bankAccount = paymentMethod.bankAccount;
        // removing the account number in case of update
        delete bankAccount.accountNumber;
        paymentMethod.bankAccount = bankAccount;


    }


    body.paymentMethod = paymentMethod;


    var paymentMethodresponce = '';
    if (result && result.id) {
        paymentMethodresponce = await instance.makeRequest(`services/pm`, 'PUT', body);

        //if (helper.isUpdatedRecord(body.paymentMethod, result) || helper.isUpdatedRecord(body.paymentMethod.subsidiary, result.subsidiary) || (body.type === 'ACH' && helper.isUpdatedRecord(body.paymentMethod.bankAccount, result.bankAccount) && helper.isUpdatedRecord(body.paymentMethod.bankAccount.accountBalance.availableBalance, result.bankAccount.accountBalance.availableBalance)) || (body.paymentMethod.type === 'CREDITCARD' && helper.isUpdatedRecord(body.paymentMethod.card, result.card))) {

        //    console.log('UPDATE');


        //} else {
        //    console.log('NOT UPDATE');

        //    console.log(body);
        //    paymentMethodresponce = result;
        //}

    } else {


        paymentMethodresponce = await instance.makeRequest(`services/pm/${cfg.companyId}`, 'POST', body);

    }


    this.emit('data', messages.newMessageWithBody(paymentMethodresponce));
};


// 'use strict';

// const MTService = require('../../MTService');
// const { messages } = require('elasticio-node');

// exports.process = async function ProcessAction(msg, cfg) {
//     const instance = new MTService(cfg, this);
//     var responce = '';

//     if (msg.body.PM.id) {
//         responce = await instance.makeRequest(`services/pm/`, 'PUT', msg.body);
//     } else {
//         responce = await instance.makeRequest(`services/pm/${cfg.companyId}`, 'POST', msg.body);
//     }

//     this.emit('data', messages.newMessageWithBody(responce));
// };
