const vendorService = require("./lib/commons/services/vendorService.js");
var Promise = require('promise');
const _ = require("underscore");
const messages = require('elasticio-node').messages;
const accountService = require("./lib/commons/services/accountService.js");
const glAccountService = require("./lib/commons/services/glAccountService.js");
var vendorMaxLastDate;

async function CreateUpdateGLAccount(msg,cfg)
{
  const self = this;
  return accountService.login(cfg).then(function (response) {

      var etag = response.headers['etag'];
      console.log('etag ', etag);
      console.log("body "+ msg.body);
          console.log("body format "+ JSON.stringify( msg.body));
      return glAccountService.createGLAccount(msg,cfg, etag).then(function (response) {


       console.log("Created Response"+JSON.stringify( response));

          // self.emit('data', messages.newMessageWithBody(response));
          // self.emit('end');
              
   });
});
}
CreateUpdateGLAccount({body:{
  
    "glAccount": {
      "id": "",
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
      "externalId": "5760",
      "name": "Saguaro Bank of Mesa",
      "active": true
    }
  
}},{companyId:"83fbcf24-7482-4df9-a254-d53e87f738e4", endPointURL:"https://test-e-mt.mineraltree.net/", username:"hannah.kim+mtapi@mineraltree.com",
 password:"Magic01##"});

// async function processTrigger(msg, cfg) 
// {

  // const self = this;
  // return await accountService.login(cfg).then(function (response) {
//       var etag = response.headers['etag'];
//       console.log('etag ', etag);

//       // check if venodr alrady exists
//       var filterData;
//       if(msg.body.vendor.externalId!=null && msg.body.vendor.externalId!="")
//       {
//         debugger;
//       let promise=   vendorService.getVendorList(cfg,etag);
//       let result =   Promise.all([promise]);
    
//       debugger;
//       if(result[0]!=null && result[0].length>0)
//       {

//         debugger;
//        filterData = result[0].entities.filter(res =>
//         res.externalId==msg.body.vendor.externalId
        
//        );

//      console.log("filterData"+ JSON.stringify(filterData)); 

//       }
    
//     }
//   if(filterData.length>0)
//     {
//       debugger;
//      msg.body.vendor.id= filterData[0].id;// Get Mineral vendor id to update the vendor
     
//      console.log("msg.body.id" +msg.body.vendor.id);

//      return vendorService.updateVendor(msg,cfg, etag).then(function (response) {
//       self.emit('data', messages.newMessageWithBody(response));
//       self.emit('end');
//   });
// }
// else{
   
//   debugger;
//   return vendorService.createVendor(msg,cfg, etag).then(function (response) {
//       self.emit('data', messages.newMessageWithBody(response));
//       self.emit('end');
//       });
// }
// });


// if(result[0]!=null && result[0].length>0)
//       {

//         debugger;
//        filterData = result[0].entities.filter(res =>
//         res.externalId==msg.body.vendor.externalId
        
//        );

//      console.log("filterData"+ JSON.stringify(filterData)); 

//       }



// const self = this;
// return accountService.login(cfg).then(function (response) {
//     var etag = response.headers['etag'];
//     console.log('etag ', etag);
//    var filterData;
//     // check if venodr alrady exists
//      vendorService.getVendorList(cfg, etag).then(function (response) {
//     filterData = response.entities.filter(res =>
//               res.externalId==msg.body.vendor.externalId         
//              );
    
// if(filterData.length>0)
//   {
//     msg.body.vendor.id= filterData[0].id;// Get Mineral vendor id to update the vendor
//     return vendorService.updateVendor(msg,cfg, etag).then(function (response) {

//  console.log("update response "+ JSON.stringify(response));

//     // self.emit('data', messages.newMessageWithBody(response));
//     // self.emit('end');
// });
// }
// else{
 
// return vendorService.createVendor(msg,cfg, etag).then(function (response) {

//   console.log("create response "+ JSON.stringify(response));

//     // self.emit('data', messages.newMessageWithBody(response));
//     // self.emit('end');
//     });
// }
// });
// });  










    
//}

// processTrigger({body:{
//   "vendor": {
//     "id":"",
//     "form1099Enabled": true,
//     "externalId": "1595",
//     "name": "Elmo Tree Service123456",
//     "active": true,
//     "address": {
//       "name": "Elmo Tree Service",
//       "address1": "4710 E. Falcon Dr",
//       "address2": "",
//       "postalCode": "85215",
//       "town": "Mesa",
//       "ctrySubDivision": "AZ",
//       "country": "USA"
//     },
//     "legalName": "Elmo Tree Service",
//     "vendorType": "NONPROFIT",
//     "phones": [
//       {
//         "number": "480-396-7559",
//         "isFax": false
//       },
//       {
//         "number": "480-396-7559",
//         "isFax": true
//       }
//     ],
//     "fundingMethods": [
//       {
//         "type": "ACH",
//         "bankAccount": {
//           "accountNumber": "••••••4578",
//           "routingNumber": "•••••6780"
//         }
//       }
//     ],
//     "emails": [
//       ""
//     ],
//     "taxId": "",
//     "vatNumber": 0
//   }
// }},{companyId:"83fbcf24-7482-4df9-a254-d53e87f738e4", endPointURL:"https://test-e-mt.mineraltree.net/", username:"hannah.kim+mtapi@mineraltree.com",
//  password:"Magic01##"});

