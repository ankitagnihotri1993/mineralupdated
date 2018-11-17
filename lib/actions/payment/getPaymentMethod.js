'use strict';

const MTService = require('../../MTService');
const { messages } = require('elasticio-node');


exports.process = async function ProcessAction(msg, cfg) {

    const externalId = msg.body.externalId;

    const instance = new MTService(cfg, this);
    const responce = await instance.makeRequest(`services/user/companies`, 'GET');

    if (responce && responce.companies) {
        const companylist = responce.companies;

        if (companylist.length > 0) {


            const company = companylist.filter(res => res.id === cfg.companyId);

            if (company.length > 0) {

                const paymentMethod = company[0].paymentMethods.filter(res => res.externalId === externalId);
                if (paymentMethod.length > 0) {
                    this.emit('data', messages.newMessageWithBody(paymentMethod[0]));
                } else {
                    this.emit('data', messages.newMessageWithBody(''));

                }
            }
        }
    }

    this.emit('end');
};


