const request = require('request-promise');
const CreateGLAccountURL = "/mtapi/base/services/glaccount/{companyId}";
const UpdateGLAccountURL = "/mtapi/base/services/glaccount";
const GetAllGLAccountURL="/mtapi/base/services/search/{companyId}/objects"

const util = require("../utility.js");

module.exports = {
 
    createGLAccount: async function (msg,cfg, etag) {

        console.log("body iN"+ msg.body);
            console.log("body IN format "+ JSON.stringify( msg.body));
        var apiCredentials = cfg.username + ":" + cfg.password;
        var fullUrl = cfg.endPointURL + CreateGLAccountURL.replace('{companyId}', cfg.companyId);
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
    updateGLAccount: async function (msg,cfg, etag) {

        var apiCredentials = cfg.username + ":" + cfg.password;
        
        var fullUrl = cfg.endPointURL + UpdateGLAccountURL;
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
    getGLAccountList: async function (cfg, etag) {
        var apiCredentials = cfg.username + ":" + cfg.password;
        var fullUrl = cfg.endPointURL + GetAllGLAccountURL.replace('{companyId}', cfg.companyId);
        const requestOptions = {
            uri: `${fullUrl}`,
            headers: {
                'If-Match': etag,
                'Content-Type': 'application/json'
            },
            body: { "view": "GLACCOUNT" },
            json: true
        };
        return await request.post(requestOptions).then(util.autoParse).catch(util.error);
    }
};