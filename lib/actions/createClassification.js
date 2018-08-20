"use strict";
const messages = require('elasticio-node').messages;
const invoiceURL = "/mtapi/base/services/vendor/";
const _ = require("underscore");
const accountService = require("../commons/services/accountService.js");
const invoiceService = require("../commons/services/invoiceService.js");


exports.process = processAction;

/*** 
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values, such as endPointURL,apiKey,username,password 
 * @returns promise resolving a message to be emitted to the platform
 */

function processAction(msg, cfg) {

    const self = this;
    return accountService.login(cfg).then(async function (response) {
        var etag = response.headers['etag'];
        console.log("ClassBody Out"+ JSON.stringify(msg.body));
        return invoiceService.createClassification(msg, cfg, etag).then(function (response) {
            console.log("Classification Created " + JSON.stringify(response));
            self.emit('data', messages.newMessageWithBody(response));
            self.emit('end');
        });

    });
}





//function processAction(msg, cfg) {

//    const self = this;
//    return accountService.login(cfg).then(async function (response) {
//        var etag = response.headers['etag'];
//        console.log('etag ', etag);
//        console.log("msg body "+ JSON.stringify( msg.body)); 
//    if(msg.body.glAccount.ClientInfo!=undefined && msg.body.glAccount.ClientInfo!=null && msg.body.glAccount.ClientInfo!="")
//     {
//        //msg.body.glAccount.ClientInfo.ClientID
//        var subsidiarieId;
//        var promiseSubsidiaries  =commonsService.getAllSubsidiaries();
//        var promiseResult =  await Promise.all([promiseSubsidiaries]);

//        if(promiseResult[0]!=null || promiseResult[0].length>0)
//        {
//          let filterSubsidiaries = promiseResult[0].entities.filter(res =>res.externalId==msg.body.glAccount.ClientInfo.ClientID);   
//          console.log("filterSubsidiaries" + JSON.stringify(filterSubsidiaries));
//          subsidiarieId= filterSubsidiaries!=null && filterSubsidiaries.length>0 ?filterSubsidiaries[0].id:"";
//        }
//        msg.body={ glAccount: {
//            subsidiaries: [{
//                id: subsidiarieId
//                } ], 
//            departmentRequired: true,
//            locationRequired: true,
//            projectRequired: true,
//            customerRequired: true,
//            vendorRequired: true,
//            employeeRequired: true,
//            itemRequired: true,
//            classRequired: true,
//            ledgerType: GetLedgerType(msg.body.glAccount.ledgerType),
//            accountNumber: msg.body.glAccount.accountNumber,
//            externalId: msg.body.glAccount.externalId,
//            name: msg.body.glAccount.name,
//            active: true
//        }
//      }
//      console.log("Final GLBody" + JSON.stringify( msg.body));
//      return glAccountService.createGLAccount(msg,cfg, etag).then(function (response) {
//            console.log("GL Created " + JSON.stringify( response));
//            self.emit('data', messages.newMessageWithBody(response));
//            self.emit('end');
//        });
//    }
//    });
//}
//function GetLedgerType(accountType)
//{
//if(accountType=="Accounts Payable")
//{
//    return "AP_ACCOUNT";
//}
//if(accountType=="Expense")
//{
// return "EXPENSE_ACCOUNT";
//}
//else
//{
// return "ACCOUNT";
//}
//}
