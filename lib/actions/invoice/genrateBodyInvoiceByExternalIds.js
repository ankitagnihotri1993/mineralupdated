'use strict';

const MTService = require('../../MTService');
const { messages } = require('elasticio-node');

exports.process = async function ProcessAction(msg, cfg) {

    var body = msg.body;

   
    const responce = await instance.makeRequest(`services/search/${cfg.companyId}/objects`, 'POST', msg.body);




};


async function GetSearchQuery(cfg, view, query) {
    const instance = new MTService(cfg, this);
    body = {
        "view": view,
        "query": query
    }
    result = await instance.makeRequest(`services/search/${cfg.companyId}/objects`, 'POST', body);

    if (!utility.isEmpty(result)) {
        if (result.count > 0) {
            return result.entities[0].id;
        }
    }
    return "";
}

