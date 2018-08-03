const request = require('request-promise');
const CreateVendorURL = "/mtapi/base/services/vendor/{companyId}";
const UpdateVendorURL = "/mtapi/base/services/vendor";
const GetVendorURL = '/mtapi/base/services/search/{companyId}/objects';
const util = require("../utility.js");

module.exports = {
 
    createVendor: async function (msg,cfg, etag) {
        var apiCredentials = cfg.username + ":" + cfg.password;
        var fullUrl = cfg.endPointURL + CreateVendorURL.replace('{companyId}', cfg.companyId);

        console.log("fullUrl"+fullUrl);
        console.log("body in"+JSON.stringify(fullUrl));

        const requestOptions = {
            uri: `${fullUrl}`,
            headers: {
                'If-Match': etag,
                'Content-Type': 'application/json'
            },
            body: msg.body,
            json: true
        };

        return await request.post(requestOptions).then(util.autoParse).catch(util.error);
    },
    updateVendor: async function (msg,cfg, etag) {


         console.log("msg.body"+ JSON.stringify(msg.body));

        var apiCredentials = cfg.username + ":" + cfg.password;
        var fullUrl = cfg.endPointURL + UpdateVendorURL;
        const requestOptions = {
            uri: `${fullUrl}`,
              headers: {
                'If-Match': etag,
                'Content-Type': 'application/json'
            },
            body: msg.body,
            json: true
        };
        return await request.put(requestOptions).then(util.autoParse).catch(util.error);
    },
    getVendorList: async function (cfg, etag) {
        var apiCredentials = cfg.username + ":" + cfg.password;
        var fullUrl = cfg.endPointURL + GetVendorURL.replace('{companyId}', cfg.companyId);
         console.log("vendor url "+fullUrl);

        const requestOptions = {
            uri: `${fullUrl}`,
            headers: {
                'If-Match': etag,
                'Content-Type': 'application/json'
            },
            body: { "view": "VENDOR" },
            json: true
        };
        return await request.post(requestOptions).then(util.autoParse).catch(util.error);
    },  
};