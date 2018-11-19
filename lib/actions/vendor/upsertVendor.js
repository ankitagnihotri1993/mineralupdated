'use strict';

const MTService = require('../../MTService');
const { messages } = require('elasticio-node');

exports.process = async function ProcessAction(msg, cfg) {

    var body = msg.body;

    // remove fund method object if accountNumber and routingNumber is null
    const fundingMethods = body.fundingMethods;

    if (fundingMethods && fundingMethods.length > 0) {

        if (fundingMethods[0].bankAccount && fundingMethods[0].bankAccount.accountNumber === null && fundingMethods[0].bankAccount.routingNumber === null) {
            body.fundingMethods = null;
        }
    }

    const instance = new MTService(cfg, this);
    const responce = await instance.makeRequest(`services/vendor/${cfg.companyId}`, 'POST', body);
    this.emit('data', messages.newMessageWithBody(responce));
};


