'use strict';
const _ = require("underscore");


function isEmpty(value) {
    return typeof value == "string" && !value.trim() || typeof value == "undefined" || value === null || value.length === 0;
}

function getMaxDate(result) {

    if (isEmpty(result)) return;

    const createdObj = _.max(result, function max(obj) { return new Date(obj.DateCreated).getTime(); });
    const updatedObj = _.max(result, function max(obj) { return new Date(obj.LastModified).getTime(); });
    // cheking both created date and modified date of caliber because caliber API not updating the updated data when user creating the new item
    if (new Date(createdObj.DateCreated) > new Date(updatedObj.LastModified)) {
        return createdObj.DateCreated;
    }
    else {
        return updatedObj.LastModified;
    }
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