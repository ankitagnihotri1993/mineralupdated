'use strict';

const MTService = require('../MTService');
const { messages } = require('elasticio-node');
const helper = require('../helpers');

const Joi = require('joi');


const schema = Joi.object({
    term_externalId: Joi.string().allow('', null),
    glaccount_externalId: Joi.string().allow('', null),
    bill_externalId: Joi.string().allow('', null),
    class_externalId: Joi.string().allow('', null),
    vendor_externalId: Joi.string().allow('', null),
    payment_externalId: Joi.string().allow('', null)
}).unknown(true);


function parseBody(result) {
    if (!helper.isEmpty(result)) {
        if (result.count > 0) {
            return result.entities[0];
        }
    }
    return '';
}

async function promiseRequest(cfg, instance, view, query) {
    var body = {
        view: view,
        query: query
    };
    return await instance.promiseRequest(`services/search/${cfg.companyId}/objects`, 'POST', body);
}


exports.process = async function ProcessAction(msg, cfg) {

    const model = schema.validate(msg.body);

    if (model.error) {
        this.emit('error', `validation error: ${JSON.stringify(model.error.details)}`);
    }


    const instance = new MTService(cfg, this);
    let body = model.value;

    var request = [];
    var objectIndex = [];
    if (body.term_externalId) {
        objectIndex.push('TERMS');
        request.push(promiseRequest(cfg, instance, 'TERMS', 'externalId==' + body.term_externalId));
    }
    if (body.payment_externalId) {
        objectIndex.push('PAYMENT');
        request.push(promiseRequest(cfg, instance, 'PAYMENT', 'payment_externalId==' + body.term_externalId));
    }   

    if (body.glaccount_externalId) {
        objectIndex.push('GLACCOUNT');
        request.push(promiseRequest(cfg, instance, 'GLACCOUNT', 'gl_account_number_externalId==' + body.term_externalId));
        //  request.push();
    }
    if (body.bill_externalId) {
        objectIndex.push('BILL');
        request.push(promiseRequest(cfg, instance, 'BILL', 'bill_externalId==' + body.bill_externalId));
    }
    if (body.class_externalId) {
        objectIndex.push('CLASS');
        request.push(promiseRequest(cfg, instance, 'CLASS', 'dimension_externalId==' + body.class_externalId));
    }
    if (body.vendor_externalId) {
        objectIndex.push('VENDOR');
        request.push(promiseRequest(cfg, instance, 'VENDOR', 'vendor_externalId==' + body.vendor_externalId));

    }

    var responce = {};
    var promiseResult = await Promise.all(request);
    if (promiseResult.length > 0) {

        for (var i = 0; i < promiseResult.length; i++) {
            if (objectIndex[i] === 'TERMS') {
                responce.TERM = parseBody(promiseResult[i].body);
            }
            if (objectIndex[i] === 'BILL') {
                responce.BILL = parseBody(promiseResult[i].body);
            }
            if (objectIndex[i] === 'CLASS') {
                responce.CLASS = parseBody(promiseResult[i].body);
            }
            if (objectIndex[i] === 'VENDOR') {
                responce.VENDOR = parseBody(promiseResult[i].body);
            }

            if (objectIndex[i] === 'GLACCOUNT') {
                responce.GLACCOUNT = parseBody(promiseResult[i].body);
            }

            if (objectIndex[i] === 'PAYMENT') {
                responce.PAYMENT = parseBody(promiseResult[i].body);
            }
            

        }
    }


    this.emit('data', messages.newMessageWithBody(responce));
};


