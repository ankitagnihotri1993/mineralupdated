'use strict';

const MTService = require('../../MTService');
const { messages } = require('elasticio-node');

exports.process = async function ProcessAction(msg, cfg) {
    const instance = new MTService(cfg, this);

    var subsidiaries = {
        list: []
    };
    for (var i = 0; i < msg.body.subsidiaries.length; i++) {
        const responce = await instance.makeRequest(`services/subsidiary/${cfg.companyId}`, 'POST', msg.body.subsidiaries[i]);
        subsidiaries.list.push(responce);
    }

    this.emit('data', messages.newMessageWithBody(subsidiaries));
};





