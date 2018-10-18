'use strict';

const MTService = require('../../MTService');
const { messages } = require('elasticio-node');

exports.process = async function ProcessAction(msg, cfg) {
    const instance = new MTService(cfg, this);
    const responce = await instance.makeRequest(`services/subsidiary/${cfg.companyId}`, 'POST', msg.body);
    this.emit('data', messages.newMessageWithBody(responce));
};





