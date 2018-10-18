
const createItem = require('../../lib/actions/item/createItem');
var msg = { body: "" };
var cfg;
msg.body = {

    "item": {
        "name": "sageItem1",
        "externalId": "3653610"
    }
}

cfg = {
    companyId: "b1437587-acf2-46fe-9846-739dbc996310",
    endPointURL: "https://test-f-mt.mineraltree.net",
    username: "hannah.kim+tf+api@mineraltree.com",
    password: "testRun#1"
};

createItem.process(msg, cfg);


