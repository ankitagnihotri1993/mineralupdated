'use strict';

const MTService = require('../../MTService');
const { messages } = require('elasticio-node');

exports.process = async function ProcessAction(msg, cfg) {
    const instance = new MTService(cfg, this);
    var responce = '';

    if (msg.body.bill.id) {
        responce = await instance.makeRequest(`services/bill/`, 'PUT', msg.body);
    } else {
        responce = await instance.makeRequest(`services/bill/${cfg.companyId}`, 'POST', msg.body);
    }

    this.emit('data', messages.newMessageWithBody(responce));
};


