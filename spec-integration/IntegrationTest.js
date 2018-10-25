'use strict';

const expect = require('chai').expect;
const TestEmitter = require('./TestEmitter');
const verifyCredentials = require('../verifyCredentials');

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

    this.timeout(10000);

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


        describe('Verify Credentials Tests', function VerifyCredentialsTests() {
            it('Correct Password', async function CorrectPasswordTest() {
                const authResult = await verifyCredentials.call({}, cfg);
                expect(authResult).to.be.true;
            });
   
            it('Incorrect Password', async function IncorrectPasswordTest() {
                const wrongCfg = JSON.parse(JSON.stringify(cfg));
                wrongCfg.password = 'WrongPassword';
                const authResult = await verifyCredentials.call({}, wrongCfg);
                expect(authResult).to.be.false;
            });
        });

    });
});
