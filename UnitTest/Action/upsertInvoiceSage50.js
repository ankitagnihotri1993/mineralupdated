
const upsertInvoiceSage50 = require('../../lib/actions/invoice/upsertInvoiceSage50.js');

var cfg;
var snapshot={etag:""};


const msg = {
  body:{
      
      "bill": {
          "externalId": "816",
          "poNumber": "816",
          "invoiceNumber": "121212",
          "term": {
            "id": "507d852f-461f-4868-b577-fbe9002f751f"
          },
          "dueDate": "2019-04-14",
          "transactionDate": "2018-10-15 13:15:44.0",
          "vendor": {
            "id": "9cff6bed-d35a-4a13-9295-18c2cbd59ac8"
          },
          "glAccount": {
            "id": "507d852f-461f-4868-b577-fbe9002f751f"
          },
          "items": [
            {
      
              "companyItem": {
                "id": "148"
              },
              "quantity": {
                "value": 1
              },
              "amountDue": {
                "amount": 100
              },
              "cost": {
                "amount": 100
              },
              "netAmount": {
                "amount": 100       
                               },
              "glAccount": {
                "id": "10"
              },
              "lineNumber": "148",
              "description": "Prefabricated Birdhouse-Large Castle"
            }
          ]
   } }
};


cfg = {
    companyId: "b1437587-acf2-46fe-9846-739dbc996310",
    baseUrl: "https://test-f-mt.mineraltree.net",
    username: "msaifullah+api@magicsoftware.com",
    password: "Key@MagicSoftware1"

    // username: credential1.username_mt,
    // password: credential1.password_mt,
    // baseUrl: credential1.endPointURL_mt,
    // companyId: credential1.companyId_mt


};
debugger;
upsertInvoiceSage50.process(msg, cfg,snapshot);