
const vendor = require('../../lib/actions/updateCaliberBillId');
var msg = {
    "body": ""
}
var cfg;
                                                                                                                                                                                                                                           

msg.body = {
    "bill": {
        "id": "e4ef85d4-7cce-4643-a7a3-29d54a8ea917",
        "externalId": 1318
    }
}
                                                                                                                                                                                                                                                                                               
cfg={
companyId:"2f436ea7-427d-4a12-9af5-73c8975c545d",
endPointURL:"https://test-f-mt.mineraltree.net",
username:"hannah.kim+tf+api@mineraltree.com",
password:"testRun#1"
};

vendor.process(msg,cfg);

 
