
 const vendor = require('../../lib/actions/createUpdateVendor');

 var msg={body:""};
 var cfg;
 msg.body = {

    "vendor": {
      "clientId": 15,
      "termsId": 4,
      "externalId": "19",
      "name": "Harwood Maintenance",
      "active": true,
      "address": {
        "name": "Harwood Maintenance",
        "address1": "3500 Fannin",
        "address2": "address2",
        "postalCode": "77004-3333",
        "town": "Houston",
        "ctrySubDivision": "TX",
        "country": "USA"
      },
      "legalName": "Harwood Maintenance",
      "vendorType": "INDIVIDUAL"
    }
  }

cfg={
companyId:"2f436ea7-427d-4a12-9af5-73c8975c545d",
endPointURL:"https://test-f-mt.mineraltree.net",
username:"hannah.kim+tf+api@mineraltree.com",
password:"testRun#1"
};

vendor.process(msg,cfg);

 
