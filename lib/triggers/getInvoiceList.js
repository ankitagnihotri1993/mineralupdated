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
function processTrigger(msg, cfg, snapshot) {
    const self = this;
    return accountService.login(cfg).then(function (response) {

        var etag = response.headers['etag'];
        var body = {
            "view": "BILL",
            "query": "bill_externalId == null"
        }

        return commonsService.searchObjects(cfg, etag, body).then(async function (response) {

            if (!utility.isEmpty(response.entities))
            {
                var lastItemUpdatedDate = snapshot.LastModified || '';

                var filterResult = utility.filterDataBasedOnLastModifiedDate(response.entities, lastItemUpdatedDate);
                snapshot.LastModified = utility.getMaxDate(response.entities);
                if (!utility.isEmpty(filterResult)) {

                    filterResult.forEach(element => {

                        if (!utility.isEmpty(element.expenses)) {
                            let headerAmount = 0;
                            element.expenses.forEach(invoiceDetails => {
                                invoiceDetails.amountDue.amount = (invoiceDetails.amountDue.amount / 100)
                                headerAmount += invoiceDetails.amountDue.amount;

                            });
                            element.amount.amount = headerAmount;
                        }
                        self.emit('data', messages.newMessageWithBody(element));

                    }); 
                }
                self.emit('snapshot', snapshot);
                self.emit('end');
            }
        });

    });
}
