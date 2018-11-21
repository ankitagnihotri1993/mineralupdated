'use strict';

const expect = require('chai').expect;
const TestEmitter = require('./TestEmitter');
const verifyCredentials = require('../verifyCredentials');

const upsertInvoiceCaliber = require('../lib/actions/invoice/upsertInvoiceCaliber');
const searchAPI = require('../lib/actions/search/searchObject');
const paymentMethod = require('../lib/actions/payment/getPaymentMethod');
const actionGetExternalObjectsbyId = require('../lib/actions/getExternalObjectsbyExternalId');
const actionupsertPaymentMethod = require('../lib/actions/payment/upsertPaymentMethod');


const schema = require('../lib/schema');
const fs = require('fs');
describe('Integration Test', function GetEntryTest() {
    const credential1 = {
        customer_name: 'Test Inc',
        apiKey_cal: 'MTUAT01',
        username_cal: 'mtconnect@mineraltree.com',
        password_cal: 'System01##',
        endPointURL_cal: 'https://asp.calibersoftware.com/capi2_APISandbox',
        username_mt: 'msaifullah+api@magicsoftware.com',
        password_mt: 'Key@MagicSoftware1',
        endPointURL_mt: 'https://test-f-mt.mineraltree.net',
        companyId_mt: '2f436ea7-427d-4a12-9af5-73c8975c545d'
    };

    this.timeout(100000);

    if (fs.existsSync('.env')) {
        require('dotenv').config();
    }


    const cfgs = [
        {
            username: credential1.username_mt,
            password: credential1.password_mt,
            baseUrl: credential1.endPointURL_mt,
            companyId: credential1.companyId_mt

        }
    ];

    cfgs.forEach(cfg => {

        cfg.etag = '7d3e89d0a83d7c15387e16c00210e8011ad35ee2627147ddc7aa462a3a26d0b38e026bb2d80fbf3c01511861bbb8c72dec43eebe9684d0e5e9ce1daa34e4c425';
        //describe('Verify Credentials Tests', function VerifyCredentialsTests() {
        //    it('Correct Password', async function CorrectPasswordTest() {
        //        const authResult = await verifyCredentials.call({}, cfg);
        //        expect(authResult).to.be.true;
        //    });

        //    it('Incorrect Password', async function IncorrectPasswordTest() {
        //        const wrongCfg = JSON.parse(JSON.stringify(cfg));
        //        wrongCfg.password = 'WrongPassword';
        //        const authResult = await verifyCredentials.call({}, wrongCfg);
        //        expect(authResult).to.be.false;
        //    });
        ////});
        //describe('getPaymentMethod Tests', function VerifyCredentialsTests() {
        //    it('getPaymentMethod test', async function getPaymentMethod() {
        //        const emitter = new TestEmitter();
        //        const msg = {
        //            body: {
        //                externalId: '1299'
        //            }
        //        };

        //        await paymentMethod.process.call(emitter, msg, cfg);
        //        console.log('responce' + JSON.stringify(emitter.data[0].body));

        //        expect(emitter.data.length).to.equal(1);
        //        //expect(emitter.data[0].body.name).to.be.equal('Fred Jones');
        //    });

        //});
        describe('upsertPaymentMethod Tests', function VerifyCredentialsTests() {
            it('getPaymentMethod test', async function getPaymentMethod() {
                const emitter = new TestEmitter();
                const msg = {
                    body: {
                        paymentMethod: {
                            type: 'CREDITCARD',
                            externalId: 851654545,
                            status: 'Active',
                            subsidiary: {
                                id: 'ffd53ba9-a225-43b6-9404-47c930648181'
                            },
                            bankAccount: {
                                name: 'David COA',
                                accountNumber: '0003',
                                accountBalance: {
                                    availableBalance: {
                                        amount: 0
                                    }
                                }
                            },
                            card:
                            {

                                name: 'sfdf'
                            }
                        }
                    }
                };

                await actionupsertPaymentMethod.process.call(emitter, msg, cfg);
                console.log('responce' + JSON.stringify(emitter.data[0].body));

                expect(emitter.data.length).to.equal(1);
                //expect(emitter.data[0].body.name).to.be.equal('Fred Jones');
            });

        });


        //describe('getExternalObjectsbyId Tests', function VerifyCredentialsTests() {
        //    it('getExternalObjectsbyId test', async function getExternalObjectsbyId() {
        //        const emitter = new TestEmitter();
        //        const msg = {
        //            body: {
        //                term_externalId: '1',
        //                glaccount_externalId: '',
        //                bill_externalId: '6564',
        //                class_externalId: '1',
        //                vendor_externalId: '1669'
        //            }
        //        };

        //        await actionGetExternalObjectsbyId.process.call(emitter, msg, cfg);
        //        console.log('responce' + JSON.stringify(emitter.data[0].body));

        //        expect(emitter.data.length).to.equal(1);
        //        //expect(emitter.data[0].body.name).to.be.equal('Fred Jones');
        //    });

        //});

        //describe('Invoice Tests', function VerifyCredentialsTests() {
        //    it('Correct invoice', async function correctInvoice() {

        //        var caliberinvoice = {
        //            InvoiceID: 6564,
        //            ClientID: 15,
        //            InvoiceNumber: '16Nov#1',
        //            APBasis: null,
        //            ActualNumberOfApprovals: 0,
        //            Amount: 85,
        //            PONumber: '',
        //            AcctTermID: 0,
        //            AcctTerm: '',
        //            PaymentTypeID: -5,
        //            ManualCheckNumber: 0,
        //            ManualPaymentDate: '2000-01-01T00:00:00',
        //            CombinePayments: false,
        //            PaymentGLAccountID: 5760,
        //            VendorNotes: '',
        //            InvoiceDate: '2018-11-14T00:00:00',
        //            DueDate: '2018-11-14T00:00:00',
        //            Received: false,
        //            ReceivedDate: '1999-12-31T00:00:00',
        //            Validated: false,
        //            ValidatedDate: '1999-12-31T00:00:00',
        //            OnHold: false,
        //            OnHoldDate: '1999-12-31T00:00:00',
        //            APApproved: false,
        //            APApprovedDate: '1999-12-31T00:00:00',
        //            MgrApproved: false,
        //            MgrApprovedDate: '1999-12-31T00:00:00',
        //            BoardApproved: false,
        //            BoardApprovedDate: '1999-12-31T00:00:00',
        //            ReadyToPay: false,
        //            ReadyToPayDate: '2018-11-15T00:00:00',
        //            Rejected: false,
        //            RejectedDate: '1999-12-31T00:00:00',
        //            RejectedBy: -1,
        //            RejectedByName: 'Board Member',
        //            RejectedReason: '',
        //            APPosted: false,
        //            PostingDate: '2000-01-01T00:00:00',
        //            Voided: false,
        //            VoidDate: '2000-01-01T00:00:00',
        //            VoidGLTransactionID: 0,
        //            ChangeInvoiceID: 0,
        //            Refund: false,
        //            Recurring: false,
        //            UsePrevAmounts: false,
        //            RecInvCategoryID: 0,
        //            SchFrequency: 0,
        //            SchStartDate: '2000-01-01T00:00:00',
        //            SchEndDate: '2000-01-01T00:00:00',
        //            RecurringDescription: '',
        //            PaymentCCID: 0,
        //            InvoiceStatus: 13,
        //            AmountPaid: 85,
        //            RemainingBalance: 0,
        //            RequiredNumberOfApprovers: 1,
        //            IsDeleted: false,
        //            DateCreated: '2000-01-01T00:00:00',
        //            LastModified: '2000-01-01T00:00:00',
        //            APAccountID: 0,
        //            PayeeID: 1669,
        //            PayeeType: 14,
        //            PayeeName: 'Default Test',
        //            Note: '',
        //            LineItems: [],
        //            Links: [
        //                {
        //                    rel: 'Line Items',
        //                    href: '/invoice/6564/lineitems'
        //                },
        //                {
        //                    rel: 'Payments',
        //                    href: '/invoice/6564/payments'
        //                },
        //                {
        //                    rel: 'Notes',
        //                    href: '/invoice/6564/notes'
        //                },
        //                {
        //                    rel: 'Documents',
        //                    href: '/invoice/6564/documents'
        //                }
        //            ]
        //        };
        //        const emitter = new TestEmitter();


        //        var body = {
        //            PaymentCCID: caliberinvoice.PaymentCCID,
        //            DueDate: caliberinvoice.DueDate,
        //            InvoiceDate: caliberinvoice.InvoiceDate,
        //            AcctTermID: caliberinvoice.AcctTermID,
        //            PONumber: caliberinvoice.PONumber,
        //            Amount: caliberinvoice.Amount,
        //            InvoiceNumber: caliberinvoice.InvoiceNumber,
        //            ClientID: caliberinvoice.ClientID,
        //            InvoiceID: caliberinvoice.InvoiceID,
        //            PayeeID: caliberinvoice.PayeeID,
        //            state: 'Open',
        //            LineItems: [
        //                {
        //                    CostCenterID: 23,
        //                    Amount: 12,
        //                    ExpenseGLAccountID: 8812,
        //                    Description: 'sdfds',
        //                    VendorCredit: false
        //                }
        //            ]
        //        };


        //        const msg = {
        //            body: body
        //        };
        //        try {
        //            await upsertInvoiceCaliber.process.call(emitter, msg, cfg);
        //        } catch (ex) {
        //            console.log(ex);
        //        }

        //        expect(emitter.data.length).to.equal(1);
        //        //(emitter.data[0].body.name).to.be.equal('Fred Jones');
        //    });


        //});


    });
});


