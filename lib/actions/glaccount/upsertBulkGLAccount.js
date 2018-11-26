'use strict';

const MTService = require('../../MTService');
const { messages } = require('elasticio-node');

exports.process = async function ProcessAction(msg, cfg) {
    const instance = new MTService(cfg, this);
    const body = msg.body;
    var glAccounts = {
        list: []
    };

    if (body.glAccounts) {
        for (var i = 0; i < msg.body.glAccounts.length; i++) {
            const object = glAccounts[i];

            if (object.glAccount.id) {
                const responce = await instance.makeRequest(`services/glaccount`, 'PUT', object);
                glAccounts.list.push(responce);
            

            } else {
                const responce = await instance.makeRequest(`services/glaccount/${cfg.companyId}`, 'POST', object);
                glAccounts.list.push(responce);
            }
        }

        this.emit('data', messages.newMessageWithBody(glAccounts));
    } else {
        this.emit('error', 'classification object is required');
    }
};


