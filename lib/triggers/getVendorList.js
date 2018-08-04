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
        return vendorService.getVendorList(cfg, etag).then(async function (response) {
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
        var promiseTerms = commonsService.searchObjects(cfg,etag,"TERMS");
        var promiseResult =  await Promise.all([promiseTerms]);

         result.forEach(element => {

            var defaultTermsId='';
            if(promiseResult[0]!=null || promiseResult[0].length>0)
            {
            let filterTerms  = promiseResult[0].entities.filter(res =>res.id==element.vendorCompanyDefault.defaultTermsId);        
            console.log("filterTerms" + JSON.stringify(filterTerms));
            defaultTermsId=filterTerms!=null && filterTerms.length>0 ?filterTerms[0].externalId:"";
            }

            var vendorObj = element;
            vendorObj.termId= defaultTermsId;
            self.emit('data', messages.newMessageWithBody(vendorObj));      
          
        });
         let vendorModifiedObj = _.max(response.entities, function (vendor) {
            return new Date(vendor.modified).getTime();
            });
            snapshot.vendorMaxDate=vendorModifiedObj.modified;

        console.log('snapshot.vendorMaxLastDate', snapshot.vendorMaxDate);
        self.emit('snapshot', snapshot);
        self.emit('end');

     });

    });     
   }
