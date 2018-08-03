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
    return accountService.login(cfg).then(function (response) {
        var etag = response.headers['etag'];
        console.log('etag ', etag);
        vendorService.getVendorList(cfg, etag).then(function (response) {
          filterData = response.entities.filter(res =>res.externalId==msg.body.bill.vendor.id             
        );
        console.log("filterData"+ JSON.stringify(filterData));
      });
    return invoiceService.createSubsidiary(msg,cfg, etag).then(function (response) {
        console.log("created response"+ JSON.stringify(response));
        self.emit('data', messages.newMessageWithBody(response));
        self.emit('end');
        });
      });
 }