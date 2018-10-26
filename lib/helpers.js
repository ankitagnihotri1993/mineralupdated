'use strict';
const _ = require("underscore");


function isEmpty(value) {
    return typeof value == "string" && !value.trim() || typeof value == "undefined" || value === null || value.length === 0;
}

function getMaxDate(result) {

    if (isEmpty(result)) return;

    var modifiedObj = _.max(result, function (obj) {
        return new Date(obj.modified).getTime();
    });
    return modifiedObj.modified;
}
function filterDataBasedOnLastModifiedDate(result, lastItemUpdatedDate) {

    var filterResult;

    try {
        if (isEmpty(lastItemUpdatedDate)) {

            filterResult = result;

        } else {

            filterResult = result.filter(res =>             
                (new Date(res.modified) > new Date(lastItemUpdatedDate))
            );

        }
    } catch (ex) {

        throw new Error(ex);
    }
    return filterResult;
}






exports.isEmpty = isEmpty;
exports.getMaxDate = getMaxDate;
exports.filterDataBasedOnLastModifiedDate = filterDataBasedOnLastModifiedDate;