'use strict';

const MTService = require('../../MTService');
const { messages } = require('elasticio-node');

exports.process = async function ProcessAction(msg, cfg) {
    const instance = new MTService(cfg, this);
    const body = msg.body;
    var glAccounts = {
        list: []
    };

    if (body) {
        for (var i = 0; i < body.length; i++) {
            var object = body[i];

            if (object.glAccount.id) {
                const responce = await instance.makeRequest(`services/glaccount`, 'PUT', object);
                glAccounts.list.push(responce);


            } else {
                const responce = await instance.makeRequest(`services/glaccount/${cfg.companyId}`, 'POST', object);
                glAccounts.list.push(responce);
            }
        }

    } else {
        this.emit('error', 'classification object is required');
    }

    this.emit('data', messages.newMessageWithBody(glAccounts));

};


