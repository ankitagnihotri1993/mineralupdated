'use strict';

const MTService = require('../../MTService');
const { messages } = require('elasticio-node');

exports.process = async function ProcessAction(msg, cfg) {
    const instance = new MTService(cfg, this);
    const body = msg.body;

    if (body.classification) {
        if (msg.body.classification.id) {
            const responce = await instance.makeRequest(`services/classification`, 'PUT', body);
            this.emit('data', messages.newMessageWithBody(responce));

        } else {
            const responce = await instance.makeRequest(`services/classification/${cfg.companyId}`, 'POST', body);
            this.emit('data', messages.newMessageWithBody(responce));
        }
    } else {
        this.emit('error', 'classification object is required');
    }
};


