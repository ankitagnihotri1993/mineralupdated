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
    function wasAuthenticationSuccessful(parameters,repsonse) {
        if (repsonse.statusCode >= 200 && repsonse.statusCode < 300) {
            return true;
        }

        if (repsonse.statusCode === 401) {
            return false;
        }

        throw new Error(`Request Parameters :${JSON.stringify(parameters)}
         Unexpected response from provider.  Status code: ${repsonse.statusCode} Body: 
         ${JSON.stringify(repsonse.body)}`);
    }


    async function getCompanies(etag) {
        const fullUrl = buildUrl('services/user/companies');
        const parameters = {
            followAllRedirects: true,
            url: fullUrl,
            method: 'GET',
            json: true,
            headers: {
                'If-Match': etag,
                'Content-Type': 'application/json'
            }
        };

        console.log(`make request.  Url: ${parameters.url}, Method: ${parameters.method}`);

        const response = await request(parameters);


        return response.body;
    }


    async function getEtagUsingUserCredentials() {
        const fullUrl = buildUrl('security/login');
        var authorization = 'MT ' + cfg.username + ':' + cfg.password;
        const parameters = {
            followAllRedirects: true,
            url: fullUrl,
            method: 'POST',
            json: true,
            headers: {
                Authorization: authorization
            }
        };

        console.log(`make request.  Url: ${parameters.url}, Method: ${parameters.method}`);

        const response = await request(parameters);

        if (!wasAuthenticationSuccessful(parameters, response)) {
            throw new Error(`Authentication error`);
        }

        const body = await getCompanies(response.headers.etag);
        if (body && body.companies) {
            const companylist = body.companies;

            if (companylist.length > 0) {


                const company = companylist.filter(res => res.id === cfg.companyId);

                if (company.length > 0) {

                    console.log(`responce: ${JSON.stringify(response)}`);

                    cfg.etag = response.headers.etag;

                    if (emitter && emitter.emit) {
                        emitter.emit('updateKeys', {
                            etag: cfg.etag
                        });
                    }
                    return cfg.etag;
                } else {

                    throw new Error(`You don't have permission to access the company:${cfg.companyId}`);
                }


            }
        }
        return '';
    }
    /**
     * Base caller function
     * @param {string} url
     * @param {string} method (GET || HEAD || OPTIONS ||  POST || PUT || DELETE || PATCH)
     * @param {Object} body for POST/PUT requests
     * @returns {Object} response body
     */
    this.makeRequest = async function makeRequest(url, method, body = undefined, skip = false) {
        const fullUrl = buildUrl(url);
        const etag = cfg.etag ? cfg.etag : await getEtagUsingUserCredentials();

        const parameters = {
            followAllRedirects: true,
            url: fullUrl,
            method: method,
            json: true,
            body: body,
            headers: {
                'If-Match': etag,
                'Content-Type': 'application/json'
            }
        };

        console.log(`make request.  Url: ${parameters.url}, Method: ${method}, parameters :${JSON.stringify(parameters)}`);

        const response = await request(parameters);

        if (!skip && !wasAuthenticationSuccessful(parameters,response)) {
            // reset the etag if authtication fail.
            cfg.etag = '';
            throw new Error(`Authentication error: ${response.body.error}: ${response.body.error_message}`);
        }


        return response.body;
    };

    /**
 * Base caller function
 * @param {string} url
 * @param {string} method (GET || HEAD || OPTIONS ||  POST || PUT || DELETE || PATCH)
 * @param {Object} body for POST/PUT requests
 * @returns {Object} response body
 */
    this.promiseRequest = async function promiseRequest(url, method, body = undefined) {
        const fullUrl = buildUrl(url);
        const etag = cfg.etag ? cfg.etag : await getEtagUsingUserCredentials();

        const parameters = {
            followAllRedirects: true,
            url: fullUrl,
            method: method,
            json: true,
            body: body,
            headers: {
                'If-Match': etag,
                'Content-Type': 'application/json'
            }
        };

        return request(parameters);
    };

    this.verifyCredentials = async function verifyCredentials() {
        return await getEtagUsingUserCredentials();

    };

    /**
  *
  * @return {[string]} - Alphabetic list of modules
  */
    this.getModules = async function getModules() {
        var modules = [];
        modules.vendor = 'Vendor';
        modules.bill = 'Bill';
        modules.Payment = 'Vendor';
    };


    return this;
};
