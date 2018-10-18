'use strict';

const path = require('path');
const { promisify } = require('util');
const request = promisify(require('request'));
const _ = require('underscore');
const urlParser = require('url');

const API_URI = 'mtapi/base';


/**
 * Return configured API caller instance.  This caller instance handles authentication
 * @constructor
 * @param {Object} config
 * @param {string} config.baseUrl -  baseUrl
 * @param {string} config.companyId - companyId
 * @param {string} config.username - username
 * @param {string} config.password - password
 * @returns {{makeRequest: Function}}
 * @constructor
 */
module.exports = function Service(config, emitter) {
    if (!config || !config.baseUrl) {
        throw new Error('MT Configuration is missing base URL');
    }
    let cfg = {
        protocol: 'https:'
    };

    const url = urlParser.parse(config.baseUrl);

    if (url.protocol) {
        config.protocol = url.protocol;
    }

    if (url.hostname) {
        config.baseUrl = url.hostname + url.pathname;
    } else {
        config.baseUrl = url.pathname;
    }

    cfg = _.extend(cfg, config);


    function buildUrl(urlPath) {
        return cfg.protocol + '//' + path.join(cfg.baseUrl, API_URI, urlPath);
    }

    /**
     * Check the response from API.  Returns true for 200s responses authenticated.
     * Returns false if there is a problem with authentication.
     * Throws an exception for all other response codes.
     * @returns {boolean}
     */
    function wasAuthenticationSuccessful(repsonse) {
        if (repsonse.statusCode >= 200 && repsonse.statusCode < 300) {
            return true;
        }

        if (repsonse.statusCode === 401) {
            return false;
        }

        throw new Error(`Unexpected response from provider.  Status code: ${repsonse.statusCode} Body: 
            ${JSON.stringify(repsonse.body)}`);
    }
    

    /**
     * Base caller function
     * @param {string} url
     * @param {string} method (GET || HEAD || OPTIONS ||  POST || PUT || DELETE || PATCH)
     * @param {Object} body for POST/PUT requests
     * @returns {Object} response body
     */
    this.makeRequest = async function makeRequest(url, method, body = undefined) {
        const fullUrl = buildUrl(url);
        const etag = cfg.etag ? cfg.etag : await getEtagUsingUserCredentials();

        const parameters = {
            followAllRedirects: true,
            url: fullUrl,
            method: method,
            json: true,
            body: body,
            headers: {
                "If-Match": etag,
                "Content-Type": "application/json"
            }
        };

        console.log(`make request.  Url: ${parameters.url}, Method: ${method}`);

        const response = await request(parameters);

        if (!wasAuthenticationSuccessful(response)) {
            // reset the etag if authtication fail.
            cfg.etag = "";
            throw new Error(`Authentication error: ${response.body.error}: ${response.body.error_message}`);
        }
        return response.body;
    };

    this.verifyCredentials = function () {
        return await getEtagUsingUserCredentials()

    }


    async function getEtagUsingUserCredentials() {
        const fullUrl = buildUrl("security/login");
        var authorization = "MT "+ cfg.username + ":" + cfg.password;
        const parameters = {
            followAllRedirects: true,
            url: fullUrl,
            method: "POST",
            json: true,
            headers: {
                "Authorization": authorization
            }
        };

        console.log(`make request.  Url: ${parameters.url}, Method: ${method}`);

        const response = await request(parameters);

        if (!wasAuthenticationSuccessful(response)) {
            throw new Error(`Authentication error: ${response.body.error}: ${response.body.error_message}`);
        }

        cfg.etag = response.headers.etag;

        if (emitter && emitter.emit) {
            emitter.emit('updateKeys', {
                etag: cfg.etag
            });
        }
        return cfg.etag;
    };

    return this;
};