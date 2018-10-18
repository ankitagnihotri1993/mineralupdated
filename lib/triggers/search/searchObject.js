'use strict';

const MTService = require('../../MTService');
const { messages } = require('elasticio-node');

exports.process = async function ProcessTrigger(msg, cfg, snapshot) {
    snapshot = snapshot || {};
    snapshot.lastUpdated = snapshot.lastUpdated || (new Date(0)).toISOString();

    const instance = new MTService(cfg, this);
    const responce = await instance.makeRequest(`services/search/${cfg.companyId}/objects`, 'POST', msg.body);
    this.emit('data', messages.newMessageWithBody(responce));
};





