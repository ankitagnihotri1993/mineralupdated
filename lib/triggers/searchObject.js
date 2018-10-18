'use strict';

const MTService = require('../../MTService');
const { messages } = require('elasticio-node');

exports.process = async function ProcessTrigger(msg, cfg, snapshot) {
    snapshot = snapshot || {};
    snapshot.lastUpdated = snapshot.lastUpdated || (new Date(0)).toISOString();

    var body = {
        "view": cfg.view,
        "query": cfg.query
    }

    const instance = new MTService(cfg, this);
    const responce = await instance.makeRequest(`services/search/${cfg.companyId}/objects`, 'POST', body);
    this.emit('data', messages.newMessageWithBody(responce));
};