//describe('Schema Test', function GetEntryTest() {
//    const credential1 = {
//        customer_name: 'Test Inc',
//        apiKey_cal: 'MTUAT01',
//        username_cal: 'mtconnect@mineraltree.com',
//        password_cal: 'System01##',
//        endPointURL_cal: 'https://asp.calibersoftware.com/capi2_APISandbox',
//        username_mt: 'hannah.kim+uat+api@mineraltree.com',
//        password_mt: 'testRun#1',
//        endPointURL_mt: 'https://test-f-mt.mineraltree.net',
//        companyId_mt: 'a630ca06-7c88-49f5-846b-d8011c8ceb70'
//    };

//    describe('Verify Schema Tests', function verifySchema() {
//        it('verify Credential Schema', async function CorrectSchema() {
//            const result = schema.verifyCredentialSchema.validate({
//                username: 'brunoluiz',
//                rating: 5,
//                email: 'contact@brunoluiz.net',
//                password: 'brunoluiz'
//            });

//            expect(!result.error).to.be.true;
//        });


//        it('verify Search Schema', async function CorrectSchema() {
//            const result = schema.searchSchema.validate({
//                view: 'brunoluiz',
//                rating: 5,
//                count: 1,
//                password: 'brunoluiz'
//            });
//            if (result.error) {
//                console.log(result.error.details);
//            } else {
//                console.log(result);

//            }

//            expect(!result.error).to.be.true;
//        });
//    });

//});


