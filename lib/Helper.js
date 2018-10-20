'use strict';
module.exports = {
 
    isEmpty: function (value) {
        return typeof value == "string" && !value.trim() || typeof value == "undefined" || value === null || value.length === 0;
    }
    
}
