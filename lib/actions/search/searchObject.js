'use strict';

const MTService = require('../../MTService');
const { messages } = require('elasticio-node');

exports.process = async function ProcessAction(msg, cfg) {
    const instance = new MTService(cfg, this);

    var body = msg.body;
    var requestBody = {
        view: body.view,
        sortAsc: true
    };
    if (body.page) {
        if (Number.isInteger(body.page)) {
            throw new Error('Page is not an integer number.');
        }
        const maxNum = Number.parseInt(body.page);
        if (maxNum <= 0) {
            throw new Error('Page is not a positive number.');
        }
        requestBody.page = maxNum;
    }

    if (body.count) {
        if (Number.isInteger(body.count)) {
            throw new Error('count is not an integer number.');
        }
        const maxNum = Number.parseInt(body.count);
        if (maxNum <= 0) {
            throw new Error('count is not a positive number.');
        }
        requestBody.count = maxNum;
    }

    if (body.query) {
        requestBody.query = body.query;
    }

    const responce = await instance.makeRequest(`services/search/${cfg.companyId}/objects`, 'POST', requestBody);
    this.emit('data', messages.newMessageWithBody(responce));
};


