'use strict';

const MTService = require('../../MTService');
const { messages } = require('elasticio-node');
const helper = require('../../helpers.js');


async function promiseRequest(cfg, instance, view, query) {
    var body = {
        view: view,
        query: query
    };
    return await instance.promiseRequest(`services/search/${cfg.companyId}/objects`, 'POST', body);
}

function parseBody(result) {
    if (!helper.isEmpty(result)) {
        if (result.count > 0) {
            return result.entities[0];
        }
    }
    return '';
}
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
    Object.keys(paymentMethod).forEach(function key(key) {


        if (paymentMethod.type === 'ACH' && key === 'card' || (key === 'account')) {
            delete paymentMethod[key];

        }
        if (paymentMethod.type === 'CREDITCARD' && (key === 'bankAccount') || (key === 'account')) {
            delete paymentMethod[key];

        }
        if (paymentMethod.type === 'UNKNOWN' && (key === 'bankAccount') || (key === 'card')) {
            delete paymentMethod[key];

        }

    });
    body.paymentMethod = paymentMethod;


    var paymentMethodresponce = '';
    if (result) {

        if (helper.isUpdatedRecord(body.paymentMethod, result) || helper.isUpdatedRecord(body.paymentMethod.subsidiary, result.subsidiary) || (body.type === 'ACH' && helper.isUpdatedRecord(body.paymentMethod.bankAccount, result.bankAccount)) || (body.paymentMethod.type === 'CREDITCARD' && helper.isUpdatedRecord(body.paymentMethod.card, result.card))) {

            console.log('UPDATE');
            paymentMethodresponce = await instance.makeRequest(`services/pm/${cfg.companyId}`, 'POST', body);


        } else {
            console.log('NOT UPDATE');
            paymentMethodresponce = result;
        }

    } else {


        paymentMethodresponce = await instance.makeRequest(`services/pm/${cfg.companyId}`, 'POST', body);

    }


    this.emit('data', messages.newMessageWithBody(paymentMethodresponce));
};


