'use strict';

const MTService = require('../../MTService');
const { messages } = require('elasticio-node');
const schema = require('../../schema');

exports.process = async function ProcessAction(msg, cfg) {

    const result = schema.searchSchema.validate(msg.body);

    if (result.error)
        throw new Error(`validation error: ${result.error.details}`);


    const instance = new MTService(cfg, this);

    var body = result.value;

    var requestBody = {
        view: body.view,
        sortAsc: true
    };
   

    if (body.query) {
        requestBody.query = body.query;
    }

    const responce = await instance.makeRequest(`services/search/${cfg.companyId}/objects`, 'POST', result.value);
    this.emit('data', messages.newMessageWithBody(responce));
};


