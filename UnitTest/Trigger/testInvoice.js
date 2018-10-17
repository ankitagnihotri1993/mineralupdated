
 const vendor = require('../../lib/triggers/purchaseOrder/getPurchaseOrder');

 
 var msg={body:""};
 var snapshot={etag:""};
 var snapshot
 var cfg;


cfg={
companyId:"b1437587-acf2-46fe-9846-739dbc996310",
endPointURL:"https://test-f-mt.mineraltree.net",
username:"hannah.kim+tf+api@mineraltree.com",
password:"testRun#1"
};

vendor.process(msg,cfg,snapshot);


