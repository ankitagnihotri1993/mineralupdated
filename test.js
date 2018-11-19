
var body = {
    "paymentMethod": {
        "type": "ACH",
        "externalId": "test4331",
        "status": "Active",
        "subsidiary": {
            "id": "83ba591c-9662-4cda-8ec2-fbff0d498713"
        },
        "bankAccount": {
            "name": "ankit credit account",
            "accountNumber": "10101",
            "accountBalance": {
                "availableBalance": {
                    "amount": 0
                }
            }
        },
        "ss": null
    }
}


var paymentMethod = body.paymentMethod;
Object.keys(paymentMethod).forEach(function (key) {


    if (paymentMethod.type === "ACH" && key === "card" || (key === "account"))
    {
        delete paymentMethod[key];
      
    }
    if (paymentMethod.type === "CREDITCARD" && (key === "bankAccount") || (key === "account")) {
        delete paymentMethod[key];

    }
    if (paymentMethod.type === "UNKNOWN" && (key === "bankAccount") || (key === "card")) {
        delete paymentMethod[key];

    }
      
});



console.log(paymentMethod);