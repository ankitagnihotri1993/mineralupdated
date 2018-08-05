"use strict";
const messages = require('elasticio-node').messages;
const invoiceURL = "/mtapi/base/services/vendor/";
const _ = require("underscore");
const accountService = require("../commons/services/accountService.js");
const invoiceService = require("../commons/services/invoiceService.js");
const vendorService = require("../commons/services/vendorService.js");
 
exports.process = processAction;

/*** 
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values, such as endPointURL,apiKey,username,password 
 * @returns promise resolving a message to be emitted to the platform
 */
 function processAction(msg, cfg) {
     const self = this;


     var account = await accountService.login(cfg);

    return accountService.login(cfg).then(function (response) {
        var etag = response.headers['etag'];
        var responces = [];
        msg.body.subsidiaries.forEach(element => {
            var responce = await invoiceService.createSubsidiary(element, cfg, etag);

            responces.push(responce)
           
        });


        self.emit('data', messages.newMessageWithBody(responces));
        self.emit('end');
    });
 }