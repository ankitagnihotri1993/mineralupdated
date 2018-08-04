"use strict";
const messages = require('elasticio-node').messages;
const _ = require("underscore");
const accountService = require("../commons/services/accountService.js");
const vendorService = require("../commons/services/vendorService.js");

exports.process = processTrigger;

/*** 
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values, such as endPointURL,username,password 
 * @param snapshot save the current state of integration step for the future reference. 
 * @returns promise resolving a message to be emitted to the platform
 */
function processTrigger(msg, cfg,snapshot) 
{
    const self = this;
    return accountService.login(cfg).then(function (response) {
        var etag = response.headers['etag'];
        console.log('etag ', etag);
        return vendorService.getVendorList(cfg, etag).then(function (response) {
            var result;
             var date = new Date();
            date.setDate(date.getDate() - 1);// Today -1 day
        if (response == null || response == undefined || response=="") return;
        snapshot.vendorMaxDate = snapshot.vendorMaxDate ||  date.toLocaleString();
  
        if (snapshot.vendorMaxDate != "") {
          var filterData = response.entities.filter(res => (new Date(res.modified) > new Date(snapshot.vendorMaxDate)));
          result = filterData;
        } 
        else
         {
        result = response.entities;
         }
        console.log('Result Data ' + JSON.stringify(result));
         let vendorModifiedObj = _.max(response.entities, function (vendor) {
         return new Date(vendor.modified).getTime();
            });
         
         snapshot.vendorMaxDate=vendorModifiedObj.modified;

          result.forEach(element => {
          self.emit('data', messages.newMessageWithBody(element));      
          
        });
        console.log('snapshot.vendorMaxLastDate', snapshot.vendorMaxDate);
        self.emit('snapshot', snapshot);
        self.emit('end');

     });

    });     
   }
