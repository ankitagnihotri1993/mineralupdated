const vendorService = require("./lib/commons/services/vendorService.js");
var Promise = require('promise');
const _ = require("underscore");
const messages = require('elasticio-node').messages;
const accountService = require("./lib/commons/services/accountService.js");
const invoiceService = require("./lib/commons/services/invoiceService.js");
const request = require('request-promise');
var vendorMaxLastDate;

async function CreateUpdateGLAccount(msg, cfg) {
    const self = this;
    var account = await accountService.login(cfg);



    var subsidiaries = [];

    for (var i = 0; i < msg.body.subsidiaries.length; i++) {

        var result = await invoiceService.createSubsidiary(msg.body.subsidiaries[i], cfg, account.headers['etag']);

        subsidiaries.push(result);
    }



    console.log(subsidiaries);
}




CreateUpdateGLAccount({
    body: {
        "subsidiaries": [
            {
                "subsidiary": {
                    "externalId": 31,
                    "externalParentId": 31,
                    "name": "Agave Springs Apartments"
                }
            },
            {
                "subsidiary": {
                    "externalId": 30,
                    "externalParentId": 30,
                    "name": "Cardinal Stadium Village"
                }
            }
        ]
    }
}, {
    companyId: "2f436ea7-427d-4a12-9af5-73c8975c545d", endPointURL: "https://test-f-mt.mineraltree.net/", username:"hannah.kim+tf+api@mineraltree.com",
        password:"testRun#1"});
