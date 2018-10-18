'use strict';

const MTService = require('../MTService');
const { messages } = require('elasticio-node');

exports.process = async function ProcessTrigger(msg, cfg, snapshot) {
    snapshot = snapshot || {};
    snapshot.lastUpdated = snapshot.lastUpdated || (new Date(0)).toISOString();

    var requestBody = {
        "view": cfg.view,
        "query": cfg.query,
        "sortAsc": true
    }

    if (cfg.page) {
        if (Number.isInteger(cfg.page)) {
            throw new Error('Page is not an integer number.');
        }
        const maxNum = Number.parseInt(cfg.page);
        if (maxNum <= 0) {
            throw new Error('Page is not a positive number.');
        }
        requestBody.page = maxNum;
    }

    if (cfg.count) {
        if (Number.isInteger(cfg.count)) {
            throw new Error('count is not an integer number.');
        }
        const maxNum = Number.parseInt(cfg.count);
        if (maxNum <= 0) {
            throw new Error('count is not a positive number.');
        }
        requestBody.count = maxNum;
    }

    if (cfg.query) {
        requestBody.query = cfg.count;
    }



    const instance = new MTService(cfg, this);
    const responce = await instance.makeRequest(`services/search/${cfg.companyId}/objects`, 'POST', requestBody);
    this.emit('data', messages.newMessageWithBody(responce));
};





