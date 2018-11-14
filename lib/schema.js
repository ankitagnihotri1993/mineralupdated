'use strict'
// load Joi module
const Joi = require('joi');

const verifyCredentialSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(7).required(),
}).unknown(true);


const searchSchema = Joi.object({
    view: Joi.string().required(),
    query: Joi.string(),
    count: Joi.number().min(1),
    page: Joi.number().min(1),
    sortAsc: Joi.bool().default(true)
}).unknown(true);

// export the schemas
module.exports = {
    verifyCredentialSchema: verifyCredentialSchema,
    searchSchema: searchSchema
};