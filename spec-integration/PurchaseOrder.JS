'use strict';

const expect = require('chai').expect;
const TestEmitter = require('./TestEmitter');
const createPurchaseOrder = require('../lib/actions/purchaseOrder/createPurchaseOrder');

const fs = require('fs');
describe('Purcahse_Order Test', function searchObject() {
    const credential1 = {
        endPointURL_mt: 'https://test-f-mt.mineraltree.net',
        companyId_mt: 'b1437587-acf2-46fe-9846-739dbc996310'
    };

    this.timeout(100000);

    if (fs.existsSync('.env')) {
        require('dotenv').config();
    }

    const cfgs = [
        {
            baseUrl: credential1.endPointURL_mt,
            companyId: credential1.companyId_mt

        }
    ];

    cfgs.forEach(cfg => {

        cfg.etag = '7d3e89d0a83d7c15387e16c00210e8011ad35ee2627147ddc7aa462a3a26d0b38e026bb2d80fbf3c01511861bbb8c72dec43eebe9684d0e5e9ce1daa34e4c425';


        describe('ActionPurchase_OrderObject ', function VerifyCredentialsTests() {
            it('ActionPurchase_OrderObject', async function ActionPurchase_OrderObject() {
                const emitter = new TestEmitter();
                const msg = {
                    body: {
                        purchaseOrder: {
                            externalId: '13001',
                            vendor: {
                                id: '9b047e95-61ba-4f00-8001-e7427ca6cce6',
                            },
                            poNumber: '536546',
                            poType: 'Standard',
                            dueDate: '2018-09-27T04:29:54Z',
                            items: [
                                {
                                    companyItem: {
                                        id: 'cbd7dab5-8e67-4e2b-b6a2-a4cea726d9a9'
                                    },
                                    name: 'sagetomt item1',
                                    quantity: {
                                        value: 12,
                                        precision:2,
                                    },
                                    quantityReceived: {
                                        value: 12,
                                        precision: 2
                                    },
                                    billedQuantity: {
                                        value: 12,
                                        precision:2
                                    },
                                    amountDue: {
                                        amount: 120
                                    },
                                    cost: {
                                        amount: 10
                                    },
                                    lineNumber: 1,
                                    closed: false,
                                    description: 'item from sage 50'
                                }, {
                                    companyItem: {
                                        id: '917aa1c6-6389-4869-8427-36543b777d00'
                                    },
                                    name: 'sagetomt item1',
                                    quantity: {
                                        value: 12,
                                        precision: 2
                                    },
                                    quantityReceived: {
                                        value: 12,
                                        precision: 2
                                    },
                                    billedQuantity: {
                                        value: 12,
                                        precision: 2
                                    },
                                    amountDue: {
                                        amount: 120
                                    },
                                    cost: {
                                        amount: 10
                                    },
                                    lineNumber: 1,
                                    closed: false,
                                    description: 'item from sage 50'
                                }
                            ]
                        }
                    }
                };

                await createPurchaseOrder.process.call(emitter, msg, cfg);
                console.log('responce' + JSON.stringify(emitter.data[0].body));

                expect(emitter.data.length).to.equal(1);
            });

        });

    });
});


