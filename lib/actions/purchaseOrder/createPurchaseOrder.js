'use strict';

const MTService = require('../../MTService');
const { messages } = require('elasticio-node');
const helper = require('../../helpers');

exports.process = async function ProcessAction(msg, cfg) {

    const instance = new MTService(cfg, this);
    var itemData = msg.body.purchaseOrder;
    var itemLength = msg.body.purchaseOrder.items.length;
    
    async function GetSearchQuery(cfg, instance, view, query) {
        const responce = await instance.makeRequest(`services/search/${cfg.companyId}/objects`, 'POST', {
            view: view,
            query: query
        });
        if (responce.count > 0) {
            return responce.entities[0].id;
        }
        return '';
    }
    for (var i = 0; i < itemLength; i++) {

        let itemId = await GetSearchQuery(cfg,instance,'ITEM', 'dimension_externalId==' + itemData.items[i].companyItem.id);
        let glId = await GetSearchQuery(cfg,instance,'GLACCOUNT', 'gl_account_number_externalId==' + itemData.items[i].glAccount.id);

        if (helper.isEmpty(itemId)) {this.emit('error', 'Company Item Id is required');}
        if (helper.isEmpty(glId)) {this.emit('error', 'GL account id is required');}

        itemData.items[i].companyItem.id = itemId;
        itemData.items[i].glAccount.id = glId;

    }
    if (helper.isEmpty(itemData.dueDate) || itemData.dueDate === 'N/A') {
        var d = new Date();
        itemData.dueDate = d.toISOString();
    }
    const responce = await instance.makeRequest(`services/purchaseorder/${cfg.companyId}`, 'POST', msg.body);
    this.emit('data', messages.newMessageWithBody(responce));
};


