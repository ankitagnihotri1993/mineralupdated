'use strict';

const MTService = require('../../MTService');
const { messages } = require('elasticio-node');
// const Joi = require('joi');
// const schema = Joi.object({
//     externalId: Joi.string().required()
// }).unknown(true);

exports.process = async function ProcessAction(msg, cfg) {

    // const model = schema.validate(msg.body);

    // if (model.error) {
    //     this.emit('error',`validation error: ${JSON.stringify(model.error.details)}`);
    // }

    const instance = new MTService(cfg, this);
    const responce = await instance.makeRequest(`services/pm/${msg.body.pmid}`, 'GET');
    
    this.emit('data', messages.newMessageWithBody(responce));
    this.emit('end');
};


