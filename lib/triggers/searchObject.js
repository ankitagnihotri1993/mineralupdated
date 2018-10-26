'use strict';

const MTService = require('../MTService');
const schema = require('../schema');
const helper = require('../helpers');
const { messages } = require('elasticio-node');

exports.process = async function ProcessTrigger(msg, cfg, snapshot) {
    snapshot = snapshot || {};
    snapshot.lastUpdated = snapshot.lastUpdated || (new Date(0)).toISOString();

    const result = schema.searchSchema.validate(cfg);

    if (result.error)
        throw new Error(`validation error: ${result.error.details}`);


    if (result.value.query) {
        result.value.query = result.value.query +";modified>" + snapshot.lastUpdated;
    } else {
        result.value.query = "modified>" + snapshot.lastUpdated;
    }


    var requestbody = {
        "view": result.value.view,
        "query": result.value.query,
        "count": result.value.count,
        "page": result.value.page,
        "sortAsc": result.value.sortAsc
    }




    const instance = new MTService(cfg, this);
    const responce = await instance.makeRequest(`services/search/${cfg.companyId}/objects`, 'POST', requestbody);

    if (!responce || !Array.isArray(responce.entities)) {
        throw new Error(`Expected records array.  Instead received: ${JSON.stringify(responce)}`);
    }
    const resultsList = helper.filterDataBasedOnLastModifiedDate(responce.entities, snapshot.lastUpdated);

    console.log('Found %d new records.', resultsList.length);
    if (resultsList.length > 0) {
        resultsList.forEach((record) => {
            this.emit('data', messages.newMessageWithBody(record));
        });

        snapshot.lastUpdated = resultsList[resultsList.length - 1].modified;
        console.log(`New snapshot: ${snapshot.lastUpdated}`);
        this.emit('snapshot', snapshot);
    }
};


