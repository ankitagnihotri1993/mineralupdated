
const vendor = require('../../lib/actions/createUpdateInvoice');
var msg = {
    "body": {
    "InvoiceDetails": "",
    "SubsidiaryId": ""
}
}
var cfg;
msg.body.SubsidiaryId = "83ba591c-9662-4cda-8ec2-fbff0d498713";
msg.body.InvoiceDetails = {
    
"Links": [
{
"href": "/invoice/1299/lineitems",
"rel": "Line Items"
},
{
"href": "/invoice/1299/payments",
"rel": "Payments"
},
{
"href": "/invoice/1299/notes",
"rel": "Notes"
},
{
"href": "/invoice/1299/documents",
"rel": "Documents"
}
],
"LineItems": [
{
"LastModified": "2000-01-01T00:00:00",
"DateCreated": "2018-08-24T07:53:08.4",
"IsDeleted": false,
"PostingCodeID": 0,
"ROUnitID": 0,
"ROUnitAccountID": 0,
"LongDescription": "",
"ManualVendorCredit": false,
"RecNextAmount": 0,
"VendorCredit": false,
"GLTransactionID": 0,
"PostingDate": "2000-01-01T00:00:00",
"WorkOrderNumber": "",
"Adjustment": 0,
"Is1099Item": false,
"UnitPrice": 0,
"UnitOfMeasure": "",
"Quantity": 0,
"CostCenter": "2512 - MTReserve1",
"CostCenterID": 29,
"Amount": 60,
"ExpenseGLAccount": "1213 - MTFlorida GL#1s update",
"ExpenseGLAccountID": 9125,
"Description": "desc 60",
"VendorCode": "0",
"VendorCodeID": "392",
"InvoiceID": 1299,
"LineItemID": 1761
}
],
"Note": "",
"PayeeName": "#test_6/8/2018_13",
"APAccountID": 9125,
"LastModified": "2000-01-01T00:00:00",
"DateCreated": "2018-08-24T07:53:08.33",
"IsDeleted": false,
"RemainingBalance": 60,
"AmountPaid": 0,
"InvoiceStatus": 1,
"PaymentCCID": 29,
"RecurringDescription": "",
"SchEndDate": "2000-01-01T00:00:00",
"SchStartDate": "2000-01-01T00:00:00",
"SchFrequency": 0,
"RecInvCategoryID": 0,
"UsePrevAmounts": false,
"Recurring": false,
"Refund": false,
"ChangeInvoiceID": 0,
"VoidGLTransactionID": 0,
"VoidDate": "2000-01-01T00:00:00",
"Voided": false,
"PostingDate": "2000-01-01T00:00:00",
"APPosted": false,
"RejectedReason": "",
"RejectedByName": "AP",
"RejectedBy": 0,
"RejectedDate": "2000-01-01T00:00:00",
"Rejected": false,
"ReadyToPayDate": "2000-01-01T00:00:00",
"ReadyToPay": false,
"BoardApprovedDate": "2000-01-01T00:00:00",
"BoardApproved": false,
"MgrApprovedDate": "2000-01-01T00:00:00",
"MgrApproved": false,
"APApprovedDate": "2000-01-01T00:00:00",
"APApproved": false,
"OnHoldDate": "2000-01-01T00:00:00",
"OnHold": false,
"ValidatedDate": "2000-01-01T00:00:00",
"Validated": false,
"ReceivedDate": "2000-01-01T00:00:00",
"Received": false,
"DueDate": "2018-08-26T00:00:00",
"InvoiceDate": "2018-08-25T00:00:00",
"VendorNotes": "",
"PaymentGLAccountID": 9125,
"CombinePayments": false,
"ManualPaymentDate": "2000-01-01T00:00:00",
"ManualCheckNumber": 0,
"PaymentTypeID": -5,
"AcctTerm": "",
"AcctTermID": 6,
"PONumber": "",
"Amount": 60,
"APBasis": 0,
"InvoiceNumber": "MT#25",
"ClientID": 43,
"InvoiceID": 1299,
"AllowedHistTypes": 0,
"PaidDate": "0001-01-01T00:00:00",
"CurrentStatusText": "Created",
"CurrentStatus": 1,
"RequiresBoardApproval": false,
"AlreadyApprovedByThisUser": false,
"RejectedByDisplayName": "AP",
"ActualNumberOfApprovals": 0,
"RequiredNumberOfApprovers": 0,
"ReadyForBoardApproval": false,
"Acct": "1213 - MTFlorida GL#1s update",
"ContactAddress": {
"OneLine": "address1, address2, New Delhi, state  110095, india",
"Country": "india",
"ZipCode": "110095",
"State": "state",
"City": "New Delhi",
"Address2": "address2",
"Address1": "address1",
"UnitNumber": null,
"InCareOf": null,
"Name": null,
"IsDeleted": null,
"RefType": null,
"RefID": null,
"AddressID": 0
},
"Contact": "",
"Payee": "#test_6/8/2018_13",
"PayeeType": 14,
"PayeeID": 1627,
"AllowThisHistType": [
false,
false,
false,
false,
false,
false,
false
]

}                                                                                                                                                                                                                                            


                                                                                                                                                                                                                                                                                               
cfg={
companyId:"2f436ea7-427d-4a12-9af5-73c8975c545d",
endPointURL:"https://test-f-mt.mineraltree.net",
username:"hannah.kim+tf+api@mineraltree.com",
password:"testRun#1"
};

vendor.process(msg,cfg);

 
