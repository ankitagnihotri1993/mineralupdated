"use strict";
const messages = require('elasticio-node').messages;
const invoiceURL = "/mtapi/base/services/vendor/";
const _ = require("underscore");
const accountService = require("../commons/services/accountService.js");
const commonsService = require("../commons/services/commonsService.js");


exports.process = processAction;

/*** 
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values, such as endPointURL,apiKey,username,password 
 * @returns promise resolving a message to be emitted to the platform
 */
function processAction(msg, cfg) {

    console.log('called');
    const self = this;
    return accountService.login(cfg).then(async function (response) {
    return commonsService.searchObjects(cfg, response.headers['etag'],msg.body).then(function (response) {

            console.log("created response " + response);
            self.emit('data', messages.newMessageWithBody(response));
            self.emit('end');
        });


    });
   

}
