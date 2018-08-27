const request = require('request-promise');
const GetInvoiceURL = '/mtapi/base/services/search/{companyId}/objects';
const CreateUpdateInvoiceURL = '/mtapi/base/services/bill/';
const createSubsidiaryURL = "/mtapi/base/services/subsidiary/{companyId}";
const createClassificationURL = '/mtapi/base/services/classification/{companyId}';
const CreateInvoicePaymentURL = '/mtapi/base/services/payment/{companyId}';
const createPaymentMethodURL = '/mtapi/base/services/pm/{companyId}'
const util = require("../utility.js");

module.exports = {

    createUpdateInvoice: async function (body, cfg, etag)
    {
        var URL = '';
        if (body.bill.id) {
            URL = cfg.endPointURL + CreateUpdateInvoiceURL;
        }
        else
        {
           URL = cfg.endPointURL + CreateUpdateInvoiceURL + cfg.companyId;
        }     
        if (body.bill.id) {

            // Update invoice
            return await request.put(util.requestOptions(URL, body, etag)).then(util.autoParse).catch(util.error);
        }
        else
        {
            // Create invoice
            return await request.post(util.requestOptions(URL, body, etag)).then(util.autoParse).catch(util.error);
        }
    },
    createSubsidiary: async function (body, cfg, etag) {
        var URL = cfg.endPointURL + createSubsidiaryURL.replace('{companyId}', cfg.companyId);  
        return await request.post(util.requestOptions(URL, body, etag)).then(util.autoParse).catch(util.error);
    },
    createPaymentMethod: async function (body, cfg, etag) {
        var URL = cfg.endPointURL + createPaymentMethodURL.replace('{companyId}', cfg.companyId);
        return await request.post(util.requestOptions(URL, body, etag)).then(util.autoParse).catch(util.error);
    },
    createClassification: async function (body, cfg, etag) {
        var URL = cfg.endPointURL + createClassificationURL.replace('{companyId}', cfg.companyId);
        return await request.post(util.requestOptions(URL, body, etag).then(util.autoParse).catch(util.error);
    },
    createInvoicePayment: async function (body, cfg, etag) {

        var URL = cfg.endPointURL + CreateInvoicePaymentURL.replace('{companyId}', cfg.companyId);
        return await request.post(util.requestOptions(URL, body, etag)).then(util.autoParse).catch(util.error);
    }
};