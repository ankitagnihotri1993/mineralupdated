const request = require("request-promise");
const CreateGLAccountURL = "/mtapi/base/services/glaccount/{companyId}";
const UpdateGLAccountURL = "/mtapi/base/services/glaccount";

const util = require("../utility.js");

module.exports = {
 
    createGLAccount: async function (body, cfg, etag)
    {
        var URL = cfg.endPointURL + CreateGLAccountURL.replace("{companyId}", cfg.companyId);
        return await request.post(util.requestOptions(URL, body, etag)).then(util.autoParse).catch(util.error);
    },
    updateGLAccount: async function (body,cfg, etag) {       
        var URL = cfg.endPointURL + UpdateGLAccountURL;
        return await request.put(util.requestOptions(URL, body, etag)).then(util.autoParse).catch(util.error);
    }
};