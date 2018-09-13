/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
/* eslint-disable node/no-unpublished-require */
'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const {expect} = chai;
const sinon = require('sinon');

const getInvoiceListTrigger = require('../lib/triggers/invoice/getInvoiceList');

const verifyCredentials = require('../verifyCredentials');


describe('Integration Test', function () {

    let cfg;
    let emitter;
    let snapshot;
    this.timeout(30000);

  beforeEach(function () {
   cfg =
    {
       companyId: "2f436ea7-427d-4a12-9af5-73c8975c545d",
       endPointURL: "https://test-f-mt.mineraltree.net",
       username: "hannah.kim+tf+api@mineraltree.com",
       password: "testRun#1"
          };

    emitter = {
      emit: sinon.spy()
    };
  });

   describe('Trigger Tests', function ()
    {
       it('getInvoiceListTrigger', async function () {

           const testCall = getInvoiceListTrigger.process.call(cfg, snapshot);
      expect(testCall).to.be.rejectedWith(Error, 'no data found');
      try{
        await testCall;
        // eslint-disable-next-line no-empty
      } catch (e) {}

      const emittedObjectsAfterCallOne = emitter.emit.withArgs('data').callCount;
      expect(emittedObjectsAfterCallOne).to.be.above(1);
    });
  });


  describe('Verify Credential Tests', function () {
    it('Success Case', async function () {
      const result = await verifyCredentials(cfg);
      expect(result).to.be.true;
    });
  });

  
});
