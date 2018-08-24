
module.exports = {
    autoParse: function (body, response, resolveWithFullResponse) {
       // console.log("body" + JSON.stringify(body))
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
    return  date.toLocaleString();
  }  
}