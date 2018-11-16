'use strict';

const expect = require('chai').expect;
const TestEmitter = require('./TestEmitter');
const verifyCredentials = require('../verifyCredentials');

const upsertInvoiceCaliber = require('../lib/actions/invoice/upsertInvoiceCaliber');


const schema = require('../lib/schema');
describe('Integration Test', function GetEntryTest() {
    const credential1 = {
        customer_name: 'Test Inc',
        apiKey_cal: 'MTUAT01',
        username_cal: 'mtconnect@mineraltree.com',
        password_cal: 'System01##',
        endPointURL_cal: 'https://asp.calibersoftware.com/capi2_APISandbox',
        username_mt: 'hannah.kim+uat+api@mineraltree.com',
        password_mt: 'testRun#1',
        endPointURL_mt: 'https://test-f-mt.mineraltree.net',
        companyId_mt: 'a630ca06-7c88-49f5-846b-d8011c8ceb70'
    };

    // this.timeout(10000);

    //if (fs.existsSync('.env')) {
    //    require('dotenv').config();
    //}


    const cfgs = [
        {
            username: credential1.username_mt,
            password: credential1.password_mt,
            baseUrl: credential1.endPointURL_mt,
            companyId: credential1.companyId_mt

        }
    ];

    cfgs.forEach(cfg => {


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
        //});


        describe('Invoice Tests', function VerifyCredentialsTests() {
            it('Correct invoice', async function correctInvoice() {
                var body = {
                    PaymentCCID: 29,
                    DueDate: '2000-01-01T00:00:00',
                    InvoiceDate: '2018-06-12T03:09:15',
                    AcctTermID: 1,
                    PONumber: '',
                    Amount: 12,
                    InvoiceNumber: '12',
                    ClientID: '340a2386-3b87-4c26-91f7-4d638ea42252',
                    InvoiceID: 1033,
                    PayeeID: 95,
                    state: 'Open',
                    LineItems: [
                        {
                            CostCenterID: 23,
                            Amount: 12,
                            ExpenseGLAccountID: 8812,
                            Description: 'sdfds',
                            VendorCredit: false
                        }
                    ]
                };

                var msg = {
                    body: body
                };


                const authResult = await upsertInvoiceCaliber.process(msg, cfg);
                expect(authResult).to.be.true;
            });


        });


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
