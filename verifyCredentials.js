'use strict';

const MTService = require('./lib/MTService');

module.exports = async function Verify(credentials) {

    const instance = new MTService(credentials, this);
    const responce = await instance.verifyCredentials();
    if (responce) {
        console.log('Successfully verified credentials.');
        return true;
    }
    console.log(`Error in validating credentials: ${JSON.stringify(responce)}`);
    return false;
};
