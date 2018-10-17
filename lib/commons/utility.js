const _ = require("underscore");
var colors = require("colors/safe");

module.exports = {
    autoParse: function (response) {
        var body;
        if (response.statusCode == 200) 
        {
        console.log("response" +JSON.stringify(response));
            if (response.body) 
            {
                body = response.body
                console.log(colors.green("responce : %s"), JSON.stringify(response.body));
                return body;
            }
            if (response.headers) // In the case of login request we get etag in the headers
             {
                body = response.headers
                console.log(colors.green("responce : %s"), JSON.stringify(response.headers));
                return body;

            }

        }
        return body;

    },
    error: function (reason) {
        colors.red("Error: " + reason);
        throw new Error(reason);

    },
    errorWithThrow: function (reason) {
        console.log(colors.red("Error : %s"), reason);
        throw new Error(reason);
    },
    isEmpty: function (value) {
        return typeof value == "string" && !value.trim() || typeof value == "undefined" || value === null || value.length === 0;
    },
    requestOptions: function (URL, body, etag) {

        const requestOptions = {
            uri: `${URL}`,
            headers: {
                "If-Match": etag,
                "Content-Type": "application/json"
            },
            body: body,
            json: true,
            resolveWithFullResponse: true
        };
        console.log("request : %s" + JSON.stringify(requestOptions));
        return requestOptions;
    },

    filterDataBasedOnLastModifiedDate: function (result, lastItemUpdatedDate) {

        console.log(colors.green("Snapshot : %s"), lastItemUpdatedDate);

        var filterResult;
        if (this.isEmpty(lastItemUpdatedDate)) {
            filterResult = result;
        }
        else {
            filterResult = result.filter(res => (new Date(res.modified) > new Date(lastItemUpdatedDate)));

        }
        return filterResult;
    },
    getMaxDate: function (result) {

        if (this.isEmpty(result)) return;

        var modifiedObj = _.max(result, function (obj) {
            return new Date(obj.modified).getTime();
        });
        return modifiedObj.modified;
    },
    getEtag: async function (accountService, cfg) {
        var loginResult = await accountService.login(cfg);
        if (this.isEmpty(loginResult)) throw new Error("Invalid User login!");
        return loginResult.etag;

    }

}
