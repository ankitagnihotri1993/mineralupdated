
 const vendor = require('../../lib/actions/subsidiary/createSubsidiary.js');
 var msg={body:""};
 var cfg;
 //var clientInfo={ClientID:15}
 msg.body = {
  "subsidiary": {
    "externalId": 3,
    "name": "Indian Village",
    "externalParentId": 3
  }
}

cfg={
companyId:"2f436ea7-427d-4a12-9af5-73c8975c545d",
endPointURL:"https://test-f-mt.mineraltree.net",
username:"hannah.kim+tf+api@mineraltree.com",
password:"testRun#1"
};

var snapshot={etag:""};

vendor.process(msg,cfg,snapshot);

 
