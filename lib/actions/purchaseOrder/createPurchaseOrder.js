"use strict";
const messages = require("elasticio-node").messages;
const accountService = require("../../commons/services/accountService.js");
const commonsService = require("../../commons/services/commonsService.js");
const invoiceService = require("../../commons/services/invoiceService.js");
const utility = require("../../commons/utility.js");

exports.process = processAction;

/*** 
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values, such as endPointURL,apiKey,username,password 
 * @param snapshot save the current state of integration step for the future reference. 
 * @returns promise resolving a message to be emitted to the platform
 */

async function processAction(msg, cfg, snapshot) {

    const self = this;
    try {
        debugger;
        snapshot = snapshot || {};
        if (utility.isEmpty(snapshot.etag)) {
            snapshot.etag = await utility.getEtag(accountService, cfg);
        }
        var itemData = msg.body.purchaseOrder;       
        var itemLength = msg.body.purchaseOrder.items.length;

        for (var i = 0; i < itemLength; i++) {

        let itemId=  await GetSearchQuery("ITEM",cfg,snapshot.etag,itemData.items[i].companyItem.id);
        let glId=  await GetSearchQuery("GLACCOUNT",cfg,snapshot.etag,itemData.items[i].glAccount.id);

        itemData.items[i].companyItem.id=itemId;
        itemData.items[i].glAccount.id=glId;

        }
        if(utility.isEmpty(itemData.dueDate) || itemData.dueDate=='N/A')
        {
            var d = new Date();
            itemData.dueDate = d.toISOString();
        }
        var response = await invoiceService.createPurchaseOrder(msg.body, cfg, snapshot.etag)
        self.emit("data", messages.newMessageWithBody(response));
    }
    catch (ex) {
        throw new Error(ex);
    }
}
async function GetSearchQuery(type, cfg, etag, id) {
    let result;
    let body;
    switch (type) {

        case "ITEM":
            {
                body = {
                    "view": "ITEM",
                    "query": "dimension_externalId==" + id
                }
                result = await commonsService.searchObjects(cfg, etag, body);
            }
            break
        case "GLACCOUNT":
            {
                body = {
                    "view": "GLACCOUNT",
                    "query": "gl_account_number_externalId==" + id
                }
                result = await commonsService.searchObjects(cfg, etag, body);

            }
            break
        default:
        break;
    }
    if (!utility.isEmpty(result)) {
        if (result.count > 0) {
            return result.entities[0].id;
        }
    }
    return "";
}