const request = require("request-promise");
const util = require("../utility.js");
module.exports = {
    login: async function (cfg) {

        var apiCredentials = cfg.username + ":" + cfg.password;

        const requestOptions = {
            uri: cfg.endPointURL + "/mtapi/base/security/login",
            headers: {
                "Authorization": "MT " + apiCredentials
            },
            json: true,
            resolveWithFullResponse: true
        };

        return await request.post(requestOptions).then(util.autoParse).catch(util.error);
    },
};
