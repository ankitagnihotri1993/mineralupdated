const request = require("request-promise");
const CreateVendorURL = "/mtapi/base/services/vendor/{companyId}";
const util = require("../utility.js");

module.exports = {
 
    createVendor: async function (body,cfg, etag) {
        var URL = cfg.endPointURL + CreateVendorURL.replace("{companyId}", cfg.companyId);
        return await request.post(util.requestOptions(URL, body, etag)).then(util.autoParse).catch(util.error);
    }
    
}