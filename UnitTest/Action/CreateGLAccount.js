
 const vendor = require('../../lib/actions/createGLAccount');
 var msg={body:""};
 var cfg;
 var clientInfo={ClientID:15}
 msg.body = {

  "glAccount": {
    "ClientInfo": clientInfo,
    "departmentRequired": true,
    "locationRequired": true,
    "projectRequired": true,
    "customerRequired": true,
    "vendorRequired": true,
    "employeeRequired": true,
    "itemRequired": true,
    "classRequired": true,
    "ledgerType": "ACCOUNT",
    "accountNumber": "0004",
    "externalId": "9106",
    "name": "Unit Test G1",
    "active": true
  }
  }

cfg={
companyId:"2f436ea7-427d-4a12-9af5-73c8975c545d",
endPointURL:"https://test-f-mt.mineraltree.net",
username:"hannah.kim+tf+api@mineraltree.com",
password:"testRun#1"
};

vendor.process(msg,cfg);

 
