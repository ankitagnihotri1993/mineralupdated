"use strict";
const messages = require('elasticio-node').messages;
const _ = require("underscore");
const accountService = require("../commons/services/accountService.js");
const vendorService = require("../commons/services/vendorService.js");
const commonsService = require("../commons/services/commonsService.js");
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
        var filterDate = new Date();
        filterDate.setDate(filterDate.getDate() - 1);
        
        var body=
        {
        body:{
            "view":"VENDOR",
            "query":"modified=ge=2018-08-06T13:10:57Z"//+filterDate.toLocaleString()
       }};
        
        return commonsService.searchObjects(body, cfg, etag).then(async function (response) {
         
         response.forEach(element => {
                self.emit('data', messages.newMessageWithBody(element));      
          
        }); 
       // self.emit('snapshot', snapshot);
        self.emit('end');

     });

    });     
   }
