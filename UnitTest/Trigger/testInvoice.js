
const vendor = require('../../lib/triggers/invoice/getInvoiceList');

 var msg={body:""};
var cfg;
var snapshot


cfg={
companyId:"2f436ea7-427d-4a12-9af5-73c8975c545d",
endPointURL:"https://test-f-mt.mineraltree.net",
username:"hannah.kim+tf+api@mineraltree.com",
password:"testRun#1"
};

vendor.process(msg, cfg, snapshot);

 
