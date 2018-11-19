'use strict';
const _ = require('underscore');


function isEmpty(value) {
    return typeof value === 'string' && !value.trim() || typeof value === 'undefined' || value === null || value.length === 0;
}

function getMaxDate(result) {

    if (isEmpty(result)) {return;}

    var modifiedObj = _.max(result, function max(obj) {
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
function isUpdatedRecord(jsonObject1, jsonObject2) {

    var newJson = false;

    if (isEmpty(jsonObject1)) {

        return true;
    }

    if (isEmpty(jsonObject2)) {

        return true;
    }

    // remove the null keys
    Object.keys(jsonObject1).forEach(k => (!jsonObject1[k] && jsonObject1[k] !== undefined) && delete jsonObject1[k]);

    var keys = Object.keys(jsonObject1);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var isObject = jsonObject1[key] instanceof Object;
        if (isObject) {
            console.log('isobject' + key);
        }
        if (!isObject) {

            if (jsonObject1[key] !== jsonObject2[key]) {

                console.log(`KEY: ${key} - ${jsonObject1[key]} : ${jsonObject2[key]}`);
                newJson = true;
                break;
            }
        }
    }

    return newJson;
}

exports.isEmpty = isEmpty;
exports.getMaxDate = getMaxDate;
exports.filterDataBasedOnLastModifiedDate = filterDataBasedOnLastModifiedDate;
exports.isUpdatedRecord = isUpdatedRecord;
