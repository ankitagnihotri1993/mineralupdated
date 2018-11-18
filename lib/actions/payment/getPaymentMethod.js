'use strict';

const MTService = require('../../MTService');
const { messages } = require('elasticio-node');
const Joi = require('joi');
const schema = Joi.object({
    externalId: Joi.string().required()
}).unknown(true);

exports.process = async function ProcessAction(msg, cfg) {

    const model = schema.validate(msg.body);

    if (model.error) {
        throw new Error(`validation error: ${JSON.stringify(model.error.details)}`);
    }

    const instance = new MTService(cfg, this);
    const responce = await instance.makeRequest(`services/user/companies`, 'GET');
    var result = '';

    if (responce && responce.companies) {
        const companylist = responce.companies;

        if (companylist.length > 0) {


            const company = companylist.filter(res => res.id === cfg.companyId);

            if (company.length > 0) {

                const paymentMethod = company[0].paymentMethods.filter(res => res.externalId === model.value.externalId);
        
                if (paymentMethod.length > 0) {
                    result = paymentMethod[0];
                }
            }
        }
    }


    this.emit('data', messages.newMessageWithBody(result));
    this.emit('end');
};


