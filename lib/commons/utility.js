const _ = require('underscore');
//var colors = require('colors/safe'); 

module.exports = {
    autoParse: function (body, response, resolveWithFullResponse) {
        console.log("body" + JSON.stringify(body));
        return body;
    },
    error: function (reason) {
        console.log('Oops! Error occurred - ', reason);
        throw new Error(reason);

    },
    isEmpty:function(value) {
        return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
      },
 previousDate:function()
  {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    return  date.toISOString()
    },

    requestOptions: function (URL, body, etag) {

        const requestOptions = {
            uri: `${URL}`,
            headers: {
                'If-Match': etag,
                'Content-Type': 'application/json'
            },
            body: body,
            json: true
        };
        console.log('request : %s'+ JSON.stringify(requestOptions));
        return requestOptions; 
    },

    filterDataBasedOnLastModifiedDate: function (result, lastItemUpdatedDate) {

        console.log(colors.green('Snapshot : %s'), lastItemUpdatedDate);
        var filterResult;
        if (this.isEmpty(lastItemUpdatedDate))
        {
         filterResult = result;
        }
        else
        {
     filterResult = result.filter(res =>  (new Date(res.modified) > new Date(lastItemUpdatedDate)) );
     
        }
        return filterResult;
    }

};  
