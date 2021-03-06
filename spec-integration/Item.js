'use strict';

const expect = require('chai').expect;
const TestEmitter = require('./TestEmitter');
const UpsertItem = require('../lib/actions/item/upsertItem');

const fs = require('fs');
describe('Item Test', function searchObject() {
    const credential1 = {
        endPointURL_mt: 'https://test-f-mt.mineraltree.net',
        companyId_mt: '2f436ea7-427d-4a12-9af5-73c8975c545d'  //'b1437587-acf2-46fe-9846-739dbc996310'
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


        describe('ActionUpsertItem ', function VerifyCredentialsTests() {
            it('ActionUpsertItem', async function ActionUpsertItem() {
                const emitter = new TestEmitter();
                const msg = {
                    body: {
                        item: {
     
                            subsidiaries: [
                                {
                                    id: '685b0273-78f7-4f8c-82a6-744f9053ff80'
                                }
                                
                            ],
                            type: 'INVENTORY',
                            cost: {
                                amount: '500',
                                precision: '2'
                            },
                            residual: {
                                amount: '100'
                            },
                            name: 'Magic Item',
                            active: false,
                            externalId: 5757
                        }
                    }
                };

                await UpsertItem.process.call(emitter, msg, cfg);
                console.log('responce' + JSON.stringify(emitter.data[0].body));

                expect(emitter.data.length).to.equal(1);
            });

        });

    });
});


