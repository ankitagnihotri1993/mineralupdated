
const createPurchaseOrder = require('../../lib/actions/purchaseOrder/createPurchaseOrder.js');
var msg = { body: "" };
var cfg;
var snapshot={etag:""};

msg.body = {

        "purchaseOrder": {
          "externalId": "789",
          "vendor": {
            "id": "87699e15-de5c-48a8-9498-80c358379ba8"
          },
          "poNumber": "789",
          "poType": "Standard",
          "dueDate": "2018-09-04T13:36:37Z",
          "items": [
            {
              "companyItem": {
                "id": "5"
              },
              "name": "AVRY-10150",
              "quantity": {
                "value": "0.00",
                "precision": 2
              },
              "quantityReceived": {
                "value": "0.00",
                "precision": 2
              },
              "amountDue": {
                "amount": "0.00"
              },
              "cost": {
                "amount": "51.95"
              },
              "glAccount": {
                "id": "10"
              },
              "lineNumber": 1,
              "closed": "false",
              "description": "Catalog #B11315: Bird Bath - Stone Gothic 2pc."
            }
          ]
        }
      }
cfg = {
  companyId: "b1437587-acf2-46fe-9846-739dbc996310",
    baseUrl: "https://test-f-mt.mineraltree.net",
    username: "msaifullah+api@magicsoftware.com",
    password: "Key@MagicSoftware1"
};
debugger;
createPurchaseOrder.process(msg, cfg,snapshot);