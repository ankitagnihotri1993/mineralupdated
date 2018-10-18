const request = require("request-promise");
const CreateItemURL = "/mtapi/base/services/item/{companyId}";
const util = require("../utility.js");

module.exports = {
 
    createItem: async function (body,cfg, etag) {
        var URL = cfg.endPointURL + CreateItemURL.replace("{companyId}", cfg.companyId);
        return await request.post(util.requestOptions(URL, body, etag)).then(util.autoParse).catch(util.error);
    }
}