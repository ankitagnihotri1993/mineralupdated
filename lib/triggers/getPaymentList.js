"use strict";
const messages = require('elasticio-node').messages;
const _ = require("underscore");
const accountService = require("../commons/services/accountService.js");
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
        snapshot.lastMaxDate =  snapshot.lastMaxDate ||  filterDate.toISOString()
        var body=
        {
        body:{
            "view":"PAYMENT",
            "query":"modified=ge="+filterDate.toISOString()// 2018-08-06T13:10:57Z+filterDate.toLocaleString()
       }};
        
       return commonsService.searchObjects(cfg, etag,body).then(async function (response) {
           var filterData;
          
              filterData =  response.entities.filter(res =>
               (new Date(res.modified) > new Date(snapshot.lastMaxDate)));        
          
               filterData.forEach(element => {
               self.emit('data', messages.newMessageWithBody(element));      
         
           }); 

       var modifiedObj = _.max(response.entities, function (vendor) {
           return   new Date(vendor.modified).getTime();
         });

        snapshot.lastMaxDate=modifiedObj.modified;
        self.emit('snapshot', snapshot);
        self.emit('end');

    });

   });     
  }
