'use strict';
module.exports= function isEmpty(value) {
        return typeof value === 'string' && !value.trim() || typeof value === 'undefined' || value === null || value.length === 0;
    };


