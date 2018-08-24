"use strict";
const messages = require('elasticio-node').messages;
const _ = require("underscore");
const accountService = require("../commons/services/accountService.js");
const vendorService = require("../commons/services/vendorService.js");
const commonsService = require("../commons/services/commonsService.js");
const util = require('../commons/utility.js');
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
        snapshot.lastMaxDate =  snapshot.lastMaxDate ||   util.previousDate();
        var body=
            {
            body:{
                "view":"BILL",
                "query":"created=ge="+ util.previousDate() //2018-08-16T13:10:57Z//+filterDate.toLocaleString()
         }};
        
        return commonsService.searchObjects(cfg, etag,body).then(async function (response) {
         
           console.log("Data"+JSON.stringify(response.entities));

           var filterData =  response.entities.filter(res =>
                 (new Date(res.created) > new Date(snapshot.lastMaxDate))
                   );

                 if(!util.isEmpty(filterData))
                 {

                 filterData.forEach(element => {
                    
                  if(!util.isEmpty(element.expenses))
                    {
                      let  headerAmount=0;
                        element.expenses.forEach(element => {
                            amountDue.amount= (amountDue.amount/100)
                            headerAmount+=amountDue.amount;

                        }); 
                        element.amount.amount=headerAmount;
                    }
                      

                self.emit('data', messages.newMessageWithBody(element));      
                   
        }); 
    }
            var createdObj = _.max(response.entities, function (invoice) {
                return   new Date(invoice.created).getTime();
            });
        
         snapshot.lastMaxDate=createdObj.created;

         self.emit('snapshot', snapshot);
        self.emit('end');

     });

    });     
   }
