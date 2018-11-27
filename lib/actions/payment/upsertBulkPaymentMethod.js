'use strict';

const MTService = require('../../MTService');
const { messages } = require('elasticio-node');
const helper = require('../../helpers.js');


function getPaymentMethods(responce, companyId, externalId) {
    const result="";
    if (responce && responce.companies) {
        const companylist = responce.companies;

        if (companylist.length > 0) {

            const company = companylist.filter(res => res.id === companyId);

            if (company.length > 0) {           
                
                    const paymentMethod = company[0].paymentMethods.filter(res => res.externalId === externalId.toString());

                    if (paymentMethod.length > 0) {
                        result = paymentMethod[0];
                    }
                
            }

        }
    }
}

exports.process = async function ProcessAction(msg, cfg) {


    const instance = new MTService(cfg, this);
    var paymentMethods = msg.body;



    var responceBody = [];

    const responce = await instance.makeRequest(`services/user/companies`, 'GET');
    for (var i = 0; i < paymentMethods; i++) {
        try {
            var body = paymentMethods[0];
            body.paymentMethod.externalId = body.paymentMethod.externalId.toString();
            var result = getPaymentMethods(responce, cfg.companyId, body.paymentMethod.externalId);
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


            } else {
                paymentMethodresponce = await instance.makeRequest(`services/pm/${cfg.companyId}`, 'POST', body);
            }
            responceBody.push(paymentMethodresponce);

        } catch (ex) {
            console.log(ex);
        }
    }

    this.emit('data', messages.newMessageWithBody(responceBody));
};


