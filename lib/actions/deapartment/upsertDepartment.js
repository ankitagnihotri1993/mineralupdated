'use strict';

const MTService = require('../../MTService');
const { messages } = require('elasticio-node');

exports.process = async function ProcessAction(msg, cfg) {
    const instance = new MTService(cfg, this);
    var responce = '';

    if (msg.body.department.id) {
        responce = await instance.makeRequest(`services/department/`, 'PUT', msg.body);
    } else {
        responce = await instance.makeRequest(`services/department/${cfg.companyId}`, 'POST', msg.body);
    }

    this.emit('data', messages.newMessageWithBody(responce));
};

