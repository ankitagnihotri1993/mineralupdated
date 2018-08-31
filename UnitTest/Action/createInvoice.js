
const vendor = require('../../lib/actions/createUpdateInvoice');
 var msg={body:""};
 var cfg;

msg.body = {

    "AllowThisHistType": [
        false,
        false,
        false,
        false,
        false,
        false,
        false
    ],
        "PayeeID": 1633,
            "PayeeType": 14,
                "Payee": "Ankit test22",
                    "Contact": "",
                        "ContactAddress": {
        "AddressID": 0,
            "RefID": null,
                "RefType": null,
                    "IsDeleted": null,
                        "Name": null,
                            "InCareOf": null,
                                "UnitNumber": null,
                                    "Address1": "A-21/1 Nehru GALI 3 FLOOR",
                                        "Address2": "update line 2",
                                            "City": "delhi",
                                                "State": "state",
                                                    "ZipCode": "110096",
                                                        "Country": "india",
                                                            "OneLine": "A-21/1 Nehru GALI 3 FLOOR, update line 2, delhi, state  110096, india"
    },
    "Acct": "1110 - Bank of Caliber - Ckg",
        "ReadyForBoardApproval": false,
            "RequiredNumberOfApprovers": 1,
                "ActualNumberOfApprovals": 0,
                    "RejectedByDisplayName": "",
                        "AlreadyApprovedByThisUser": false,
                            "RequiresBoardApproval": false,
                                "CurrentStatus": 13,
                                    "CurrentStatusText": "FullyPaid",
                                        "PaidDate": "0001-01-01T00:00:00",
                                            "AllowedHistTypes": 0,
                                                "InvoiceID": 6497,
                                                    "ClientID": 15,
                                                        "InvoiceNumber": "MTinvoice121",
                                                            "APBasis": 1,
                                                                "Amount": 100,
                                                                    "PONumber": "",
                                                                        "AcctTermID": 9,
                                                                            "AcctTerm": "",
                                                                                "PaymentTypeID": -5,
                                                                                    "ManualCheckNumber": 0,
                                                                                        "ManualPaymentDate": "2000-01-01T00:00:00",
                                                                                            "CombinePayments": false,
                                                                                                "PaymentGLAccountID": 5760,
                                                                                                    "VendorNotes": "",
                                                                                                        "InvoiceDate": "2018-08-29T00:00:00",
                                                                                                            "DueDate": "2018-08-29T00:00:00",
                                                                                                                "Received": false,
                                                                                                                    "ReceivedDate": "1999-12-31T00:00:00",
                                                                                                                        "Validated": false,
                                                                                                                            "ValidatedDate": "1999-12-31T00:00:00",
                                                                                                                                "OnHold": false,
                                                                                                                                    "OnHoldDate": "1999-12-31T00:00:00",
                                                                                                                                        "APApproved": false,
                                                                                                                                            "APApprovedDate": "1999-12-31T00:00:00",
                                                                                                                                                "MgrApproved": false,
                                                                                                                                                    "MgrApprovedDate": "1999-12-31T00:00:00",
                                                                                                                                                        "BoardApproved": false,
                                                                                                                                                            "BoardApprovedDate": "1999-12-31T00:00:00",
                                                                                                                                                                "ReadyToPay": true,
                                                                                                                                                                    "ReadyToPayDate": "2018-08-29T00:00:00",
                                                                                                                                                                        "Rejected": false,
                                                                                                                                                                            "RejectedDate": "1999-12-31T00:00:00",
                                                                                                                                                                                "RejectedBy": -1,
                                                                                                                                                                                    "RejectedByName": "Board Member",
                                                                                                                                                                                        "RejectedReason": "",
                                                                                                                                                                                            "APPosted": true,
                                                                                                                                                                                                "PostingDate": "2018-08-29T00:00:00",
                                                                                                                                                                                                    "Voided": false,
                                                                                                                                                                                                        "VoidDate": "1999-12-31T00:00:00",
                                                                                                                                                                                                            "VoidGLTransactionID": 0,
                                                                                                                                                                                                                "ChangeInvoiceID": 0,
                                                                                                                                                                                                                    "Refund": false,
                                                                                                                                                                                                                        "Recurring": false,
                                                                                                                                                                                                                            "UsePrevAmounts": false,
                                                                                                                                                                                                                                "RecInvCategoryID": 0,
                                                                                                                                                                                                                                    "SchFrequency": 0,
                                                                                                                                                                                                                                        "SchStartDate": "1999-12-31T00:00:00",
                                                                                                                                                                                                                                            "SchEndDate": "1999-12-31T00:00:00",
                                                                                                                                                                                                                                                "RecurringDescription": "",
                                                                                                                                                                                                                                                    "PaymentCCID": 22,
                                                                                                                                                                                                                                                        "InvoiceStatus": 13,
                                                                                                                                                                                                                                                            "AmountPaid": 100,
                                                                                                                                                                                                                                                                "RemainingBalance": 0,
                                                                                                                                                                                                                                                                    "IsDeleted": false,
                                                                                                                                                                                                                                                                        "DateCreated": "2018-08-30T04:46:09.19",
                                                                                                                                                                                                                                                                            "LastModified": "2018-08-30T04:50:44.113",
                                                                                                                                                                                                                                                                                "APAccountID": 5760,
                                                                                                                                                                                                                                                                                    "PayeeName": "Ankit test22",
                                                                                                                                                                                                                                                                                        "Note": "",
                                                                                                                                                                                                                                                                                            "LineItems": [],
                                                                                                                                                                                                                                                                                                "Links": [
                                                                                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                                                                                        "rel": "Line Items",
                                                                                                                                                                                                                                                                                                        "href": "/invoice/6497/lineitems"
                                                                                                                                                                                                                                                                                                    },
                                                                                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                                                                                        "rel": "Payments",
                                                                                                                                                                                                                                                                                                        "href": "/invoice/6497/payments"
                                                                                                                                                                                                                                                                                                    },
                                                                                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                                                                                        "rel": "Notes",
                                                                                                                                                                                                                                                                                                        "href": "/invoice/6497/notes"
                                                                                                                                                                                                                                                                                                    },
                                                                                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                                                                                        "rel": "Documents",
                                                                                                                                                                                                                                                                                                        "href": "/invoice/6497/documents"
                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                ]
}
  

cfg={
companyId:"2f436ea7-427d-4a12-9af5-73c8975c545d",
endPointURL:"https://test-f-mt.mineraltree.net",
username:"hannah.kim+tf+api@mineraltree.com",
password:"testRun#1"
};

vendor.process(msg,cfg);

 
