'use strict';

const MTService = require('../MTService');
const { messages } = require('elasticio-node');

exports.process = async function ProcessTrigger(msg, cfg, snapshot) {
    snapshot = snapshot || {};
    snapshot.lastUpdated = snapshot.lastUpdated || (new Date(0)).toISOString();

    var requestBody = {
        view: cfg.view,
        query: cfg.query,
        sortAsc: true
    };

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
        requestBody.query = cfg.query;
    }


    const instance = new MTService(cfg, this);
    const responce = await instance.makeRequest(`services/search/${cfg.companyId}/objects`, 'POST', requestBody);

    if (!responce || !Array.isArray(responce.entities)) {
        throw new Error(`Expected records array.  Instead received: ${JSON.stringify(responce)}`);
    }
    const resultsList = responce.entities;

    console.log('Found %d new records.', resultsList.length);
    if (resultsList.length > 0) {
        resultsList.forEach((record) => {
            this.emit('data', messages.newMessageWithBody(record));
        });

        snapshot.lastUpdated = resultsList[resultsList.length - 1].modified;
        console.log(`New snapshot: ${snapshot.lastUpdated}`);
        this.emit('snapshot', snapshot);
    }
};


