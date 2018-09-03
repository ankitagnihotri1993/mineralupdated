"use strict";
const messages = require('elasticio-node').messages;
const _ = require("underscore");
const accountService = require("../commons/services/accountService.js");
const commonsService = require("../commons/services/commonsService.js");
const utility = require('../commons/utility.js');
exports.process = processTrigger;

/*** 
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values, such as endPointURL,username,password 
 * @param snapshot save the current state of integration step for the future reference. 
 * @returns promise resolving a message to be emitted to the platform
 */
async function processTrigger(msg, cfg, snapshot) 
{
    const self = this;
    var loginResult = await accountService.login(cfg);
    if (utility.isEmpty(loginResult.headers['etag'])) return;
    var etag = loginResult.headers['etag']; 

    var body = {
        "view": "PAYMENT",
        "query": "payment_externalId == null"
    }

    var result = await commonsService.searchObjects(cfg, etag, body);
    if (!utility.isEmpty(result.entities))
    {
        var lastItemUpdatedDate = snapshot.LastModified || '';
        var filterResult = utility.filterDataBasedOnLastModifiedDate(response.entities, lastItemUpdatedDate);
        snapshot.LastModified = utility.getMaxDate(response.entities);

        if (!utility.isEmpty(filterResult)) {

            filterResult.forEach(element => {

           self.emit('data', messages.newMessageWithBody(element));

            });
        }
        self.emit('snapshot', snapshot);
       
    }
    self.emit('end');
  }
