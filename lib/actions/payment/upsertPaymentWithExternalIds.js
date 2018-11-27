'use strict';

const MTService = require('../../MTService');
const { messages } = require('elasticio-node');
const helper = require('../helpers');

function parseBody(result) {
    if (!helper.isEmpty(result)) {
        if (result.count > 0) {
            return result.entities[0];
        }
    }
    return '';
}

exports.process = async function ProcessAction(msg, cfg) {

    var body = msg.body;

    const instance = new MTService(cfg, this);

    if (body.payment) {


        // Check if external id exist the grab the payment id
        if (body.payment.externalId) {
            var paymentResponse = parseBody(await instance.makeRequest(cfg, instance, 'PAYMENT', 'payment_externalId==' + body.payment.externalId));
            if (paymentResponse) {
                body.payment.id = paymentResponse.id;
            }
        }

        if (body.payment.bills && body.payment.bills.length > 0) {
            var bills = body.payment.bills;
            var billIds = [];
            for (var i = 0; i < bills.length; i++) {
                billIds.push(bills[i].externalId);
            }

            var billResponce = await instance.makeRequest(cfg, instance, 'BILL', `bill_externalId===in=(${billIds.join()}`);
            if (billResponce.count !== billIds.length) {

            }
        }


        var responce;
        if (body.payment.id) {
            responce = await instance.makeRequest(`services/payment`, 'PUT', body);
        } else {

            responce = await instance.makeRequest(`services/payment/${cfg.companyId}`, 'POST', body);
        }

        this.emit('data', messages.newMessageWithBody(responce));
    }
};


