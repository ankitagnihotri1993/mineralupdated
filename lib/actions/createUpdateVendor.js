"use strict";
const messages = require('elasticio-node').messages;
const invoiceURL = "/mtapi/base/services/vendor/";
const _ = require("underscore");
const accountService = require("../commons/services/accountService.js");
const vendorService = require("../commons/services/vendorService.js");
const subsidiaries = require('../commons/subsidiaries.js');
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
    return  accountService.login(cfg).then(async function (response)  {

        var etag = response.headers['etag'];
        console.log('etag ', etag);
        console.log("msg.body.vendor.externalId "+ msg.body.vendor.externalId);
        console.log("msg.body123"+ JSON.stringify(msg.body));

       if(msg.body.vendor.externalId!=null
         && msg.body.vendor.externalId!="" 
         && msg.body.vendor.clientId!=null
         && msg.body.vendor.clientId!="" ) 
         {
            var termId;
            var subsidiarieId;
            var promiseSubsidiaries  =commonsService.getAllSubsidiaries();
            var promiseTerms = commonsService.searchObjects(cfg,etag,"TERMS");
            var promiseResult =  await Promise.all([promiseSubsidiaries,promiseTerms]);

            if(promiseResult[0]!=null || promiseResult[0].length>0)
            {
              let filterSubsidiaries = promiseResult[0].entities.filter(res =>res.externalId==msg.body.vendor.clientId);   
              console.log("filterSubsidiaries" + JSON.stringify(filterSubsidiaries));
              subsidiarieId= filterSubsidiaries!=null && filterSubsidiaries.length>0 ?filterSubsidiaries[0].id:"";
            }
            if(promiseResult[1]!=null || promiseResult[1].length>0)
            {
              let filterTerms  = promiseResult[1].entities.filter(res =>res.externalId==msg.body.vendor.termsId);        
              console.log("filterTerms" + JSON.stringify(filterTerms));
              termId=filterTerms!=null && filterTerms.length>0 ?filterTerms[0].id:"";
            }
        
            console.log("termId" +termId);
            console.log("subsidiarieId" +subsidiarieId);

        var vendorBody={body:""};
        vendorBody.body = GetVendorBody(msg,subsidiarieId,termId);
        console.log("FinalBody" + JSON.stringify(vendorBody.body));

        return vendorService.createVendor(vendorBody,cfg, etag).then(function (response) {

        console.log("created response "+ JSON.stringify(response));
        // self.emit('data', messages.newMessageWithBody(response));
        // self.emit('end');
       });
 }
});

}
function GetVendorBody(msg,subsidiaryId,termId)
{

  var vendorBody={
    vendor: {
     externalId: msg.body.vendor.externalId,
      name: msg.body.vendor.name,
      address: {
       name: msg.body.vendor.address.name,
       address1: msg.body.vendor.address.address1,
       address2: msg.body.vendor.address.address2,
        postalCode:msg.body.vendor.address.postalCode,
        town: msg.body.vendor.address.postalCode,
        country:msg.body.vendor.address.country
      },
      legalName: msg.body.vendor.legalName,
      vendorType: msg.body.vendor.vendorType,
      primarySubsidiary: {id: subsidiaryId},
      subsidiaries: [{id:subsidiaryId}],
      vendorCompanyDefault: { 
      defaultTermsId: termId
    }
 }
}
return vendorBody;
}
