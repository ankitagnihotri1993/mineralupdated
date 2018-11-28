const _ = require('underscore');

//var body = {
    
//    "paymentMethod": {
//      "type": "CREDITCARD",
//      "externalId": 8516,
//      "status": "Active",
//      "subsidiary": {
//        "id": "ffd53ba9-a225-43b6-9404-47c930648181"
//      },
//      "card": {
//        "name": "David COA"
//      },
//      "bankAccount": {
//        "name": "David COA",
//        "accountNumber": "0003",
//        "accountBalance": {
//          "availableBalance": {
//            "amount": 0
//          }
//        }
//      }
//    }
//  }


//var paymentMethod = body.paymentMethod;
//Object.keys(paymentMethod).forEach(function (key) {

   

//    if ((paymentMethod.type === "ACH") && (key === "card" || (key === "account")))
//    {
//        delete paymentMethod[key];
//    }
//    if ((paymentMethod.type === "CREDITCARD") && ((key === "bankAccount") || (key === "account"))) 
//    {
//        delete paymentMethod[key];
//    }
//    if ((paymentMethod.type === "UNKNOWN") && ((key === "bankAccount") || (key === "card"))) {
//        delete paymentMethod[key];
//    }
      
//});

//debugger;

//console.log( JSON.stringify(paymentMethod));


var bills = [
    {
        "externalId": "66b6f126-c97b-434e-9d7c-5fdc12697805",
        "appliedPaymentAmount": {
            "amount": 6000
        }
    },
    {
        "externalId": "66b6f126-c97b-434e-9d7c-5fdc12697805",
        "appliedPaymentAmount": {
            "amount": 6000
        }
    }
];

var billIds = [];
for (var i = 0; i < bills.length; i++) {
    billIds.push(bills[i].externalId)
}



console.log(`bill_externalId===in=(${billIds.join()}`);

//var energy = billIds.join();

