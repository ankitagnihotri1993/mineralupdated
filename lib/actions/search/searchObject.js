'use strict';

const MTService = require('../../MTService');
const { messages } = require('elasticio-node');
const schema = require('../../schema');

exports.process = async function ProcessAction(msg, cfg) {

    const result = schema.searchSchema.validate(msg.body);

    if (result.error) { this.emit('error', `validation error: ${JSON.stringify(result.error.details)}`);}


    var requestbody = {
        view: result.value.view,
        query: result.value.query,
        count: result.value.count,
        page: result.value.page,
        sortAsc: result.value.sortAsc
    };


    const instance = new MTService(cfg, this);


    const responce = await instance.makeRequest(`services/search/${cfg.companyId}/objects`, 'POST', requestbody);
    this.emit('data', messages.newMessageWithBody(responce));
};


