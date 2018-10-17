"use strict";
module.exports = verify;
const accountService = require("./lib/commons/services/accountService.js");
/***
 * @param credentials object to retrieve apiKey from
 *
 * @returns Promise sending HTTP request and resolving its response
 */
async function verify(credentials) {
    return await accountService.login(credentials);
}


