"use strict";
const messages = require('elasticio-node').messages;
const _ = require("underscore");
const accountService = require("../commons/services/accountService.js");
const invoiceService = require("../commons/services/invoiceService.js");
const utility = require('../commons/utility.js');

exports.process = processAction;

/*** 
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values, such as endPointURL,apiKey,username,password 
 * @returns promise resolving a message to be emitted to the platform
 */
 function processAction(msg, cfg) {
    const self = this;
     return accountService.login(cfg).then(function (response) {

        if (utility.isEmpty(response)) return;

        var etag = response.headers['etag'];
        return invoiceService.createSubsidiary(msg.body,cfg, etag).then(function (response) {
            if (!utility.isEmpty(response)) {
                self.emit('data', messages.newMessageWithBody(response));
            }
        self.emit('end');
        });
      });
 }