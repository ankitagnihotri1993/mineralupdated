"use strict";
const messages = require('elasticio-node').messages;
const _ = require("underscore");
const accountService = require("../../commons/services/accountService.js");
const invoiceService = require("../../commons/services/invoiceService.js");
const utility = require('../../commons/utility.js');

exports.process = processAction;

/*** 
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values, such as endPointURL,apiKey,username,password 
 * @returns promise resolving a message to be emitted to the platform
 */

async function processAction(msg, cfg) {

    const self = this;
    var loginResult = await accountService.login(cfg);
    if (utility.isEmpty(loginResult)) return;
    var etag = loginResult.headers['etag'];

    var response = await invoiceService.createTerm(msg.body, cfg, etag);

    if (!utility.isEmpty(response)) {
        self.emit('data', messages.newMessageWithBody(response));
    }
    self.emit('end');

}

         
