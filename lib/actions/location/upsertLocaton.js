'use strict';

const MTService = require('../../MTService');
const { messages } = require('elasticio-node');

exports.process = async function ProcessAction(msg, cfg) {
    const instance = new MTService(cfg, this);
    var responce = '';

    if (msg.body.location.id) {
        responce = await instance.makeRequest(`services/location/`, 'PUT', msg.body);
    } else {
        responce = await instance.makeRequest(`services/location/${cfg.companyId}`, 'POST', msg.body);
    }

    this.emit('data', messages.newMessageWithBody(responce));
};

